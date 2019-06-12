(function ($, OliveUI) {
  OliveUI.modules.new_brokerage_object_job_widget = function (config = {}) {
    config.height = config.minHeight || 100;
    'use strict';
    var jobStatics = {
      bgcolor: "#c9cadc",
      icon: "fas fa-briefcase fa-3x",
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
    var jobtileinstance;
    var widgetRepresentation;
    var newbuttoncontainer = document.createElement('div');
    var filecontentfield = document.createElement('textarea');
    var jobpicturefield = document.createElement('input');
    var emailaddressfield = document.createElement('input');
    var createdatfield = document.createElement('input');
    var updatedatfield = document.createElement('input');
    var filenamefield = document.createElement('input');
    var createform = document.createElement('div');
    var expandedWidgetView = document.createElement('div');
    var modalcontainer = document.createElement('div');
    var modalfooter = document.createElement('div');
    var widgetAddButton = document.createElement('button');
    var jobtype;
    var returned = {
      type: "JobTile",
      render: function (renderdata, gridrendercontent) {
        widgetRepresentation = document.createElement('div');
        jobtileinstance = renderdata;
        createFrontWidgetTile(gridrendercontent);
        return widgetRepresentation;
      },
      makeCreateButton: function (gridrendercontent) {
        $(widgetAddButton)
          .appendTo($(newbuttoncontainer))
          .addClass("btn btn-info")
          .text('NEW ');
        addNewButtonHandler(gridrendercontent);
        return newbuttoncontainer;
      },
    };
    // function setWidgetAuthHeader(request) {
    //   if (typeof this.token !== 'undefined' && this.token !== '') {
    //     request.setRequestHeader("Authorization", "token " + this.token);
    //   }
    // }
    function getJobtypeFromRadio() {
      var jobtypesradio = document.getElementsByName('jobtype');
      for (var i = 0; i < jobtypesradio.length; i++) {
        if (jobtypesradio[i].checked) {
          jobtype = jobtypesradio[i].value;
          break;
        }
      }
      return jobtype;
    }
    function produceWidgetInstanceContent() {
      widgetInstanceContent = {};
      widgetInstanceContent.description = $(filecontentfield).val();
      widgetInstanceContent.picture = $(jobpicturefield).val();
      widgetInstanceContent.email = $(emailaddressfield).val();
      widgetInstanceContent.createdat = $(createdatfield).val();
      widgetInstanceContent.updatedat = $(updatedatfield).val();
      widgetInstanceContent.datetype = getJobtypeFromRadio();
      widgetInstanceContent.type = returned.type;
      widgetInstanceContent.name = $(filenamefield).val();
      return widgetInstanceContent;
    }
    function makeCreateForm() {
      $(document).ready(function () {
        $('#summernote').summernote();
      });
      $(modalcontainer).empty();
      $(modalcontainer).append(
        $(createform)
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
                .attr("data-dismiss", "modal")
                .text("x")
              )
              .append(
                $("<h4/>")
                .text("Create form")
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
                )
                .append(
                  $(updatedatfield)
                  .attr("type", "text")
                  .attr("hidden", "true")
                )
                .append(
                  $('<p/>')
                  .text("Name:")
                )
                .append(
                  $(filenamefield)
                  .attr("type", "text")
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
                  .text("Picture:")
                )
                .append(
                  $(jobpicturefield)
                  .attr("type", "text")
                )
                .append(
                  $('<p/>')
                  .text("Contact:")
                )
                .append(
                  $(emailaddressfield)
                  .attr("type", "text")
                )
                .append(
                  $('<p/>')
                  .text("Job type:")
                )
                .append(
                  $('<p/>')
                  .append(
                    $('<input/>')
                    .attr("value", "Employment")
                    .attr("name", "jobtype")
                    .attr("type", "radio")
                    .attr("checked", "true")
                  )
                  .append(
                    $('<p/>')
                    .text("Employment")
                  )
                  .append(
                    $('<input/>')
                    .attr("value", "Training")
                    .attr("name", "jobtype")
                    .attr("type", "radio")
                  )
                  .append(
                    $('<p/>')
                    .text("Training")
                  )
                  .append(
                    $('<input/>')
                    .attr("value", "Internship")
                    .attr("name", "jobtype")
                    .attr("type", "radio")
                  )
                  .append(
                    $('<p/>')
                    .text("Internship")
                  )
                  .append(
                    $('<input/>')
                    .attr("value", "Master")
                    .attr("name", "jobtype")
                    .attr("type", "radio")
                  )
                  .append(
                    $('<p/>')
                    .text("Master")
                  )
                  .append(
                    $('<input/>')
                    .attr("value", "PhD")
                    .attr("name", "jobtype")
                    .attr("type", "radio")
                  )
                  .append(
                    $('<p/>')
                    .text("PhD")
                  )
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
                .attr("data-dismiss", "modal")
                .text("Close")
              )
            )
          )));
    }
    function prepareDeleteWidgetContentUrl(gridrendercontent) {
      return gridrendercontent.indexurl + "/" + currentresponse.name;
    }
    function deleteWidgetContentFile(gridrendercontent) {
      $.ajax({
          url: prepareDeleteWidgetContentUrl(gridrendercontent),
          beforeSend: function (xhr) {
            if (gridrendercontent.user !== "" && gridrendercontent.pass !== "" && typeof gridrendercontent.user !== "undefined" && typeof gridrendercontent.pass !== "undefined") {
              xhr.setRequestHeader("Authorization", "Basic " + btoa((gridrendercontent.user) + ":" + (gridrendercontent.pass)));
            }
          },
          type: 'DELETE',
          data: '{"message": "delete file","sha":"' + currentresponse.sha + '" }',
        })
        .done(function () {
          $(expandedWidgetView).modal('hide');
          $('.glyphicon-refresh').trigger('click');
        });
    }
    function updateIndexlistForEditDelete(updatedlistcontent) {
      for (var i = 0; i < updatedlistcontent.list.length; i++) {
        if (updatedlistcontent.list[i].updatedat == currentresponse.name) {
          updatedlistcontent.list.splice(i, 1);
        }
      }
    }
    function prepareCreateWidgetContentUrl(gridrendercontent) {
      return gridrendercontent.indexurl + '/' + widgetInstanceContent.updatedat;
    }
    function createWidgetContentFile(gridrendercontent) {
      produceWidgetInstanceContent();
      $.ajax({
          url: prepareCreateWidgetContentUrl(gridrendercontent),
          beforeSend: function (xhr) {
            if (gridrendercontent.user !== "" && gridrendercontent.pass !== "" && typeof gridrendercontent.user !== "undefined" && typeof gridrendercontent.pass !== "undefined") {
              xhr.setRequestHeader("Authorization", "Basic " + btoa((gridrendercontent.user) + ":" + (gridrendercontent.pass)));
            }
          },
          type: 'PUT',
          data: '{"message": "create file","content":"' + btoa(JSON.stringify(widgetInstanceContent)) + '" }',
        })
        .done(function () {
          $(createform).modal('hide');
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
                if (gridrendercontent.user !== "" && gridrendercontent.pass !== "" && typeof gridrendercontent.user !== "undefined" && typeof gridrendercontent.pass !== "undefined") {
                  xhr.setRequestHeader("Authorization", "Basic " + btoa((gridrendercontent.user) + ":" + (gridrendercontent.pass)));
                }
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
        });
    }
    function addCreateFormSubmitHandler(gridrendercontent) {
      $(createform).on('submit', function (e) {
        e.preventDefault();
        createWidgetContentFile(gridrendercontent);
      });
    }
    function createFrontWidgetTile(gridrendercontent) {
      var parsedcreatedat = new Date(parseInt(jobtileinstance.createdat)).toLocaleDateString(jobStatics.locale, jobStatics.localeOptions);
      var parsedupdatedat = new Date(parseInt(jobtileinstance.updatedat)).toLocaleDateString(jobStatics.locale, jobStatics.localeOptions);
      $(widgetRepresentation)
        .addClass("col-md-3 cms-boxes-outer")
        .append(
          $("<div/>")
          .addClass("cms-boxes-items cms-features")
          .css({
            "background-color": jobStatics.bgcolor
          })
          .append(
            $("<div/>")
            .addClass("boxes-align")
            .attr("id", jobtileinstance.updatedat)
            .on('click', function () {
              showInnerWidgetModal($(this).attr("id"), gridrendercontent);
            })
            .append(
              $("<div/>")
              .addClass("small-box")
              .append(
                $("<i/>")
                .addClass(jobStatics.icon)
              )
              .append(
                $("<h3/>")
                .text(jobtileinstance.name)
              )
              .append(
                $("<h4/>")
                .text("Type: " + jobtileinstance.datetype)
              )
              .append(
                $("<h5/>")
                .text("Last update: " + parsedupdatedat)
              )
              .append(
                $("<h5/>")
                .text("Created: " + parsedcreatedat)
              ))))
        .append(modalcontainer);
    }
    function createInnerWidgetModal(gridrendercontent) {
      $(modalcontainer).empty();
      $(modalfooter).empty();
      $(expandedWidgetView).empty();
      $(modalcontainer).append(
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
                .attr("data-dismiss", "modal")
                .text("x")
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
                  .text(new Date(parseInt(unencodedcontent.updatedat)).toLocaleDateString(jobStatics.locale, jobStatics.localeOptions))
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
                  .text(new Date(parseInt(unencodedcontent.createdat)).toLocaleDateString(jobStatics.locale, jobStatics.localeOptions))
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
                .attr("data-dismiss", "modal")
                .text("Close")
              )
            )
          )));
      if (gridrendercontent.user !== "" && gridrendercontent.pass !== "" && typeof gridrendercontent.user !== "undefined" && typeof gridrendercontent.pass !== "undefined" && gridrendercontent.admin !== "" && typeof gridrendercontent.admin !== "undefined") {
        $(modalfooter)
          .append(
            $('<button/>')
            .addClass("btn btn-default")
            .attr("type", "button")
            .text("Delete")
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
                    if (gridrendercontent.user !== "" && gridrendercontent.pass !== "" && typeof gridrendercontent.user !== "undefined" && typeof gridrendercontent.pass !== "undefined") {
                      xhr.setRequestHeader("Authorization", "Basic " + btoa((gridrendercontent.user) + ":" + (gridrendercontent.pass)));
                    }
                  },
                  type: 'PUT',
                  data: '{"message": "create indexlist","sha":"' + gridrendercontent.listsha + '","content":"' + btoa(JSON.stringify(updatedlistcontent)) + '" }',
                  dataType: 'json',
                })
                .done(function () {
                  deleteWidgetContentFile(gridrendercontent);
                });
            })
          )
          .append(
            $('<button/>')
            .addClass("btn btn-info")
            .attr("type", "button")
            .attr("data-toggle", "modal")
            .attr("data-target", createform)
            .attr("data-backdrop", "false")
            .text("Edit")
            .on('click', function (e) {
              e.stopPropagation();
              $(expandedWidgetView).modal('hide');
              createform = document.createElement('div');
              makeCreateForm();
              addCreateFormSubmitHandler(gridrendercontent);
              populateEditForm();
              $(createform).modal('show');
            })
          );
      }
    }
    function addNewButtonHandler(gridrendercontent) {
      $(widgetAddButton)
        .unbind('click')
        .on('click', function (e) {
          e.stopPropagation();
          createform = document.createElement('div');
          makeCreateForm();
          addCreateFormSubmitHandler(gridrendercontent);
          $(createdatfield).val(new Date().getTime());
          $(updatedatfield).val($(createdatfield).val());
          $(filenamefield).val('');
          $(filecontentfield).val('');
          $(emailaddressfield).val('');
          $(jobpicturefield).val('');
          // $(modalcontainer).appendTo($(document.body));
          $(createform).modal('show');
        });
    }
    function populateEditForm() {
      updatedat = new Date().getTime();
      $(updatedatfield).val(updatedat);
      $(createdatfield).val(unencodedcontent.createdat);
      $(filenamefield).val(unencodedcontent.name);
      $(filecontentfield).val(unencodedcontent.description);
      $(emailaddressfield).val(unencodedcontent.email);
      $(jobpicturefield).val(unencodedcontent.picture);
      var typeseditedradionew = document.getElementsByName('jobtype');
      for (var j = 0, l = typeseditedradionew.length; j < l; j++) {
        if (unencodedcontent.datetype === typeseditedradionew[j].value) {
          typeseditedradionew[j].checked = true;
          break;
        }
      }
    }
    function showInnerWidgetModal(id, gridrendercontent) {
      $.ajax({
          url: gridrendercontent.indexurl + "/" + id,
          beforeSend: function (xhr) {
            if (gridrendercontent.user !== "" && gridrendercontent.pass !== "" && typeof gridrendercontent.user !== "undefined" && typeof gridrendercontent.pass !== "undefined") {
              xhr.setRequestHeader("Authorization", "Basic " + btoa((gridrendercontent.user) + ":" + (gridrendercontent.pass)));
            }
          },
          dataType: 'json'
        })
        .done(function (response) {
          currentresponse = response;
          unencodedcontent = JSON.parse(atob(response.content));
          expandedWidgetView = document.createElement('div');
          createInnerWidgetModal(gridrendercontent);
          $(expandedWidgetView).modal('show');
        })
        .fail(function () {
          alert('That entry is no longer avaliable');
        });
    }
    OliveUI.modules.new_brokerage_object_grid_widget_js_modules.push(returned);
    return returned;
  }();
}(jQuery, OliveUI));
