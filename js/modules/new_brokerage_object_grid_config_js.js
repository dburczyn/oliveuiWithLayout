(function ($, OliveUI, CodeMirror) {
  OliveUI.modules.new_brokerage_object_grid_config_js = function (config = {}) {
    config.height = config.minHeight || 100;
    config.codemirror = config.codemirror || {
      mode: 'htmlmixed',
      tabSize: 2,
      lineNumbers: true,
      lineWrapping: true
    };
    'use strict';
    var indexfilename = document.createElement('input');
    var user = document.createElement('input');
    var pass = document.createElement('input');
    var gettokenbutton = document.createElement('button');
    var token = document.createElement('input');
    var url = document.createElement('input');
    var type = document.createElement('select');
    var configform = document.createElement('form');
    var secret = "";
    var client = "";
    $(gettokenbutton)
      .unbind('click')
      .on('click', function (e) {
        e.preventDefault();
        $.ajax({
            url: "https://api.github.com/authorizations/clients/" + client,
            beforeSend: function (xhr) {
              xhr.setRequestHeader("Authorization", "Basic " + btoa($(user).val() + ":" + $(pass).val()));
            },
            dataType: 'json',
            type: 'PUT',
            data: '{"client_secret": "' + secret + '","scopes": ["public_repo"],"note": "admin script","fingerprint":"' + new Date().getTime() + '"}'
          })
          .done(function (response) {
            $(token).val(response.token);
          });
      });
    return {
      getContent: function () {
        console.log("getcontent z configa");
        config.indexurl = $(url).val();
        config.token = $(token).val();
        config.indexfilename = $(indexfilename).val();
        config.type = $(type).val();
        config.user = $(user).val();
        config.pass = $(pass).val();
        config.secret = secret;
        config.client = client;
        config.isadmin = isadmin;


        return config;
      },
      setContent: function (content = {}) {
        console.log("setcontent z configa");
        $(url).val(content.indexurl);
        $(token).val(content.token);
        $(indexfilename).val(content.indexfilename);
        $(type).val(content.type);
        $(user).val(content.user);
        $(pass).val(content.pass);
        secret = content.secret;
        client = content.client;
        isadmin = content.isadmin;
      },
      render: function () {
        var returnedcondfigform =
          $(configform)
          .addClass("form-style-5")
          .append(
            $('<p/>')
            .text("List Endpoint Url:")
          )
          .append(
            $(url)
            .attr("type", "text")
          )
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
            .text("Gettoken")
          )
          .append(
            $('<p/>')
            .text("Authorization Token:")
          )
          .append(
            $(token)
            .attr("type", "text")
          )
          .append(
            $('<p/>')
            .text("List filename:")
          )
          .append(
            $(indexfilename)
            .attr("type", "text")
          ).append(
            $('<p/>')
            .text("Widget type:")
          );
        OliveUI.modules.new_brokerage_object_grid_widget_js_modules.forEach(element => {
          returnedcondfigform
            .append(
              $(type)
              .append(
                $("<option>")
                .attr("value", element.type)
                .text(element.type)
              ));
        });
        return returnedcondfigform;
      },
    };
  };
}(jQuery, OliveUI, CodeMirror));
