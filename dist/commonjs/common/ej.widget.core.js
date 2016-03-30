'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ejWidgetUtils = require('./ej.widget.utils');

var _ejWidgetEvents = require('./ej.widget.events');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTaskQueue = require('aurelia-task-queue');

var EJWidget = (function () {
  function EJWidget(taskQueue, utils, ejevent) {
    _classCallCheck(this, _EJWidget);

    this.taskQueue = taskQueue;
    this.utils = utils;
    this.ejevent = ejevent;
  }

  EJWidget.prototype.initiateWidget = function initiateWidget(pluginName) {
    if (!pluginName || !jQuery.fn[pluginName]) {
      throw new Error('The name of control ' + pluginName + ' is invalid or not set');
    }

    this.pluginName = pluginName;
    this.protoObj = ej.widget.registeredWidgets[this.pluginName];
    return this;
  };

  EJWidget.prototype.linkViewModel = function linkViewModel(viewModel) {
    if (!viewModel) {
      throw new Error('viewModel is not set');
    }

    this.viewModel = viewModel;

    return this;
  };

  EJWidget.prototype.useViewResources = function useViewResources(resources) {
    if (!resources) {
      throw new Error('resources is not set');
    }

    this.viewResources = resources;

    return this;
  };

  EJWidget.prototype.useValueBinding = function useValueBinding() {
    var valueBindingProperty = arguments.length <= 0 || arguments[0] === undefined ? 'value' : arguments[0];
    var valueFunction = arguments.length <= 1 || arguments[1] === undefined ? 'value' : arguments[1];

    this.valueBindingProperty = valueBindingProperty;
    this.valueFunction = valueFunction;
    this.withValueBinding = true;

    return this;
  };

  EJWidget.prototype.renderWidget = function renderWidget(options) {
    if (!options) {
      throw new Error('the createWidget() function needs to be called with an object');
    }

    if (!options.element) {
      throw new Error('element is not set');
    }

    var allOptions = this._getOptions(options.rootElement || options.element);

    if (options.beforeInitialize) {
      options.beforeInitialize(allOptions);
    }

    Object.assign(allOptions, {
      _$resources: [this.viewResources]
    });

    var widget = jQuery(options.element)[this.pluginName](allOptions).data(this.pluginName);
    widget._$resources = this.viewResources;

    if (options.afterInitialize) {
      options.afterInitialize();
    }

    return widget;
  };

  EJWidget.prototype._getOptions = function _getOptions(element) {
    var options = this.utils.getOptions(this.viewModel, this.pluginName);
    var eventOptions = this.getEventOptions(element);
    return this.utils.pruneOptions(Object.assign({}, this.viewModel.defaults, options, eventOptions));
  };

  EJWidget.prototype.getEventOptions = function getEventOptions(element) {
    var _this = this;

    var options = {};
    var delayedExecution = ['change'];

    var events = this.utils.getEJEvents(element);

    events.forEach(function (event) {
      if (typeof _this.protoObj.proto.defaults[event] === 'undefined') {
        throw new Error(event + ' is not an event on the ' + _this.pluginName + ' control');
      }

      if (delayedExecution.indexOf(event) != -1) {
        options[event] = function (e) {
          _this.taskQueue.queueMicroTask(function () {
            return _this.ejevent.fireEJEvent(element, _this.utils._hyphenate(event), e);
          });
        };
      } else {
        options[event] = function (e) {
          return _this.ejevent.fireEJEvent(element, _this.utils._hyphenate(event), e);
        };
      }
    });

    return options;
  };

  EJWidget.prototype.destroy = function destroy(widget) {
    if (widget && widget.element) {
      widget.destroy();
    }
  };

  var _EJWidget = EJWidget;
  EJWidget = _aureliaDependencyInjection.inject(_aureliaTaskQueue.TaskQueue, _ejWidgetUtils.Utils, _ejWidgetEvents.EJEvent)(EJWidget) || EJWidget;
  EJWidget = _aureliaDependencyInjection.transient()(EJWidget) || EJWidget;
  return EJWidget;
})();

exports.EJWidget = EJWidget;