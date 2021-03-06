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
    var url = document.createElement('input');
    var type = document.createElement('select');
    var name = document.createElement('input');
    var color = document.createElement('input');
    var configform = document.createElement('form');
    var isadmin='';


    return {
      getContent: function () {
        config.indexurl = $(url).val();
        config.indexfilename = $(indexfilename).val();
        config.type = $(type).val();
        config.user = $(user).val();
        config.pass = $(pass).val();
        config.name = $(name).val();
        config.color = $(color).val();
        config.admin = isadmin;
        return config;
      },
      setContent: function (content = {}) {
        $(url).val(content.indexurl);
        $(indexfilename).val(content.indexfilename);
        $(type).val(content.type);
        $(user).val(content.user);
        $(pass).val(content.pass);
        $(name).val(content.name);
        $(color).val(content.color);
        if (typeof content.admin !=='undefined'){
        isadmin = content.admin;}
      },
      render: function () {
        var returnedconfigform =
          $(configform)
          .addClass("form-style-5")
          .append(
            $('<p/>')
            .text("Widget name:")
          )
          .append(
            $(name)
            .attr("type", "text")
          )
          .append(
            $('<p/>')
            .text("Widget color:")
          )
          .append(
            $(color)
            .attr("type", "color")
          )
          .append(
            $('<p/>')
          )
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
        OliveUI.modules.new_brokerage_object_grid_widget_js_modules.forEach(widget => {
          returnedconfigform
            .append(
              $(type)
              .append(
                $("<option>")
                .attr("value", widget.type)
                .text(widget.type)
              ));
        });
        return returnedconfigform;
      },
    };
  };
}(jQuery, OliveUI, CodeMirror));
