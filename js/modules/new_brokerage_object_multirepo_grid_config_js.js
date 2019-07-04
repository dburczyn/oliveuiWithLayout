(function ($, OliveUI, CodeMirror) {
  OliveUI.modules.new_brokerage_object_multirepo_grid_config_js = function (config = {}) {
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
    var configform = document.createElement('form');
    var wrapper = document.createElement('div');

    $('#example').isiaFormRepeater();

    $('#example').isiaFormRepeater({
        addButton: 'Add Button Here',
        removeButton: 'Remove Button Here'
      });



    return {
      getContent: function () {
        var formlength = 2;
        config.gridrenderconfig=[];
        for (var j = 0; j < formlength; j++) {
          config.gridrenderconfig.push({
            indexurl : $(url).val(),
            indexfilename : $(indexfilename).val(),
            type : $(type).val(),
            user : $(user).val(),
            pass : $(pass).val(),
            isadmin : isadmin
          });
        }
        return config;
      },
      setContent: function (content = {}) {
        var formlength =0;
        if (typeof content.gridrenderconfig!=='undefined' ){
          formlength = content.gridrenderconfig.length;
        }
        for (var j = 0; j < formlength; j++) {
        $(url).val(content.gridrenderconfig[j].indexurl);
        $(indexfilename).val(content.gridrenderconfig[j].indexfilename);
        $(type).val(content.gridrenderconfig[j].type);
        $(user).val(content.gridrenderconfig[j].user);
        $(pass).val(content.gridrenderconfig[j].pass);
        isadmin = content.gridrenderconfig[j].isadmin;
        }
      },
      render: function () {
        var returnedconfigform =

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
