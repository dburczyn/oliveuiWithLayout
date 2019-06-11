//Main entry point!
(function ($, OliveUI) {
  var oliveUI = OliveUI();
  $('#main').append(
    oliveUI.render()
  );
  var widget1 = oliveUI.createWidgetInstance('Grid Widget');
  //  var widget2 = oliveUI.createWidgetInstance('Markdown Render UI');
  var widget2 = oliveUI.createWidgetInstance('Grid Widget');
  var widget3 = oliveUI.createWidgetInstance('Grid Widget');
  /// here is the initial configuration of widget instance(s)
  oliveUI.setWidgetInstanceConfiguration(widget1, {
    indexurl:"https://api.github.com/repositories/175385549/contents/js",
    indexfilename:"indexlist",
    type:"JobTile",
    secret:"1945319cd07efdad529f45119267792ddf2974b4",
    client:"1777413b1f15516dca79",
  });
  oliveUI.setWidgetInstanceConfiguration(widget2, {
    indexurl:"https://api.github.com/repos/bocbrokeragetest/brokerage/contents/repodata",
    indexfilename:"indexlist",
    type:"TrainingTile",
    secret:"1945319cd07efdad529f45119267792ddf2974b4",
    client:"1777413b1f15516dca79"
  });
  oliveUI.setWidgetInstanceConfiguration(widget3, {
    indexurl:"https://api.github.com/repos/bocbrokeragetest/brokerage/contents/repodata",
    indexfilename:"indexlist",
    type:"EventTile",
    secret:"1945319cd07efdad529f45119267792ddf2974b4",
    client:"1777413b1f15516dca79"
  });
  // var toSave = oliveUI.getContent();
  // console.log(toSave);
  // oliveUI.setContent(toSave);
  var downloadbutton = document.createElement('button');
  var uploadbutton = document.createElement('button');
  var cloudsavebutton = document.createElement('button');
  var configrepourl = "https://api.github.com/repos/bocbrokeragetest/brokerage";
  var listsha = '';
  var user = document.createElement('input');
  var pass = document.createElement('input');
  var gettokenbutton = document.createElement('button');
  var configform = document.createElement('form');
  var optionsModal = document.createElement('div');
  var widgetAddButton = document.createElement('button');
  $('#main').prepend(
    $(downloadbutton)
    .text("Download Grid config")
    .click(function () {
      OliveUI.utils.download(JSON.stringify(oliveUI.getContent()), 'oliveui_backup_' + new Date().toISOString() + '.json', 'application/json');
    }),
    $(uploadbutton)
    .text("Upload Grid config")
    .click(function () {
      $('#fileUpload').trigger('click');
    }),
    $(cloudsavebutton)
    .text("Upload Grid config to cloaud")
    .click(function () {
      configtoup = oliveUI.getContent();
      $.each(configtoup.widgetInstances, function (i, valup) {
        if (valup.manifestName === 'Grid Widget'); {
          valup.widgetContent.user = '';
          valup.widgetContent.pass = '';
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
      var fileName = e.target.files[0].name;
      OliveUI.utils.readFileAsArrayBuffer(e.target.files[0], function (content) {
        oliveUI.setContent(JSON.parse(OliveUI.utils.ab2str(content)));
      });
    })
  );
  $(function () {
    console.log("hiding buttons 1");
    $(".lm_header").hide();
    $(uploadbutton).hide();
    $(downloadbutton).hide();
    $(cloudsavebutton).hide();
    $.ajax({
      url: configrepourl + "/contents/gridconfig.json",
      dataType: 'json'
    }).done(function (response) {
      listsha = response.sha;
      oliveUI.setContent(JSON.parse(atob(response.content)));
      console.log("hiding buttons 2");
      $(".lm_header").hide();
      $(uploadbutton).hide();
      $(downloadbutton).hide();
      $(cloudsavebutton).hide();
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
              .text("Add grid form")
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
              )
              .append(
                $('<p/>')
                .text("Password:")
              )
              .append(
                $(pass)
                .attr("type", "password")
              )
              .append(
                $(gettokenbutton)
                .text("Log in")
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
    $(widgetAddButton)
      .prependTo($("#main"))
      .addClass("btn btn-warning")
      .text("Log in")
      .click(function () {
        $(optionsModal).modal('show');
      });
    $(gettokenbutton)
      .unbind('click')
      .on('click', function (e) {
        e.preventDefault();
        $.ajax({
            url: configrepourl + "/collaborators/" + $(user).val() + "/permission",
            beforeSend: function (xhr) {
              xhr.setRequestHeader("Authorization", "Basic " + btoa($(user).val() + ":" + $(pass).val()));
            },
            type: 'GET',
          })
          .done(function (response) {
            var isadmin = response.permission;
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
                }
              });
              oliveUI.setContent(config);
              console.log("hiding buttons 3");
              $(".lm_header").hide();
              $(uploadbutton).hide();
              $(downloadbutton).hide();
              $(cloudsavebutton).hide();
              if (isadmin === "admin") {
                console.log("showing buttons");
                $(".lm_header").show();
                $(uploadbutton).show();
                $(downloadbutton).show();
                $(cloudsavebutton).show();
              }
            }).fail(function (response) {
              // listsha = response.sha;
              // var config = JSON.parse(atob(response.content));
              // $.each(config.widgetInstances, function (i, val) {
              //   if (val.manifestName === 'Grid Widget'); {
              //     val.widgetContent.user = $(user).val();
              //     val.widgetContent.pass = $(pass).val();
              //   }
              // });
              // oliveUI.setContent(config);
              console.log("hiding buttons 3");
              $(".lm_header").hide();
              $(uploadbutton).hide();
              $(downloadbutton).hide();
              $(cloudsavebutton).hide();
              if (isadmin === "admin") {
                console.log("showing buttons");
                $(".lm_header").show();
                $(uploadbutton).show();
                $(downloadbutton).show();
                $(cloudsavebutton).show();
              }
            });



          }).fail(function (response) {
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
                }
              });
              oliveUI.setContent(config);
              $(".lm_header").hide();
              $(uploadbutton).hide();
              $(downloadbutton).hide();
              $(cloudsavebutton).hide();
            }).fail(function (response) {

              listsha = response.sha;
              var config = JSON.parse(atob(response.content));
              $.each(config.widgetInstances, function (i, val) {
                if (val.manifestName === 'Grid Widget'); {
                  val.widgetContent.user = $(user).val();
                  val.widgetContent.pass = $(pass).val();
                }
              });
              oliveUI.setContent(config);



            });






          });
        $(optionsModal).modal('hide');
      });
  }
  addGithubLoginForm(configrepourl);
  //   setTimeout(function() {
  //     $('.glyphicon-refresh').trigger('click');
  //  }, 3000);
  // $(function() {
  // $('.glyphicon-refresh').trigger('click');
  // });
}(jQuery, OliveUI));
