//Main entry point!
(function ($, OliveUI) {
  var oliveUI = OliveUI();
  $('#main').append(
    oliveUI.render()
  );
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  var configrepourl = "https://api.github.com/repositories/175385549";
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  var downloadbutton = document.createElement('button');
  var uploadbutton = document.createElement('button');
  var cloudsavebutton = document.createElement('button');
  var listsha = '';
  var user = document.createElement('input');
  var pass = document.createElement('input');
  var loginFormSubmit = document.createElement('input');
  var configform = document.createElement('form');
  var optionsModal = document.createElement('div');
  var loginButton = document.createElement('button');
  var newWidgetInstance = document.createElement('button');
  var newMultirepoWidgetInstance = document.createElement('button');
  var isadmin;
  $('#main').prepend(
    $(downloadbutton)
    .text("Download Grid config")
    .addClass("btn btn-warning")
    .click(function () {
      configdown = oliveUI.getContent();
      $.each(configdown.widgetInstances, function (i, valdown) {
        if (valdown.manifestName === 'Grid Widget') {
          valdown.widgetContent.user = '';
          valdown.widgetContent.pass = '';
          valdown.widgetContent.admin = '';
        }
      });
      OliveUI.utils.download(JSON.stringify(configdown), 'oliveui_backup_' + new Date().toISOString() + '.json', 'application/json');
    }),
    $(uploadbutton)
    .text("Upload Grid config")
    .addClass("btn btn-warning")
    .click(function () {
      $('#fileUpload').trigger('click');
    }),
    $(cloudsavebutton)
    .text("Upload Grid config to cloud")
    .addClass("btn btn-warning")
    .click(function () {
      configtoup = oliveUI.getContent();
      $.each(configtoup.widgetInstances, function (i, valup) {
        if (valup.manifestName === 'Grid Widget'); {
          valup.widgetContent.user = '';
          valup.widgetContent.pass = '';
          valup.widgetContent.admin = '';
        }
      });
      $.ajax({
        url: configrepourl + "/contents/gridconfig.json",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Basic " + btoa($(user).val() + ":" + $(pass).val()));
        },
        type: 'PUT',
        data: '{"message": "create gridconfig","sha":"' + listsha + '","content":"' + btoa(JSON.stringify(configtoup)) + '" }',
        dataType: 'json',
      });
    }),
    $('<input id="fileUpload" type="file" style="display: none;">').change(function (e) {
      OliveUI.utils.readFileAsArrayBuffer(e.target.files[0], function (content) {
        oliveUI.setContent(JSON.parse(OliveUI.utils.ab2str(content)));
      });
    })
  );
  $(function () {
    $(".lm_header").hide();
    $(newWidgetInstance).hide();
    $(uploadbutton).hide();
    $(downloadbutton).hide();
    $(cloudsavebutton).hide();
    $.ajax({
      url: configrepourl + "/contents/gridconfig.json",
      dataType: 'json'
    }).done(function (response) {
      listsha = response.sha;
      oliveUI.setContent(JSON.parse(atob(response.content)));
      $(".lm_header").hide();
    }).fail(function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status == '404') {
        alert("cannot find config online");
      }
    });
  });
  function addGithubLoginForm(configrepourl) {
    $(optionsModal)
      .prependTo($(document.body))
      .addClass("modal fade")
      .attr("role", "dialog")
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
              .text("Log in using GitHub credentials")
            )
          )
          .append(
            $('<div/>')
            .addClass("modal-body")
            .append(
              $(configform)
              .addClass("form-style-5")
              .append(
                $('<p/>')
                .text("Username:")
              )
              .append(
                $(user)
                .attr("type", "text")
                .prop('required', true)
              )
              .append(
                $('<p/>')
                .text("Password:")
              )
              .append(
                $(pass)
                .attr("type", "password")
                .prop('required', true)
              )
              .append(
                $(loginFormSubmit)
                .attr("value", "Submit")
                .attr("type", "submit")
              )
            ))
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
        ));
    $(loginButton)
      .appendTo($("#nav"))
      .addClass("btn btn-primary")
      .text("Log in")
      .css({
        "float": "right"
      })
      .click(function () {
        $(optionsModal).modal('show');
      });
    $(newWidgetInstance)
      .prependTo($("#main"))
      .addClass("btn btn-warning")
      .text("New Widget")
      .click(function () {
        oliveUI.createWidgetInstance('Grid Widget');
      });
      $(newMultirepoWidgetInstance)
      .prependTo($("#main"))
      .addClass("btn btn-warning")
      .text("New Multirepo Widget")
      .click(function () {
        oliveUI.createWidgetInstance('Multirepo Grid Widget');
      });
    $(configform).on('submit', function (e) {
      e.preventDefault();
      $.ajax({
          url: configrepourl + "/collaborators/" + $(user).val() + "/permission",
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa($(user).val() + ":" + $(pass).val()));
          },
          type: 'GET',
        })
        .done(function (response) {
          isadmin = response.permission;
          $.ajax({
            url: configrepourl + "/contents/gridconfig.json",
            beforeSend: function (xhr) {
              xhr.setRequestHeader("Authorization", "Basic " + btoa($(user).val() + ":" + $(pass).val()));
            },
            dataType: 'json'
          }).done(function (response) {
            listsha = response.sha;
            var config = JSON.parse(atob(response.content));
            $.each(config.widgetInstances, function (i, val) {
              if (val.manifestName === 'Grid Widget') {
                val.widgetContent.user = $(user).val();
                val.widgetContent.pass = $(pass).val();
                val.widgetContent.admin = isadmin;
              }
            });
            oliveUI.setContent(config);
            if (isadmin === "admin") {
              $(".lm_header").show();
              $(newWidgetInstance).show();
              $(uploadbutton).show();
              $(downloadbutton).show();
              $(cloudsavebutton).show();
            }
          }).fail(function () {
            if (isadmin === "admin") {
              $(".lm_header").show();
              $(newWidgetInstance).show();
              $(uploadbutton).show();
              $(downloadbutton).show();
              $(cloudsavebutton).show();
            }
          });
        })
        .fail(function (jqXHR) {
          if (jqXHR.status == '401') {
            alert("invalid credentials entering unauthenticated mode");
            $.ajax({
                url: configrepourl + "/contents/gridconfig.json",
                beforeSend: function (xhr) {
                  // xhr.setRequestHeader("Authorization", "Basic " + btoa($(user).val() + ":" + $(pass).val()));
                },
                dataType: 'json'
              }).done(function (response) {
                listsha = response.sha;
                var config = JSON.parse(atob(response.content));
                $.each(config.widgetInstances, function (i, val) {
                  if (val.manifestName === 'Grid Widget'); {
                    val.widgetContent.admin = '';
                  }
                });
                oliveUI.setContent(config);
                $(".lm_header").hide();
                $(newWidgetInstance).hide();
                $(uploadbutton).hide();
                $(downloadbutton).hide();
                $(cloudsavebutton).hide();
              })
              .fail(function () {
                alert("No config found online contact your administrator");
              });
          } else if (jqXHR.status == '404') {
            alert("bad config repo url contact your administrator");
          } else if (jqXHR.status == '403') {
            $.ajax({
                url: configrepourl + "/contents/gridconfig.json",
                beforeSend: function (xhr) {
                  xhr.setRequestHeader("Authorization", "Basic " + btoa($(user).val() + ":" + $(pass).val()));
                },
                dataType: 'json'
              }).done(function (response) {
                listsha = response.sha;
                var config = JSON.parse(atob(response.content));
                $.each(config.widgetInstances, function (i, val) {
                  if (val.manifestName === 'Grid Widget'); {
                    val.widgetContent.user = $(user).val();
                    val.widgetContent.pass = $(pass).val();
                    val.widgetContent.admin = "user";
                  }
                });
                oliveUI.setContent(config);
                $(".lm_header").hide();
                $(newWidgetInstance).hide();
                $(uploadbutton).hide();
                $(downloadbutton).hide();
                $(cloudsavebutton).hide();
              })
              .fail(function () {
                alert("No config found online contact your administrator");
              });
          }
        });
      $(optionsModal).modal('hide');
    });
  }
  addGithubLoginForm(configrepourl);
}(jQuery, OliveUI));
