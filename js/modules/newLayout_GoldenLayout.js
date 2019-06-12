(function ($, OliveUI, GoldenLayout) {
  if (typeof $('<div>').resizable != 'function') throw 'JQuery UI Required';
  var _statics = {
    init: function (_dom, _state, config, content) {
      if (_state.layoutManager != null) throw 'Layout Manager already initialized';
      _state.layoutManager = new GoldenLayout({
        content: content,
        settings: {
          hasHeaders: config.showHeaders,
          showPopoutIcon: false
        }
      }, _dom.rootDiv);
      _state.layoutManager.init();
      $(window).on('resize', function () {
        _state.layoutManager.updateSize();
      });
      _dom.rootDiv.on('resize', function () {
        _state.layoutManager.updateSize();
      });
      _state.layoutManager.on('initialised', function () {
        _state.layoutManager.root.addChild(_state.initialLayoutContent);
      });
      _state.layoutManager.on('stackCreated', function (stack) {
        stack.header.controlsContainer.find('.lm_close').off('click').click(function () {
          var activeContentItem = stack.getActiveContentItem();
          var uuid = activeContentItem.config.componentState.uuid;
          config.onWidgetCloseFn(uuid);
          activeContentItem.remove();
        });
        stack.header.controlsContainer.prepend($('<li class="glyphicon glyphicon-wrench"></li>').click(function () {
          var uuid = stack.getActiveContentItem().container.getState().uuid;
          config.onWidgetConfigFn(uuid);
        }));
        stack.header.controlsContainer.prepend($('<li class="glyphicon glyphicon-refresh"></li>').click(function () {
          var uuid = stack.getActiveContentItem().container.getState().uuid;
          config.onWidgetRefreshFn(uuid);
        }));
      });
      _state.layoutManager.on('tabCreated', function (tab) {
        tab.closeElement.off('click').click(function () {
          var activeContentItem = tab.contentItem;
          var uuid = activeContentItem.config.componentState.uuid;
          config.onWidgetCloseFn(uuid);
          activeContentItem.remove();
        });
      });
      _state.layoutManager.registerComponent('default', function (container, state) {
        var domEl = _state.availableDomEls[state.uuid];
        if (!domEl) throw 'Incorrectly initialized Dom for ' + state.uuid;
        if (domEl)
          container.getElement().html(domEl);
      });
    },
    addDomEl: function (_state, uuid, domEl) {
      _state.availableDomEls[uuid] = domEl;
    },
    addDomElLayoutConfiguration: function (_state, config, uuid) {
      var _domLayoutConf = {
        type: 'component',
        componentName: 'default',
        title: uuid,
        id: uuid,
        isClosable: config.allowClose,
        componentState: {
          uuid: uuid
        }
      };
      if (_state.layoutManager.root) {
        _state.layoutManager.root.contentItems[0].addChild(_domLayoutConf);
      } else {
        _state.initialLayoutContent.content.push(_domLayoutConf);
      }
    },
    setTitle: function (_state, uuid, title) {
      if (_state.layoutManager.root) {
        if (_state.layoutManager.root.getItemsById(uuid).length != 0)
          _state.layoutManager.root.getItemsById(uuid)[0].setTitle(title);
      } else {
        var _getItemsByIdFn = function (currentContent) {
          if (currentContent.id == uuid)
            return currentContent;
          if (currentContent.content)
            for (var i = 0; i < currentContent.content.length; i++) {
              var ret = _getItemsByIdFn(currentContent.content[i]);
              if (ret)
                return ret;
            }
          return null;
        };
        var item = _getItemsByIdFn(_state.initialLayoutContent);
        if (item)
          item.title = title;
      }
    },
    setContent: function (_dom, _state, config, content) {
      content.content = content.content || [];
      content.rootWidth = content.rootWidth || '100%';
      content.rootHeight = content.rootHeight || '100vh';
      //_state.layoutManager.updateSize(content.rootWidth, content.rootHeight);
      _dom.rootDiv.css({
        width: content.rootWidth,
        height: content.rootHeight
      });
      if (_state.layoutManager.root) {
        //https://github.com/golden-layout/golden-layout/issues/350
        _state.layoutManager.root.contentItems.forEach(function (item) {
          item.remove();
        });
        content.content.forEach(function (item) {
          _state.layoutManager.root.addChild(item);
        });
      } else {
        if (content.content.length == 1)
          _state.initialLayoutContent = content.content[0];
        else
          _state.initialLayoutContent.content = content.content;
      }
    },
    getContent: function (_dom, _state) {
      return {
        content: _state.layoutManager.isInitialised ? _state.layoutManager.toConfig().content : [_state.initialLayoutContent],
        width: _dom.rootDiv.width(),
        height: _dom.rootDiv.height()
      };
    }
  };
  var _newLayout_GoldenLayout = function (config = {}) {
    config.initialLayout = config.initialLayout || 'stack';
    config.onWidgetCloseFn = config.onWidgetCloseFn || function (uuid) {};
    config.onWidgetConfigFn = config.onWidgetConfigFn || function (uuid) {};
    config.onWidgetRefreshFn = config.onWidgetRefreshFn || function (uuid) {};
    config.allowClose = config.allowClose != null ? config.allowClose : true;
    config.allowResize = config.allowResize != null ? config.allowResize : true;
    config.showHeaders = config.showHeaders != null ? config.showHeaders : true;
    var _state = {
      layoutManager: null,
      availableDomEls: {},
      initialLayoutContent: {
        type: config.initialLayout,
        content: []
      }
    };
    var _dom = {
      rootDiv: $('<div>').css("height", "90vh").resizable({
        disabled: !config.allowResize
      }).append('<style>.lm_content > div > .panel { height: 100%; width: 100%; position: absolute; overflow: auto;} < /style>')
    };
    _statics.init(_dom, _state, config, []);
    return {
      render: function () {
        return _dom.rootDiv;
      },
      setContent: function (content = {}) {
        _statics.setContent(_dom, _state, config, content);
      },
      getContent: function () {
        return _statics.getContent(_dom, _state);
      },
      addDomEl: function (uuid, domEl) {
        _statics.addDomEl(_state, uuid, domEl);
      },
      addDomElLayoutConfiguration: function (uuid, domLayoutConf = {}) {
        _statics.addDomElLayoutConfiguration(_state, config, uuid);
      },
      setTitle: function (uuid, title) {
        _statics.setTitle(_state, uuid, title);
      }
    };
  };
  OliveUI.modules.newLayout_GoldenLayout = _newLayout_GoldenLayout;
}($, OliveUI, GoldenLayout));
