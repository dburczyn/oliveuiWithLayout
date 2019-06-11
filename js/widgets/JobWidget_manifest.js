(function ($, OliveUI, new_brokerage_object_job_widget) {
  'use strict';

  OliveUI.addWidgetManifest({
     name: 'Job Widget',
    description: '',

    createUIFn: function () {
      var _newbrokeragejob = function (config = {}) {
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
              console.log("przed");
              console.log(_dom.rootDiv);
              _dom.rootDiv.append(OliveUI.modules.new_brokerage_object_job_widget().render(content.tilerendercontent,content.gridrendercontent));
              console.log("po");
              console.log(_dom.rootDiv);
            } catch (e) {
              OliveUI.utils.showError(e, _dom.rootDiv);
            }
          }
        };
      };
      return _newbrokeragejob();
    },
  });
}(jQuery, OliveUI, OliveUI.modules.new_brokerage_object_job_widget));
