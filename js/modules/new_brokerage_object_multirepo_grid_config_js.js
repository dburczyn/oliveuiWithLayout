(function ($, OliveUI, CodeMirror) {
  OliveUI.modules.new_brokerage_object_multirepo_grid_config_js = function (config = {}) {
    config.height = config.minHeight || 100;
    config.gridrenderconfig = [];
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
    var name = document.createElement('input');
    var descr = document.createElement('input');
    var color = document.createElement('input');
    var type = document.createElement('select');
    var configform = document.createElement('form');
    var formelswrapper = document.createElement('div');
    return {
      getContent: function () {
        var titles = $('[class^=repeat-el]').map(function (idx, elem) {
          return {
            [$(elem).attr('name').replace(/[^0-9.]/g, "")]: {
              [$(elem).attr('name').replace(/[[]\d+[\]]/g, "")]: $(elem).val()
            }
          };
        }).get();
        let resultjsonarray = [];
        titles.forEach(function (json) {
          resultjsonarray[Object.keys(json)[0] - 1] = $.extend(resultjsonarray[Object.keys(json)[0] - 1],
            (Object.values(json)[0]));
        });
        config.gridrenderconfig = resultjsonarray.filter(function (el) {
          return el != null && el != "";
        });
        config.user = config.gridrenderconfig[0].user;
        config.pass = config.gridrenderconfig[0].pass;
        config.admin = config.gridrenderconfig[0].admin;
        config.name = $(name).val();
        config.color = $(color).val();
        return config;
      },
      setContent: function (content = {}) {
        if (typeof content.gridrenderconfig !== 'undefined') {
          for (var i = 1; i <= content.gridrenderconfig.length - 1; i++) {
            if ($(".repeat-item").length < content.gridrenderconfig.length) {
              $(".repeat-add").click();
            }
          }
          for (var i = 1; i <= content.gridrenderconfig.length; i++) {
            content.gridrenderconfig[i - 1].user = content.user;
            content.gridrenderconfig[i - 1].pass = content.pass;
            content.gridrenderconfig[i - 1].admin = content.admin;
            $.each(content.gridrenderconfig[i - 1], function (key, val) {
              $('[name="' + key + '[' + i + ']"').val(function (index, value) {
                return value = val;
              });
            });
          }
          $(name).val(content.name);
          $(color).val(content.color);
        }
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
            $('<div/>')
            .addClass("isiaFormRepeater repeat-section")
            .attr("id", "multirepogridconfigform")
            .attr("data-field-id", "multirepogridconfigformfield")
            .attr("data-items-index-array", "[1]")
            .append(
              $('<div/>')
              .addClass("repeat-items")
              .append(
                $(formelswrapper)
                .addClass("repeat-item")
                .attr("data-field-index", "1")
                .append(
                  $('<p/>')
                  .text("List Endpoint Url:")
                )
                .append(
                  $(url)
                  .addClass("repeat-el")
                  .attr("type", "text")
                  .attr("name", "indexurl[1]")
                )
                .append(
                  $('<p/>')
                  .text("Username:")
                )
                .append(
                  $(user)
                  .addClass("repeat-el")
                  .attr("type", "text")
                  .attr("name", "user[1]")
                )
                .append(
                  $('<p/>')
                  .text("Password:")
                )
                .append(
                  $(pass)
                  .addClass("repeat-el")
                  .attr("type", "password")
                  .attr("name", "pass[1]")
                )
                .append(
                  $('<p/>')
                  .text("List filename:")
                )
                .append(
                  $(indexfilename)
                  .addClass("repeat-el")
                  .attr("type", "text")
                  .attr("name", "indexfilename[1]")
                )
                .append(
                  $('<p/>')
                  .text("Repo name (for filtering):")
                )
                .append(
                  $(descr)
                  .addClass("repeat-el")
                  .attr("type", "text")
                  .attr("name", "descr[1]")
                )
                .append(
                  $('<p/>')
                  .text("Widget type:")
                ))));
        OliveUI.modules.new_brokerage_object_grid_widget_js_modules.forEach(widget => {
          $(formelswrapper)
            .append(
              $(type)
              .addClass("repeat-el")
              .attr("name", "type[1]")
              .append(
                $("<option>")
                .attr("value", widget.type)
                .text(widget.type)
              ));
        });
        $(configform).wrapInner('<fieldset />');
        $(document).ready(function () {
          $('#multirepogridconfigform').isiaFormRepeater({
            addButton: '<div class="repeat-add-wrapper"><a data-repeat-add-btn class="repeat-add pure-button pure-button-primary" href="#">Add</a></div>',
            removeButton: '<a data-repeat-remove-btn class="repeat-remove pure-button pure-button-primary" href="#">Remove</a>'
          });
        });
        return returnedconfigform;
      },
    };
  };
}(jQuery, OliveUI, CodeMirror));
