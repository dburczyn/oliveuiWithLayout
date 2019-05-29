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
    var token = document.createElement('input');
    var url = document.createElement('input');
    var type = document.createElement('select');
    var configform = document.createElement('form');
    return {
      getContent: function () {
        config.indexurl = $(url).val();
        config.token = $(token).val();
        config.indexfilename = $(indexfilename).val();
        config.type = $(type).val();
        return config;
      },
      setContent: function (content = {}) {
        $(url).val(content.indexurl);
        $(token).val(content.token);
        $(indexfilename).val(content.indexfilename);
        $(type).val(content.type);
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
