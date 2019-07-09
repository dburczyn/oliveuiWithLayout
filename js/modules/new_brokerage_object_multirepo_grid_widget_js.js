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
        type: "Multirepo Grid",
        render: function (config) {
          resultsJSON = [];
          for (var jj = 0; jj < config.gridrenderconfig.length; jj++) {
            resultsJSON = [];
            let gridrendercontent = config.gridrenderconfig[jj];
            gridrendercontent.color = config.color;
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
                  addWidgetContainer(gridrendercontent.descr);
                  instantiateWidgets(gridrendercontent);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                  if (jqXHR.status == '404') {
                    alert("didnt find existing indexlist");
                    resultsJSON = [];
                    var response = {};
                    response.content = btoa('{"list":[],"ignoredlist":[]}');
                    produceWidgetContent.call(null, response);
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
            }
          }
        }
      }

      function addWidgetContainer(descr) {
        $(widgetcontainer)
          .addClass("container")
          .prepend($("<button/>")
            .addClass("filterbuttonrow")
            .addClass("button")
            .addClass("btn-primary")
            .text(descr)
            .click(function () {
              $(this).text(function (i, v) {
                $("." + descr.replace(/\s/g, '')).toggle();
                return v === descr ? descr + " hidden" : descr;
              });
            })
          )
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
