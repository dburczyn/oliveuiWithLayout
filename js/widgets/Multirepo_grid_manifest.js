(function ($, OliveUI, new_brokerage_object_multirepo_grid_widget_js, new_brokerage_object_multirepo_grid_config_js) {
  'use strict';
  OliveUI.addWidgetManifest({
    name: 'Multirepo Grid Widget',
    description: '',
    createUIFn: function () {
      var new_brokerage_object_multirepo_grid_widget = function (config = {}) {
        var _dom = {
          rootDiv: $('<div>')
        };
        return {
          render: function () {
            return _dom.rootDiv;
          },
          setContent: function (content = {}) {
            content = content || '';
            _dom.rootDiv.empty();
            try {
              _dom.rootDiv.append(OliveUI.modules.new_brokerage_object_multirepo_grid_widget_js().render(content));
            } catch (e) {
              OliveUI.utils.showError(e, _dom.rootDiv);
            }
          }
        };
      };
      return new_brokerage_object_multirepo_grid_widget();
    },
    createConfigurationUIFn: function () {
      return new_brokerage_object_multirepo_grid_config_js({});
    },
  });
}(jQuery, OliveUI, OliveUI.modules.new_brokerage_object_multirepo_grid_widget_js, OliveUI.modules.new_brokerage_object_multirepo_grid_config_js));
