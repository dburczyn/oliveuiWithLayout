  (function ($, OliveUI) {
    OliveUI.modules.new_brokerage_object_multirepo_grid_widget_js = function (config = {}) {
      var indexedListNames = [];
      var indexListobjToUpdate = {};
      indexListobjToUpdate.list = [];
      indexListobjToUpdate.ignoredlist = [];
      var functionnames = [];
      var resultsJSON = [];
      var unencodedcontent;
      var widgetlist;
      var instance;
      var widgetcontainer = document.createElement('div');
      var widgetcontainerinner = document.createElement('div');
      var grid = {
        type: "Grid",
        render: function (config) {

          for (var jj = 0; jj < config.gridrenderconfig.length; jj++) {
             let gridrendercontent=config.gridrenderconfig[jj];
          if (typeof gridrendercontent.admin !== 'undefined' && gridrendercontent.admin !== 'bad' && gridrendercontent.admin !== '' && typeof gridrendercontent.indexurl !== 'undefined' && gridrendercontent.indexurl !== '') // check if authorized !!!!!!!!
          {
            var getAdminAjax = $.ajax({
                url: gridrendercontent.indexurl.split('contents')[0] + "collaborators/" + gridrendercontent.user + "/permission",
                beforeSend: function (xhr) {
                  xhr.setRequestHeader("Authorization", "Basic " + btoa(gridrendercontent.user + ":" + gridrendercontent.pass));
                },
                type: 'GET',
              })
              .done(function (response) {
                gridrendercontent.admin = response.permission;
              })
              .fail(function (jqXHR) {
                if (jqXHR.status == '403') {
                  gridrendercontent.admin = "user";
                } else if (jqXHR.getResponseHeader('X-RateLimit-Remaining') == 0) {
                  var resetmilis = jqXHR.getResponseHeader('X-RateLimit-Reset');
                  var resetdate = new Date(resetmilis * 1000);
                  alert("You have exceeded your limit of api calls, your limit will be refreshed: " + resetdate + "Login with your GitHub credentials if you do not want to wait");
                } else {
                  alert("unknown error occured");
                }
              });
          }
          if (typeof gridrendercontent.indexurl !== 'undefined' && typeof gridrendercontent.indexfilename !== 'undefined' && gridrendercontent.indexurl !== '' && gridrendercontent.indexfilename !== '') {
            var getDataAjax = $.ajax({
                url: gridrendercontent.indexurl + "/" + gridrendercontent.indexfilename,
                beforeSend: function (xhr) {
                  if (gridrendercontent.user !== "" && gridrendercontent.pass !== "" && typeof gridrendercontent.user !== "undefined" && typeof gridrendercontent.pass !== "undefined") {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa((gridrendercontent.user) + ":" + (gridrendercontent.pass)));
                  }
                },
                dataType: 'json'
              }).done(function (response) {
                gridrendercontent.content = atob(response.content);
                gridrendercontent.listsha = response.sha;
                resultsJSON = [];
                produceWidgetContent.call(null, response);
              })
              .fail(function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == '404') {
                  alert("didnt find existing indexlist, creating new if proper authorization provided...");
                  resultsJSON = [];
                  var response = {};
                  response.content = btoa('{"list":[],"ignoredlist":[]}');
                  produceWidgetContent.call(null, response);
                  cleanupIndexlist(gridrendercontent);
                }
                if (jqXHR.getResponseHeader('X-RateLimit-Remaining') == 0) {
                  var resetmilis = jqXHR.getResponseHeader('X-RateLimit-Reset');
                  var resetdate = new Date(resetmilis * 1000);
                  alert("You have exceeded your limit of api calls, your limit will be refreshed: " + resetdate + "Login with your GitHub credentials if you do not want to wait");
                }
                if (jqXHR.status == '401') {
                  alert("invalid authorization  - provide valid authorization for admin mode or no authorization for guestuser mode");
                }
              });
            widgetlist = [];
            OliveUI.modules.new_brokerage_object_grid_widget_js_modules.forEach(function (i) {
              widgetlist.push(i);
              if (typeof i.type !== 'undefined' && functionnames.indexOf(i.type) == -1) {
                functionnames.push(i.type);
              }
            });
            $.when(getDataAjax).done(function () {
              $.when(getAdminAjax).always(function () {
                addWidgetContainer();
                instantiateWidgets(gridrendercontent);
              });
            });

          }

      }
      return widgetcontainer;
        }
      };
      function instantiateWidgets(gridrendercontent) {



        for (var j = 0, lent = widgetlist.length; j < lent; j++) {
          if (widgetlist[j].type === gridrendercontent.type) {
            for (var i = 0, len = resultsJSON.length; i < len; i++) {
              if (resultsJSON[i].type === gridrendercontent.type) {
                instance = Object.assign({}, widgetlist[j]);
                if (typeof instance !== 'undefined') {
                  var newinstance = instance.render(resultsJSON[i], gridrendercontent);
                  $(newinstance).clone(true, true).appendTo(widgetcontainerinner);
                }
              }
            };
          }
          if ((typeof gridrendercontent.admin !== 'undefined') && (gridrendercontent.admin === "admin")) {
            var newbuttoninstance = Object.assign({}, widgetlist[j]);
            if (typeof newbuttoninstance.makeCreateButton === "function" && typeof gridrendercontent.admin !== 'undefined' && gridrendercontent.admin !== '' && widgetlist[j].type === gridrendercontent.type) {
              var newbutton = newbuttoninstance.makeCreateButton(gridrendercontent);
              $(newbutton).clone(true, true).appendTo(widgetcontainerinner);
            }
          }
        }
      }

      function addWidgetContainer() {
        $(widgetcontainer)
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
        if (response) {
          try {
            unencodedcontent = JSON.parse(atob(response.content));
          } catch (e) {
            unencodedcontent = JSON.parse('{"list":[],"ignoredlist":[]}');
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
    };
    OliveUI.modules.new_brokerage_object_grid_widget_js_modules = [];
  }(jQuery, OliveUI));
