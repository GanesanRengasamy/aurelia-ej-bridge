define(['exports', 'aurelia-templating', 'aurelia-dependency-injection', 'aurelia-metadata', 'aurelia-binding', './ej.widget.utility'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _aureliaMetadata, _aureliaBinding, _ejWidgetUtility) {
  'use strict';

  exports.__esModule = true;
  exports.generateEJBindables = generateEJBindables;

  function generateEJBindables(pluginName) {
    var extraProperties = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    return function (target, key, descriptor) {
      var behaviorResource = _aureliaMetadata.metadata.getOrCreateOwn(_aureliaMetadata.metadata.resource, _aureliaTemplating.HtmlBehaviorResource, target);
      var container = _aureliaDependencyInjection.Container.instance || new _aureliaDependencyInjection.Container();
      var utility = container.get(_ejWidgetUtility.Utility);
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
});