(function (root, factory) {
  root.OliveUI = factory(root.jQuery);
}(typeof window !== "undefined" ? window : this, function ($) {
  'use strict';
  if (typeof $.fn.popover != 'function') throw 'Bootstrap Required';

  var _statics = {
    createWidgetInstance: function (_dom, _sub, _state, uuid, widgetName, addToLayout) {
      var _widgetManifest = OliveUI.widgetsManifests[widgetName];
      if (!_widgetManifest) throw 'Impossible to find the manifest of the widget ' + widgetName;
      if (!OliveUI.modules.newWidgetUI) throw 'Missing newWidgetUI module';

      var _widget = OliveUI.modules.newWidgetUI({
        initialView: 'render',
        headerVisible: false,
        widgetTitle: widgetName,
        removeBtnClickFn: function () {
          _statics.deleteWidgetInstance(_state, uuid);
        },
        renderModule: _widgetManifest.createUIFn(),
        configModule: _widgetManifest.createConfigurationUIFn ? _widgetManifest.createConfigurationUIFn() : null,
        mappingFn: _widgetManifest.configurationMappingFn ? function (configOutput, renderInput) {
          _widgetManifest.configurationMappingFn({
            setWidgetTitle: function (title) {
              _widget.setWidgetTitle(title);
              _sub.layoutManager.setTitle(uuid, title);
            }
          }, configOutput, renderInput);
        } : null
      });

      _state.widgetInstances[uuid] = {
        manifest: _widgetManifest,
        widget: _widget,
        rootDiv: $('<div>').append(
          _widget.render()
        )
      };
      _state.instancesIdList.push(uuid);

      if (addToLayout) {
        _sub.layoutManager.addDomElLayoutConfiguration(uuid);
      }

      _sub.layoutManager.addDomEl(uuid, _state.widgetInstances[uuid].rootDiv);
      _sub.layoutManager.setTitle(uuid, widgetName);
    },

    deleteWidgetInstance: function (_state, uuid) {
      if (!_state.widgetInstances[uuid]) return;
      _state.widgetInstances[uuid].rootDiv.remove();
      delete _state.widgetInstances[uuid];
      _state.instancesIdList.splice(_state.instancesIdList.indexOf(uuid), 1);
    },

    getWidgetInstanceConfiguration: function (_state, widgetUUID) {
      var _widgetInstance = _state.widgetInstances[widgetUUID];
      if (!_widgetInstance) throw 'Impossible to find the widget instance ' + widgetUUID;
      return _widgetInstance.widget.getContent();
    },

    setWidgetInstanceConfiguration: function (_state, widgetUUID, widgetContent) {
      var _widgetInstance = _state.widgetInstances[widgetUUID];
      if (!_widgetInstance) throw 'Impossible to find the widget instance ' + widgetUUID;
      _widgetInstance.widget.setContent(widgetContent);
    },

    getContent: function (_sub, _state) {
      var widgetInstancesRet = {};
      $.each(_state.widgetInstances, function (uuid, widgetInstance) {
        widgetInstancesRet[uuid] = {
          manifestName: widgetInstance.manifest.name,
          widgetContent: widgetInstance.widget.getContent()
        };
      });

      return {
        widgetInstances: widgetInstancesRet,
        widgetInstanceIdList: _state.instancesIdList,
        layout: {
          name: 'golden-layout',
          content: _sub.layoutManager.getContent()
        }
      };
    },

    setContent: function (_dom, _sub, _state, content) {
      content.widgetInstanceIdList = content.widgetInstanceIdList || [];
      content.widgetInstances = content.widgetInstances || {};
      content.layout = content.layout || {};
      content.layout.name = content.layout.name || 'golden-layout';
      content.layout.content = content.layout.content || {};

      _state.instancesIdList = [];
      _state.widgetInstances = {};

      $.each(content.widgetInstanceIdList, function (i, uuid) {
        var widgetInstanceContent = content.widgetInstances[uuid];
        widgetInstanceContent.widgetContent = widgetInstanceContent.widgetContent || {};
        if (!widgetInstanceContent.manifestName) throw 'Impossible to find the manifestName for the widget instance ' + uuid;

        _statics.createWidgetInstance(_dom, _sub, _state, uuid, widgetInstanceContent.manifestName, false);
        _state.widgetInstances[uuid].widget.setContent(widgetInstanceContent.widgetContent);

        _sub.layoutManager.addDomEl(uuid, _state.widgetInstances[uuid].rootDiv);
      });

      _sub.layoutManager.setContent(content.layout.content);
    }
  };

  var OliveUI = function (config = {}) {
    if (!OliveUI.modules.newLayout_GoldenLayout) throw 'Missing newLayout_GoldenLayout module';

    var _sub = {
      layoutManager: OliveUI.modules.newLayout_GoldenLayout({
        initialLayout: 'stack', //column stack row
        onWidgetCloseFn: function (uuid) {
          _statics.deleteWidgetInstance(_state, uuid);
        },
        onWidgetConfigFn: function (uuid) {
          var _widgetInstance = _state.widgetInstances[uuid];
          if (!_widgetInstance) throw 'Impossible to find the widget instance ' + uuid;
          _widgetInstance.widget.showConfigView();
        },
        onWidgetRefreshFn: function (uuid) {
          var _widgetInstance = _state.widgetInstances[uuid];
          if (!_widgetInstance) throw 'Impossible to find the widget instance ' + uuid;
          _widgetInstance.widget.showRenderView();
          }
      })
    };

    var _dom = {
      rootDiv: $('<div>').append(
        _sub.layoutManager.render()
      )
    };

    var _state = {
      widgetInstances: {},
      instancesIdList: []
    };

    return {
      render: function () {
        return _dom.rootDiv;
      },

      createWidgetInstance: function (widgetName, uuid) {
        uuid = uuid || OliveUI.utils.generateUUID();
        _statics.createWidgetInstance(_dom, _sub, _state, uuid, widgetName, true);
        return uuid;
      },

      getWidgetInstanceConfiguration: function (widgetUUID) {
        return _statics.getWidgetInstanceConfiguration(_state, widgetUUID);
      },

      setWidgetInstanceConfiguration: function (widgetUUID, widgetContent) {
        _statics.setWidgetInstanceConfiguration(_state, widgetUUID, widgetContent);
      },

      getContent: function () {
        return _statics.getContent(_sub, _state);
      },

      setContent: function (content = {}) {
        _statics.setContent(_dom, _sub, _state, content);
      }
    };
  };

  OliveUI.modules = {};
  OliveUI.widgetsManifests = {};

  OliveUI.addWidgetManifest = function (widgetManifest) {
    if (!widgetManifest.name) throw 'name missing in widget manifest';
    //TODO: complete manifest check

    OliveUI.widgetsManifests[widgetManifest.name] = widgetManifest;
  };

  //------------------------------------------------------------------------
  OliveUI.utils = (function () {
    var _utils = {
      showError: function (error, parentDom) {
        console.log(error);
        $('<div class="alert alert-danger fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Error occurred:<br><pre>' + error + '</pre></div>')
          .fadeTo(5000, 500)
          .appendTo((parentDom != null) ? parentDom : $('#mainContainer'));
      },

      showSuccess: function (info, parentDom) {
        console.log(info);
        $('<div class="alert alert-success fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + info + '</div>')
          .fadeTo(5000, 500)
          .slideUp(500, function () {
            $(this).remove();
          })
          .appendTo((parentDom != null) ? parentDom : $('#mainContainer'));
      },

      getHost: function () {
        var ret = ((window.location.protocol == '') ? 'http:' : window.location.protocol) + '//' + ((window.location.hostname == '') ? '127.0.0.1' : window.location.hostname) + ((window.location.port != '') ? ':' + window.location.port : '');
        return ret;
      },

      getPageUrl: function () {
        return _utils.getHost() + window.location.pathname;
      },

      getURLParameter: function (sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
          var sParameterName = sURLVariables[i].split('=');
          if (sParameterName[0] == sParam)
            return sParameterName[1];
        }
        return null;
      },

      neverNull: function (param) {
        return param == null ? '' : param;
      },

      generateUUID: function () {
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function')
          d += performance.now(); //use high-precision timer if available

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
      },

      callService: function (url, paramsQueryString, postData, successCallback, failureCallback) {
        var serviceUrl = url + (paramsQueryString != null ? '?' + paramsQueryString : '');
        var ajaxConfig = {
          type: 'GET',
          url: serviceUrl,
          dataType: 'json',
          async: true,
          success: function (data, status) {
            if (data.status == 0)
              successCallback(data.data);
            else
              failureCallback('Internal error: ' + data.error);
          },
          error: function (request, status, error) {
            failureCallback('Error contacting the service: ' + serviceUrl + ' : ' + status + ' ' + error);
          }
        };

        if (postData != null) {
          ajaxConfig.type = 'POST';
          ajaxConfig.processData = false;
          if (!(postData instanceof ArrayBuffer)) {
            ajaxConfig.contentType = 'application/json';
            ajaxConfig.data = postData;
          } else {
            ajaxConfig.contentType = 'application/octet-stream';
            ajaxConfig.data = postData;
          }
        }

        $.ajax(ajaxConfig);
      },

      createDialogBootstrap: function (content, title, okCallback, onSuccessCallback, onContentLoadedCallback) {
        var modalDiv = document.createElement('div');
        $(modalDiv)
          .prependTo($(document.body))
          .addClass('modal')
          .addClass('fade')
          .attr('role', 'dialog')
          .attr('tabindex', '-1')
          .append(
            $('<div class="modal-dialog" role="document">').append(
              $('<div class="modal-content">').append(
                $('<div class="modal-header">').append(
                  $('<button title="Close" type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>')).append(
                  $('<h4 class="modal-title">' + title + '</h4>'))).append(
                $('<div class="modal-body">').append(content)).append(
                $('<div class="modal-footer">').append(
                  $('<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>')).append(
                  $('<button type="button" class="btn btn-primary">Continue</button>').click(function () {
                    var ok = false;
                    if (okCallback != null && typeof okCallback === 'function')
                      ok = okCallback.call();
                    if (ok === true) {
                      $(modalDiv).modal('hide');
                      onSuccessCallback.call();
                    }
                  }))))).on('hidden.bs.modal', function () {
            modalDiv.outerHTML = '';
          }).on('shown.bs.modal', function () {
            //$(modalDiv).focus();
            onContentLoadedCallback();
          }).modal('show');
      },

      readFileAsArrayBuffer: function (file, onLoadFunction) {
        if (!file)
          return;
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
          alert('The File APIs are not fully supported in this browser.');
          return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
          var content = e.target.result;
          onLoadFunction(content);
        };
        reader.readAsArrayBuffer(file);
      },

      readFileAsDataURL: function (file, onLoadFunction) {
        if (!file)
          return;
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
          alert('The File APIs are not fully supported in this browser.');
          return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
          var content = e.target.result;
          onLoadFunction(content);
        };
        reader.readAsDataURL(file);
      },

      ab2str: function (ab) {
        if (!(window.TextDecoder)) throw 'This browser does not support TextDecoder';
        return new TextDecoder("utf-8").decode(ab);
      },

      str2ab: function (str) {
        if (!(window.TextEncoder)) throw 'This browser does not support TextEncoder';
        return new TextEncoder().encode(str);
      },

      arr2obj: function (arr, idName) {
        var ret = {};
        arr.forEach(function (arrObj) {
          var key = arrObj[idName];
          delete arrObj[idName];
          ret[key] = arrObj;
        });
        return ret;
      },

      obj2arr: function (obj, idName) {
        var ret = [];
        Object.keys(obj).forEach(function (key) {
          var arrObj = obj[key];
          arrObj[idName] = key;
          ret.push(arrObj);
        });
        return ret;
      },

      clone: function (obj) {
        return JSON.parse(JSON.stringify(obj));
      },

      isStyled: function (className) {
        // var re = new RegExp('(^|,)\\s*\\.' + className + '\\s*(\\,|$)');
        // var ret = false;
        // $.each(document.styleSheets, function () {
        //   $.each(this.cssRules || this.rules, function () {
        //     if (re.test(this.selectorText))
        //       ret = true;
        //   });
        // });
        return true;
      },

      download: function (data, filename, type) {
        var file = new Blob([data], {
          type: type
        });
        if (window.navigator.msSaveOrOpenBlob) // IE10+
          window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
          var a = document.createElement("a"),
            url = URL.createObjectURL(file);
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 0);
        }
      }

    };
    return _utils;
  }());

  return OliveUI;
}));
