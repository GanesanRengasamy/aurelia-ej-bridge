'use strict';

exports.__esModule = true;

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

exports.configure = configure;
exports.generateEJBindables = generateEJBindables;

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('jquery');

var _aureliaFramework = require('aurelia-framework');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTaskQueue = require('aurelia-task-queue');

var _aureliaTemplating = require('aurelia-templating');

var _aureliaMetadata = require('aurelia-metadata');

var _aureliaBinding = require('aurelia-binding');

require('web/ej.datepicker.min');

var EJConfigBuilder = (function () {
  function EJConfigBuilder() {
    _classCallCheck(this, EJConfigBuilder);

    this.useGlobalResources = true;
    this.globalResources = [];
  }

  EJConfigBuilder.prototype.web = function web() {
    return this.ejDatePicker();
  };

  EJConfigBuilder.prototype.ejDatePicker = function ejDatePicker() {
    this.globalResources.push('web/datepicker/ej.datepicker');
    return this;
  };

  EJConfigBuilder.prototype.withoutGlobalResources = function withoutGlobalResources() {
    this.useGlobalResources = false;
    return this;
  };

  return EJConfigBuilder;
})();

exports.EJConfigBuilder = EJConfigBuilder;

function configure(aurelia, configCallback) {
  var builder = new EJConfigBuilder();

  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(builder);
  }

  if (builder.useGlobalResources) {
    aurelia.globalResources(builder.globalResources);
  }
}

var ejBindables = { "ejDatePicker": ["dayHeaderFormat", "showPopupButton", "enableAnimation", "showFooter", "displayInline", "htmlAttributes", "dateFormat", "watermarkText", "value", "minDate", "maxDate", "startLevel", "depthLevel", "cssClass", "startDay", "stepMonths", "locale", "showOtherMonths", "enableStrictMode", "enablePersistence", "enabled", "width", "height", "enableRTL", "showRoundedCorner", "headerFormat", "buttonText", "readOnly", "specialDates", "fields", "showTooltip", "showDisabledRange", "highlightSection", "highlightWeekend", "validationRules", "validationMessage", "allowEdit", "tooltipFormat", "allowDrillDown", "beforeDateCreate", "open", "close", "select", "change", "focusIn", "focusOut", "beforeOpen", "beforeClose", "create", "destroy"] };
exports.ejBindables = ejBindables;
var ejConstants = {
  eventPrefix: 'e-on-',
  bindablePrefix: 'e-',
  attributePrefix: 'ej-',
  elementPrefix: 'ej-'
};
exports.ejConstants = ejConstants;

var EJWidget = (function () {
  function EJWidget(taskQueue, utility, ejevents) {
    _classCallCheck(this, _EJWidget);

    this.taskQueue = taskQueue;
    this.utility = utility;
    this.ejevent = ejevents;
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
    var _this = this;

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
      _$parent: [options.parentCtx],
      _$resources: [this.viewResources]
    });

    var widget = this._renderWidget(options.element, allOptions, this.pluginName);

    widget._$parent = options.parentCtx;
    widget._$resources = this.viewResources;

    if (this.withValueBinding) {
      widget.first('change', function (args) {
        return _this._handleChange(args.sender);
      });

      this._handleChange(widget);
    }

    if (options.afterInitialize) {
      options.afterInitialize();
    }

    return widget;
  };

  EJWidget.prototype._renderWidget = function _renderWidget(element, options, pluginName) {
    return jQuery(element)[pluginName](options).data(pluginName);
  };

  EJWidget.prototype._getOptions = function _getOptions(element) {
    var options = this.utility.getOptions(this.viewModel, this.pluginName);
    var eventOptions = this.getEventOptions(element);
    return this.utility.pruneOptions(Object.assign({}, this.viewModel.defaults, options, eventOptions));
  };

  EJWidget.prototype.getEventOptions = function getEventOptions(element) {
    var _this2 = this;

    var options = {};
    var delayedExecution = ['change'];

    var events = this.utility.getEJEvents(element);

    events.forEach(function (event) {
      if (!_this2.protoObj.proto.defaults.includes(event)) {
        throw new Error(event + ' is not an event on the ' + _this2.pluginName + ' control');
      }

      if (delayedExecution.includes(event)) {
        options[event] = function (e) {
          _this2.taskQueue.queueMicroTask(function () {
            return _this2.ejevent.fireEJEvent(element, _this2.utility._hyphenate(event), e);
          });
        };
      } else {
        options[event] = function (e) {
          return _this2.ejevent.fireEJEvent(element, _this2.utility._hyphenate(event), e);
        };
      }
    });

    return options;
  };

  EJWidget.prototype._handleChange = function _handleChange(widget) {
    this.viewModel[this.utility.getBindablePropertyName(this.valueBindingProperty)] = widget[this.valueFunction]();
  };

  EJWidget.prototype.handlePropertyChanged = function handlePropertyChanged(widget, property, newValue, oldValue) {
    if (property === this.utility.getBindablePropertyName(this.valueBindingProperty) && this.withValueBinding) {
      widget[this.valueFunction](newValue);
    }
  };

  EJWidget.prototype.destroy = function destroy(widget) {
    if (widget && widget.element) {
      widget.destroy();
    }
  };

  var _EJWidget = EJWidget;
  EJWidget = _aureliaDependencyInjection.inject(_aureliaTaskQueue.TaskQueue, Utility)(EJWidget) || EJWidget;
  EJWidget = _aureliaDependencyInjection.transient()(EJWidget) || EJWidget;
  return EJWidget;
})();

exports.EJWidget = EJWidget;

function generateEJBindables(pluginName) {
  var extraProperties = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  return function (target, key, descriptor) {
    var behaviorResource = _aureliaMetadata.metadata.getOrCreateOwn(_aureliaMetadata.metadata.resource, _aureliaTemplating.HtmlBehaviorResource, target);
    var container = _aureliaDependencyInjection.Container.instance || new _aureliaDependencyInjection.Container();
    var utility = container.get(Utility);
    var optionKeys = utility.getProperties(pluginName, extraProperties);

    optionKeys.push('widget');

    for (var i = 0; i < optionKeys.length; i++) {

      var nameOrConfigOrTarget = {
        name: utility.getBindablePropertyName(optionKeys[i])
      };

      if (optionKeys[i] === 'widget') {
        nameOrConfigOrTarget.defaultBindingMode = _aureliaBinding.bindingMode.twoWay;
      }

      var bindableProperty = new _aureliaTemplating.BindableProperty(nameOrConfigOrTarget);
      bindableProperty.registerWith(target, behaviorResource, descriptor);
    }
  };
}

var EJEvent = (function () {
  function EJEvent() {
    _classCallCheck(this, EJEvent);
  }

  EJEvent.prototype.fireEvent = function fireEvent(element, name) {
    var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var event = new CustomEvent(name, {
      detail: data,
      bubbles: true
    });
    element.dispatchEvent(event);

    return event;
  };

  EJEvent.prototype.fireEJEvent = function fireEJEvent(element, name) {
    var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    return this.fireEvent(element, '' + ejConstants.eventPrefix + name, data);
  };

  return EJEvent;
})();

exports.EJEvent = EJEvent;

var capitalMatcher = /([A-Z])/g;

var Utility = (function () {
  function Utility() {
    _classCallCheck(this, Utility);

    this.cache = {};
  }

  Utility.prototype.getProperties = function getProperties(pluginName) {
    var extraProperties = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    if (this.cache[pluginName]) {
      return this.cache[pluginName];
    }
    var options1 = this.getWidgetDefaults(pluginName);
    var options2 = this.getGeneratedDefaults(pluginName);
    var keys = options1.concat(options2.filter(function (item) {
      return options1.indexOf(item) < 0;
    }));
    keys = keys.concat(extraProperties.filter(function (item) {
      return keys.indexOf(item) < 0;
    }));
    this.cache[pluginName] = keys;
    return keys;
  };

  Utility.prototype.getGeneratedDefaults = function getGeneratedDefaults(pluginName) {
    if (!ejBindables[pluginName]) {
      throw new Error(pluginName + ' not found in generated ej.widget.bindables.js');
    }
    return ejBindables[pluginName];
  };

  Utility.prototype.getWidgetDefaults = function getWidgetDefaults(pluginName) {
    if (ej.widget.registeredWidgets[pluginName]) {
      return Object.keys(ej.widget.registeredWidgets[pluginName].proto.defaults);
    }
    return [];
  };

  Utility.prototype.getOptions = function getOptions(viewModel, className) {
    var options = {};
    var props = this.getProperties(className);

    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      var value = viewModel[this.getBindablePropertyName(prop)];

      if (this.hasValue(value)) {
        options[prop] = value;
      }
    }

    return this.pruneOptions(options);
  };

  Utility.prototype.hasValue = function hasValue(prop) {
    return typeof prop !== 'undefined' && prop !== null;
  };

  Utility.prototype.pruneOptions = function pruneOptions(options) {
    var returnOptions = {};

    for (var prop in options) {
      if (this.hasValue(options[prop])) {
        returnOptions[prop] = options[prop];
      }
    }

    return returnOptions;
  };

  Utility.prototype.addHyphenAndLower = function addHyphenAndLower(char) {
    return '-' + char.toLowerCase();
  };

  Utility.prototype._hyphenate = function _hyphenate(name) {
    return (name.charAt(0).toLowerCase() + name.slice(1)).replace(capitalMatcher, this.addHyphenAndLower);
  };

  Utility.prototype._unhyphenate = function _unhyphenate(name) {
    return name.replace(/-([a-z])/g, function (g) {
      return g[1].toUpperCase();
    });
  };

  Utility.prototype.getBindablePropertyName = function getBindablePropertyName(propertyName) {
    return this._unhyphenate('' + ejConstants.bindablePrefix + propertyName);
  };

  Utility.prototype.getEJPropertyName = function getEJPropertyName(propertyName) {
    var withoutPrefix = propertyName.substring(1);

    return withoutPrefix.charAt(0).toLowerCase() + withoutPrefix.slice(1);
  };

  Utility.prototype.getEJEvents = function getEJEvents(element) {
    var attributes = Array.prototype.slice.call(element.attributes);
    var events = [];

    for (var i = 0; i < attributes.length; i++) {
      var attributeName = attributes[i].name;
      if (!attributeName.startsWith(ejConstants.eventPrefix)) continue;
      events.push(this._unhyphenate(attributeName.split(ejConstants.eventPrefix)[1].split('.')[0]));
    }

    return events;
  };

  return Utility;
})();

exports.Utility = Utility;

var DatePicker = (function () {
  var _instanceInitializers = {};

  _createDecoratedClass(DatePicker, [{
    key: 'defaults',
    decorators: [_aureliaTemplating.bindable],
    initializer: function initializer() {
      return {};
    },
    enumerable: true
  }], null, _instanceInitializers);

  function DatePicker(element, ejWidget) {
    _classCallCheck(this, _DatePicker);

    _defineDecoratedPropertyDescriptor(this, 'defaults', _instanceInitializers);

    this.element = element;
    this.ejWidget = ejWidget.initiateWidget('ejDatePicker').linkViewModel(this).useValueBinding();
  }

  DatePicker.prototype.bind = function bind(ctx) {
    this.$parent = ctx;
  };

  DatePicker.prototype.attached = function attached() {
    this.widget = this.ejWidget.renderWidget({
      element: this.element,
      parentCtx: this.$parent
    });
  };

  DatePicker.prototype.propertyChanged = function propertyChanged(property, newValue, oldValue) {
    this.ejWidget.handlePropertyChanged(this.widget, property, newValue, oldValue);
  };

  DatePicker.prototype.detached = function detached() {
    this.ejWidget.destroy(this.widget);
  };

  var _DatePicker = DatePicker;
  DatePicker = _aureliaDependencyInjection.inject(Element, EJWidget)(DatePicker) || DatePicker;
  DatePicker = generateEJBindables('ejDatePicker')(DatePicker) || DatePicker;
  DatePicker = _aureliaTemplating.customAttribute(ejConstants.attributePrefix + 'datepicker')(DatePicker) || DatePicker;
  return DatePicker;
})();

exports.DatePicker = DatePicker;