define(['exports', 'aurelia-dependency-injection', 'aurelia-templating', '../common/ej.widget.core', '../common/ej.widget.decorators', '../common/ej.widget.constants', 'ej.datepicker.min'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _commonEjWidgetCore, _commonEjWidgetDecorators, _commonEjWidgetConstants, _ejDatepickerMin) {
  'use strict';

  exports.__esModule = true;

  var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _defineDecoratedPropertyDescriptor(target, key, descriptors) { var _descriptor = descriptors[key]; if (!_descriptor) return; var descriptor = {}; for (var _key in _descriptor) descriptor[_key] = _descriptor[_key]; descriptor.value = descriptor.initializer ? descriptor.initializer.call(target) : undefined; Object.defineProperty(target, key, descriptor); }

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
    DatePicker = _aureliaDependencyInjection.inject(Element, _commonEjWidgetCore.EJWidget)(DatePicker) || DatePicker;
    DatePicker = _commonEjWidgetDecorators.generateEJBindables('ejDatePicker')(DatePicker) || DatePicker;
    DatePicker = _aureliaTemplating.customAttribute(_commonEjWidgetConstants.ejConstants.attributePrefix + 'datepicker')(DatePicker) || DatePicker;
    return DatePicker;
  })();

  exports.DatePicker = DatePicker;
});