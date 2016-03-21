'use strict';

exports.__esModule = true;

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

exports.configure = configure;

function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('jquery');

var _aureliaFramework = require('aurelia-framework');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

require('ej.datepicker.min');

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

var bindables = { "ejDatePicker": ["dayHeaderFormat", "showPopupButton", "enableAnimation", "showFooter", "displayInline", "htmlAttributes", "dateFormat", "watermarkText", "value", "minDate", "maxDate", "startLevel", "depthLevel", "cssClass", "startDay", "stepMonths", "locale", "showOtherMonths", "enableStrictMode", "enablePersistence", "enabled", "width", "height", "enableRTL", "showRoundedCorner", "headerFormat", "buttonText", "readOnly", "specialDates", "fields", "showTooltip", "showDisabledRange", "highlightSection", "highlightWeekend", "validationRules", "validationMessage", "allowEdit", "tooltipFormat", "allowDrillDown", "beforeDateCreate", "open", "close", "select", "change", "focusIn", "focusOut", "beforeOpen", "beforeClose", "create", "destroy"] };
exports.bindables = bindables;
var constants = {
  eventPrefix: 'ej-on-',
  bindablePrefix: 'ej-',
  attributePrefix: 'ej-',
  elementPrefix: 'ej-'
};
exports.constants = constants;

var Events = (function () {
  function Events() {
    _classCallCheck(this, Events);
  }

  Events.prototype.fireEvent = function fireEvent(element, name) {
    var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var event = new CustomEvent(name, {
      detail: data,
      bubbles: true
    });
    element.dispatchEvent(event);
    return event;
  };

  Events.prototype.fireEJEvent = function fireEJEvent(element, name) {
    var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    return fireEvent(element, '' + constants.eventPrefix + name, data);
  };

  return Events;
})();

exports.Events = Events;

var DatePicker = (function () {
  var _instanceInitializers = {};

  _createDecoratedClass(DatePicker, [{
    key: 'ejDefaults',
    decorators: [_aureliaTemplating.bindable],
    initializer: function initializer() {
      return {};
    },
    enumerable: true
  }], null, _instanceInitializers);

  function DatePicker(element) {
    _classCallCheck(this, _DatePicker);

    _defineDecoratedPropertyDescriptor(this, 'ejDefaults', _instanceInitializers);

    this.element = element;
  }

  DatePicker.prototype.bind = function bind() {};

  DatePicker.prototype.attached = function attached() {};

  DatePicker.prototype.propertyChanged = function propertyChanged(property, newValue, oldValue) {};

  DatePicker.prototype.detached = function detached() {};

  var _DatePicker = DatePicker;
  DatePicker = _aureliaDependencyInjection.inject(Element)(DatePicker) || DatePicker;
  DatePicker = generateBindables('ejDatePicker')(DatePicker) || DatePicker;
  DatePicker = _aureliaTemplating.customAttribute(constants.attributePrefix + 'datepicker')(DatePicker) || DatePicker;
  return DatePicker;
})();

exports.DatePicker = DatePicker;