(function ($, OliveUI, new_brokerage_object_event_widget) {
  'use strict';

  OliveUI.addWidgetManifest({
     name: 'Event Widget',
    description: '',

    createUIFn: function () {
      var _newbrokerageevent = function (config = {}) {
        var _dom = {
          rootDiv: $('<div>')
        };
        return {
          render: function () {
                        return _dom.rootDiv;
          },
          setContent: function (content = {}) {
            content.tilerendercontent = content.tilerendercontent || '';
            content.gridrendercontent = content.gridrendercontent || '';
            _dom.rootDiv.empty();
            try {
              _dom.rootDiv.append(OliveUI.modules.new_brokerage_object_event_widget().render(content.tilerendercontent,content.gridrendercontent));
            } catch (e) {
              OliveUI.utils.showError(e, _dom.rootDiv);
            }
          }
        };
      };
      return _newbrokerageevent();
    },
  });
}(jQuery, OliveUI, OliveUI.modules.new_brokerage_object_event_widget));
