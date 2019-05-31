  (function ($, OliveUI) {
    OliveUI.modules.new_brokerage_object_grid_widget_js = function (config = {}) {

      config.height = config.minHeight || 100;
      'use strict';
      var widgetFileNames = [];
      var indexedListNames = [];
      var indexListobjToUpdate = {};
      indexListobjToUpdate.list = [];
      indexListobjToUpdate.ignoredlist = [];
      var functionnames = [];
      var resultsJSON = [];
      var unencodedcontent;
      var namesToAddToList;
      var namesToDeleteFromList;
      var updatedIndexList;
      var listsha;
      var widgetlist;
      var instance;
      widgetcontainer = document.createElement('div');
      widgetcontainerinner = document.createElement('div');
      var grid = {
        type: "Grid",
        render: function (gridrendercontent) {
          if(typeof gridrendercontent.indexurl !=='undefined' && typeof gridrendercontent.indexfilename !=='undefined' && gridrendercontent.indexurl !=='' && gridrendercontent.indexfilename !==''  )
          {
          var getDataAjax = $.ajax({
              url: gridrendercontent.indexurl + "/" + gridrendercontent.indexfilename,
              beforeSend: setAuthHeader.bind(gridrendercontent),
              dataType: 'json'
            }).done(function (response) {
              resultsJSON = [];
              produceWidgetContent.call(null, response);
              if ((typeof gridrendercontent.token !== 'undefined') && (gridrendercontent.token != "") && (gridrendercontent.token != "defaulttoken")) {
                getListOfObjects(gridrendercontent); // used fo r creation/update of indexlist - only for admin = authenticated users
              }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
              if (jqXHR.status == '404') {
                alert("didnt find existing indexlist, creating new if proper authorization token provided...");
                resultsJSON = [];
                var response = {};
                response.content = btoa('{"list":[],"ignoredlist":[]}');
                produceWidgetContent.call(null, response);
                if ((typeof gridrendercontent.token !== 'undefined') && (gridrendercontent.token != "") && (gridrendercontent.token != "defaulttoken")) {
                  getListOfObjects(gridrendercontent); // used fo r creation/update of indexlist - only for admin = authenticated users
                }
              }
              if (jqXHR.status == '401') {
                alert("invalid authorization token - provide valid token for admin mode or no token for guestuser mode");
              }
            });
          }
          widgetlist = [];
          OliveUI.modules.new_brokerage_object_grid_widget_js_modules.forEach(function (i) {
            widgetlist.push(i);
            if (typeof i.type !== 'undefined' && functionnames.indexOf(i.type) == -1) {
              functionnames.push(i.type);
            }
          });
          functionnames.forEach(function () {
            addWidgetContainer();
          });
          $.when(getDataAjax).done(function () {
            instantiateWidgets(gridrendercontent);
          });
          return widgetcontainer;
        },
      };
      function setAuthHeader(request) {
        if ((typeof this.token !== 'undefined') && (this.token != "") && (this.token != "defaulttoken")) {
          request.setRequestHeader("Authorization", "token " + this.token);
        }
      }
      Array.prototype.diff = function (a) {
        return this.filter(function (i) {
          return a.indexOf(i) < 0;
        });
      };
      function arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length)
          return false;
        for (var i = arr1.length; i--;) {
          if (arr1[i] !== arr2[i])
            return false;
        }
        return true;
      }
      function instantiateWidgets(gridrendercontent) {
        widgetlist.forEach(function (widgetTypeName) {
          if (widgetTypeName.type === gridrendercontent.type) {
            resultsJSON.forEach(function (widgetData) {
              if (widgetData.type === gridrendercontent.type) {
                instance = Object.assign({}, widgetTypeName);
                if (typeof instance !== 'undefined') {
                  $(widgetcontainerinner).append(instance.render(widgetData, gridrendercontent)); // here lands all content of widget instances
                }
              }
            });
          }
        });
        widgetlist.forEach(function (i) {
          newbuttoninstance = Object.assign({}, i);
          if (typeof newbuttoninstance.makeCreateButton === "function" && typeof gridrendercontent.token !== 'undefined' && gridrendercontent.token !== '' && i.type === gridrendercontent.type) {
            $(widgetcontainerinner).append(newbuttoninstance.makeCreateButton(gridrendercontent));
          }
        });
      }
      function getListOfObjects(gridinstance) {
        $.ajax({
            url: gridinstance.indexurl,
            beforeSend: setAuthHeader.bind(gridinstance),
            dataType: 'json'
          }).done(function (results) {
            $.each(results, function (i, f) {
              if (f.name != gridinstance.indexfilename) {
                widgetFileNames.push(
                  f.name
                );
              }
            });
            getDiffIndexList(gridinstance); // after having list of all widgetFileNames in repo, get list of indexed widgetFileNames
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == '404') {
              alert("invalid repo url");
            }
            if (jqXHR.status == '401') {
              alert("invalid authorization token - provide valid token for admin mode or no token for guestuser mode");
            }
          });
      }
      // if no name on indexlist add object to indexlist
      function getDiffIndexList(gridinstance) {
        namesToAddToList = widgetFileNames.diff(indexedListNames);
        var differingRecordsRequests = [];
        namesToAddToList.forEach(function (nameToAddToList) {
          if (unencodedcontent.ignoredlist.indexOf(nameToAddToList) == -1) {
            var request = $.ajax({
              url: gridinstance.indexurl + '/' + nameToAddToList,
              beforeSend: setAuthHeader.bind(gridinstance),
              dataType: 'json'
            }).done(function (response) {
              prepareUpdateList(response);
            });
            differingRecordsRequests.push(request);
          }
        });
        $.when.apply(null, differingRecordsRequests).done(function () {
          prepareUpdatedIndexlist();
          pushUpdatedIndexlist(gridinstance);
        });
      }
      function prepareUpdateList(response) {
        var unencodedcontentdiff = {};
        var content = {};
        try {
          content = atob(response.content);
        } catch (e) {
          console.log(e);
        }
        try {
          unencodedcontentdiff = JSON.parse(content);
        } catch (e) {
          console.log(e);
        }
        if (typeof unencodedcontentdiff.createdat !== 'undefined' && typeof unencodedcontentdiff.updatedat !== 'undefined' && typeof unencodedcontentdiff.datetype !== 'undefined' && typeof unencodedcontentdiff.name !== 'undefined' && typeof unencodedcontentdiff.type !== 'undefined') {
          indexListobjToUpdate.list.push({
            createdat: unencodedcontentdiff.createdat,
            updatedat: unencodedcontentdiff.updatedat,
            datetype: unencodedcontentdiff.datetype,
            name: unencodedcontentdiff.name,
            type: unencodedcontentdiff.type
          });
        } else if (indexListobjToUpdate.ignoredlist.indexOf(response.name) == -1) {
          indexListobjToUpdate.ignoredlist.push(response.name);
        }
      }
      function removeDuplicates(arr) {
        var unique_array = Array.from(new Set(arr));
        return unique_array;
      }
      function prepareUpdatedIndexlist() {
        namesToDeleteFromList = indexedListNames.diff(widgetFileNames);
        updatedIndexList = {};
        updatedIndexList.list = unencodedcontent.list.concat(indexListobjToUpdate.list);
        updatedIndexList.ignoredlist = unencodedcontent.ignoredlist.concat(indexListobjToUpdate.ignoredlist);
        for (var j = 0; j < namesToDeleteFromList.length; j++) {
          for (var i = 0; i < updatedIndexList.list.length; i++) {
            if (updatedIndexList.list[i].updatedat == namesToDeleteFromList[j]) {
              updatedIndexList.list.splice(i, 1);
            }
          }
        }
        updatedIndexList.list = removeDuplicates(updatedIndexList.list); // in case there are duplicated entries
      }
      function pushUpdatedIndexlist(args) {
        if (!arraysEqual(unencodedcontent.list, updatedIndexList.list) || !arraysEqual(unencodedcontent.ignoredlist, updatedIndexList.ignoredlist)) {
          $.ajax({
            url: args.indexurl + '/' + args.indexfilename,
            beforeSend: setAuthHeader.bind(args),
            type: 'PUT',
            data: '{"message": "create indexlist","sha":"' + listsha + '","content":"' + btoa(JSON.stringify(updatedIndexList)) + '" }',
            dataType: 'json',
          });
        }
      }
      function addWidgetContainer() {
        $(widgetcontainer)
          .appendTo($(document.body))
          .addClass("container")
          .append(
            $("<section/>")
            .addClass("cms-boxes")
            .append(
              $(widgetcontainerinner)
              .addClass("container-fluid")
            ));
      }
      function produceWidgetContent(response) {
        listsha = response.sha;
        if(response) {
          try {
            unencodedcontent = JSON.parse(atob(response.content));
                    } catch(e) {
                      unencodedcontent=JSON.parse('{"list":[],"ignoredlist":[]}');
          }
      }


        $.each(unencodedcontent.list, function (i, f) {
          resultsJSON.push(f);
          indexedListNames.push( // used in indexlist creation
            f.updatedat
          );
        });
      }
      return grid;
    }
    OliveUI.modules.new_brokerage_object_grid_widget_js_modules = [];
  }(jQuery, OliveUI));
