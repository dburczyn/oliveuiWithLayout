(function ($, OliveUI) {
  OliveUI.modules.new_brokerage_object_training_widget = function (config = {}) {
    config.height = config.minHeight || 100;
    'use strict';
    var trainingStatics = {
        bgcolor: "#c5dee7",
        icon: "fas fa-chalkboard-teacher fa-3x",
        localeOptions: {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        },
        locale: "en-GB"
      };
    var currentresponse;
    var unencodedcontent;

    var returned = {
      type: "TrainingTile",
      render: function (renderdata, gridrendercontent) {
        return createFrontWidgetTile(renderdata,gridrendercontent);
      },
      makeCreateButton: function (gridrendercontent) {
        return addNewButtonHandler(gridrendercontent);
      },
    };

    function produceWidgetInstanceContent(createform) {
      var widgetInstanceContent = {};
      widgetInstanceContent.description = $('#summernote').summernote('code');
      widgetInstanceContent.picture = $(createform).find($('input[name="trainingpicturefield"]')).val();
      widgetInstanceContent.email = $(createform).find($('input[name="emailaddressfield"]')).val();
      widgetInstanceContent.createdat = $(createform).find($('input[name="createdatfield"]')).val();
      widgetInstanceContent.updatedat = $(createform).find($('input[name="updatedatfield"]')).val();
      widgetInstanceContent.type = returned.type;
      widgetInstanceContent.name = $(createform).find($('input[name="filenamefield"]')).val();
      widgetInstanceContent.datetype = $(createform).find($('input[name="datefield"]')).val();

      return widgetInstanceContent;
    }

    function makeCreateForm(edit, gridrendercontent) {
      $(document).ready(function () {
        $('#summernote').summernote();
      });
      var createform = document.createElement('div');
      var filecontentfield = document.createElement('textarea');
      var trainingpicturefield = document.createElement('input');
      var emailaddressfield = document.createElement('input');
      var createdatfield = document.createElement('input');
      var updatedatfield = document.createElement('input');
      var filenamefield = document.createElement('input');
      var datefield = document.createElement('input');


      $(createform)
        .addClass("modal")
        .attr("role", "dialog")
        .attr("data-backdrop", "false")
        .on('submit', function (e) {
          e.preventDefault();
          createWidgetContentFile(gridrendercontent, createform);
          $('#summernote').summernote('destroy');
        })
        .append(
          $('<div/>')
          .addClass("modal-dialog")
          .append(
            $('<div/>')
            .addClass("modal-content")
            .append( /// header
              $('<div/>')
              .addClass("modal-header")
              .append(
                $('<button/>')
                .addClass("close")
                .attr("type", "button")
                .text("x")
                .unbind('click')
                .on('click', function (e) {
                  e.stopPropagation();
                  $(createform).modal('hide');
                  $(createform).remove();
                })
              )
              .append(
                $("<h4/>")
                .text("Create/Edit form")
              )
            )
            .append( //body
              $('<div/>')
              .addClass("modal-body")
              .append(
                $('<form/>')
                .addClass("form-style-5")
                .append(
                  $(createdatfield)
                  .attr("type", "text")
                  .attr("hidden", "true")
                  .attr("name", "createdatfield")
                  .val(new Date().getTime())
                )
                .append(
                  $(updatedatfield)
                  .attr("type", "text")
                  .attr("hidden", "true")
                  .attr("name", "updatedatfield")
                  .val($(createdatfield).val())
                )
                .append(
                  $('<p/>')
                  .text("Name:")
                )
                .append(
                  $(filenamefield)
                  .attr("type", "text")
                  .attr("name", "filenamefield")

                )
                .append(
                  $('<p/>')
                  .text("Description:")
                )
                .append(
                  $(filecontentfield)
                  .attr("id", "summernote")
                  .attr("name", "editordata")
                )
                .append(
                  $('<p/>')
                  .text("Picture URL:")
                )
                .append(
                  $(trainingpicturefield)
                  .attr("type", "url")
                  .attr("name", "trainingpicturefield")
                )
                .append(
                  $('<p/>')
                  .text("Contact email:")
                )
                .append(
                  $(emailaddressfield)
                  .attr("type", "email")
                  .attr("name", "emailaddressfield")
                )
                .append(
                  $('<p/>')
                  .text("Event Date:")
                )
                .append(
                    $(datefield)
                    .attr("type", "date")
                    .attr("name", "datefield")
                )
                .append(
                  $('<input>')
                  .attr("value", "Submit")
                  .attr("type", "submit")
                )
              )
            )
            .append( /// footer
              $('<div/>')
              .addClass("modal-footer")
              .append(
                $('<button/>')
                .addClass("btn btn-default")
                .attr("type", "button")
                .text("Close")
                .unbind('click')
                .on('click', function (e) {
                  e.stopPropagation();
                  $(createform).modal('hide');
                  $(createform).remove();
                })
              )
            )
          ));

      if (edit === 'edit') {

        var updatedat = new Date().getTime();
        $(updatedatfield).val(updatedat);
        $(createdatfield).val(unencodedcontent.createdat);
        $(filenamefield).val(unencodedcontent.name);
        $(filecontentfield).val(unencodedcontent.description);
        $(emailaddressfield).val(unencodedcontent.email);
        $(trainingpicturefield).val(unencodedcontent.picture);
        $(datefield).val(unencodedcontent.datetype);

      }
      return createform;

    }

    function deleteWidgetContentFile(gridrendercontent) {
      $.ajax({
          url: gridrendercontent.indexurl + "/" + currentresponse.name,
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa((gridrendercontent.user) + ":" + (gridrendercontent.pass)));
          },
          type: 'DELETE',
          data: '{"message": "delete file","sha":"' + currentresponse.sha + '" }',
        })
        .done(function () {
          $('.glyphicon-refresh').trigger('click');
        });
    }

    function createWidgetContentFile(gridrendercontent, createform) {
      var widgetInstanceContent =produceWidgetInstanceContent(createform);
      $.ajax({
          url: gridrendercontent.indexurl + '/' + widgetInstanceContent.updatedat,
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa((gridrendercontent.user) + ":" + (gridrendercontent.pass)));
          },
          type: 'PUT',
          data: '{"message": "create file","content":"' + btoa(JSON.stringify(widgetInstanceContent)) + '" }',
        })
        .done(function () {
          $(createform).modal('hide');
          $(createform).remove();
          updateIndexlist(gridrendercontent,widgetInstanceContent);
        });
    }

    function updateIndexlist(gridrendercontent,widgetInstanceContent) {
      var updatedlistcontent = JSON.parse(gridrendercontent.content);
      updatedlistcontent.list.push({
        createdat: widgetInstanceContent.createdat,
        updatedat: widgetInstanceContent.updatedat,
        datetype: widgetInstanceContent.datetype,
        name: widgetInstanceContent.name,
        type: widgetInstanceContent.type
      });
      if (widgetInstanceContent.updatedat !== widgetInstanceContent.createdat) {
        updateIndexlistForEditDelete(updatedlistcontent);
      }
      /// update indexlist
      $.ajax({
          url: gridrendercontent.indexurl + '/' + gridrendercontent.indexfilename,
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa((gridrendercontent.user) + ":" + (gridrendercontent.pass)));
          },
          type: 'PUT',
          data: '{"message": "create indexlist","sha":"' + gridrendercontent.listsha + '","content":"' + btoa(JSON.stringify(updatedlistcontent)) + '" }',
          dataType: 'json',
        })
        .done(function () {
          if (widgetInstanceContent.updatedat !== widgetInstanceContent.createdat) {
            deleteWidgetContentFile(gridrendercontent);
          } else {
            $('.glyphicon-refresh').trigger('click');
          }
        });
    }

    function updateIndexlistForEditDelete(updatedlistcontent) {
      for (var i = 0; i < updatedlistcontent.list.length; i++) {
        if (updatedlistcontent.list[i].updatedat == currentresponse.name) {
          updatedlistcontent.list.splice(i, 1);
        }
      }
    }

    function createFrontWidgetTile(renderdata,gridrendercontent) {
      var widgetRepresentation = document.createElement('div');
      var parsedcreatedat = new Date(parseInt(renderdata.createdat)).toLocaleDateString(trainingStatics.locale, trainingStatics.localeOptions);
      var parsedupdatedat = new Date(parseInt(renderdata.updatedat)).toLocaleDateString(trainingStatics.locale, trainingStatics.localeOptions);
      $(widgetRepresentation)
        .addClass("col-md-3 cms-boxes-outer")
        .append(
          $("<div/>")
          .addClass("cms-boxes-items cms-features")
          .css({
            "background-color": "#ffffff",
            "border-style": "solid",
            "border-width": "2px",
            "border-color": trainingStatics.bgcolor
          })
          .append(
            $("<div/>")
            .addClass("boxes-align")
            .attr("id", renderdata.updatedat)
            .unbind('click')
            .on('click', function () {
              showInnerWidgetModal($(this).attr("id"), gridrendercontent);
            })
            .append(
              $("<div/>")
              .addClass("small-box")
              .append(
                $("<i/>")
                .addClass(trainingStatics.icon)
              )
              .append(
                $("<h3/>")
                .text(renderdata.name)
              )
              .append(
                $("<h4/>")
                .text("Date: " + renderdata.datetype)
              )
              .append(
                $("<h5/>")
                .text("Last update: " + parsedupdatedat)
              )
              .append(
                $("<h5/>")
                .text("Created: " + parsedcreatedat)
              ))));
      // .append(modalcontainer);
      return widgetRepresentation;
    }

    function createInnerWidgetModal(gridrendercontent) {
      var expandedWidgetView = document.createElement('div');
      var modalfooter = document.createElement('div');

      $(expandedWidgetView)
        .addClass("modal")
        .attr("role", "dialog")
        .attr("data-backdrop", "false")
        .append(
          $('<div/>')
          .addClass("modal-dialog")
          .append(
            $('<div/>')
            .addClass("modal-content")
            .append( /// header
              $('<div/>')
              .addClass("modal-header")
              .append(
                $('<button/>')
                .addClass("close")
                .attr("type", "button")
                .text("x")
                .unbind('click')
                .on('click', function (e) {
                  e.stopPropagation();
                  $(expandedWidgetView).modal('hide');
                  $(modalfooter).remove();
                  $(expandedWidgetView).remove();
                })
              )
              .append(
                $('<img>')
                .attr("src", unencodedcontent.picture)
              )
            )
            .append(
              $('<div/>')
              .addClass("modal-body")
              .append(
                $("<h1/>")
                .addClass("modal-title")
                .css({
                  "text-align": "center"
                })
                .text(unencodedcontent.name)
              )
              .append(
                $("<h2/>")
                .css({
                  "text-align": "center"
                })
                .text(unencodedcontent.datetype)
              )
              .append(unencodedcontent.description)
              .append(
                $("<p/>")
                .append(
                  $("<a/>")
                  .attr("href", 'mailto:' + unencodedcontent.email)
                  .addClass("btn btn-primary")
                  .css({
                    "display": "block",
                    "margin-left": "auto",
                    "margin-right": "auto"
                  })
                  .text("Apply")
                )
              )
              .append(
                $("<p/>")
                .append(
                  $("<strong/>")
                  .text("Updated: ")
                )
                .append(
                  $("<time/>")
                  .text(new Date(parseInt(unencodedcontent.updatedat)).toLocaleDateString(trainingStatics.locale, trainingStatics.localeOptions))
                )
              )
              .append(
                $("<p/>")
                .append(
                  $("<strong/>")
                  .text("Created: ")
                )
                .append(
                  $("<time/>")
                  .text(new Date(parseInt(unencodedcontent.createdat)).toLocaleDateString(trainingStatics.locale, trainingStatics.localeOptions))
                )
              )
            )
            .append( /// footer
              $(modalfooter)
              .addClass("modal-footer")
              .append(
                $('<button/>')
                .addClass("btn btn-default")
                .attr("type", "button")
                .text("Close")
                .unbind('click')
                .on('click', function (e) {
                  e.stopPropagation();
                  $(expandedWidgetView).modal('hide');
                  $(modalfooter).remove();
                  $(expandedWidgetView).remove();
                })
              )
            )
          ));
      if (typeof gridrendercontent.admin !== 'undefined' && gridrendercontent.admin === "admin") {
        $(modalfooter)
          .prepend(
            $('<button/>')
            .addClass("btn btn-danger")
            .attr("type", "button")
            .text("Delete")
            .unbind('click')
            .on('click', function (e) {
              e.stopPropagation();
              var action = confirm('Are you sure you wish to delete this item ? It cannot be undone!');
              if (action === false) {
                return false;
              }
              var updatedlistcontent = JSON.parse(gridrendercontent.content);
              updateIndexlistForEditDelete(updatedlistcontent);
              /// update indexlist
              $.ajax({
                  url: gridrendercontent.indexurl + '/' + gridrendercontent.indexfilename,
                  beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa((gridrendercontent.user) + ":" + (gridrendercontent.pass)));
                  },
                  type: 'PUT',
                  data: '{"message": "create indexlist","sha":"' + gridrendercontent.listsha + '","content":"' + btoa(JSON.stringify(updatedlistcontent)) + '" }',
                  dataType: 'json',
                })
                .done(function () {
                  deleteWidgetContentFile(gridrendercontent);
                  $(expandedWidgetView).modal('hide');
                  $(expandedWidgetView).remove();
                });
            })
          )
          .prepend(
            $('<button/>')
            .addClass("btn btn-info")
            .attr("type", "button")
            .attr("data-toggle", "modal")
            .attr("data-backdrop", "false")
            .text("Edit")
            .unbind('click')
            .on('click', function (e) {
              e.stopPropagation();
              $(expandedWidgetView).modal('hide');
              $(expandedWidgetView).remove();
              $(makeCreateForm("edit", gridrendercontent)).modal('show');


            })
          );
      }
      return expandedWidgetView;
    }

    function addNewButtonHandler(gridrendercontent) {
      var widgetAddButton = document.createElement('button');
      var newbuttoncontainer = document.createElement('div');

      $(widgetAddButton)
        .appendTo($(newbuttoncontainer))
        .addClass("btn btn-info")
        .text('NEW')
        .unbind('click')
        .on('click', function (e) {
          e.stopPropagation();
          $(makeCreateForm("create", gridrendercontent)).modal('show');
        });
      return newbuttoncontainer;
    }

    function showInnerWidgetModal(id, gridrendercontent) {
      $.ajax({
          url: gridrendercontent.indexurl + "/" + id,
          beforeSend: function (xhr) {
            if (gridrendercontent.admin !== "bad" && typeof gridrendercontent.admin !== "undefined") {
              xhr.setRequestHeader("Authorization", "Basic " + btoa((gridrendercontent.user) + ":" + (gridrendercontent.pass)));
            }
          },
          dataType: 'json'
        })
        .done(function (response) {
          currentresponse = response;
          unencodedcontent = JSON.parse(atob(response.content));
          $(createInnerWidgetModal(gridrendercontent)).modal('show');
        })
        .fail(function (request) {
          if (request.getResponseHeader('X-RateLimit-Remaining') == 0) {
            var resetmilis = request.getResponseHeader('X-RateLimit-Reset');
            var resetdate = new Date(resetmilis * 1000);
            alert("You have exceeded your limit of api calls, your limit will be refreshed: " + resetdate + "Login with your GitHub credentials if you do not want to wait");
          }
          else{
          alert('That entry is no longer avaliable');
          }
        });
    }
    OliveUI.modules.new_brokerage_object_grid_widget_js_modules.push(returned);
    return returned;
  }();
}(jQuery, OliveUI));
