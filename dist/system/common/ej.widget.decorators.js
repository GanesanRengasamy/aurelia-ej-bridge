System.register(['aurelia-templating', 'aurelia-dependency-injection', 'aurelia-metadata', 'aurelia-binding', './ej.widget.utility'], function (_export) {
  'use strict';

  var BindableProperty, HtmlBehaviorResource, Container, metadata, bindingMode, Utility;

  _export('generateEJBindables', generateEJBindables);

  function generateEJBindables(pluginName) {
    var extraProperties = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    return function (target, key, descriptor) {
      var behaviorResource = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, target);
      var container = Container.instance || new Container();
      var utility = container.get(Utility);
      var optionKeys = utility.getProperties(pluginName, extraProperties);

      optionKeys.push('widget');

      for (var i = 0; i < optionKeys.length; i++) {

        var nameOrConfigOrTarget = {
          name: utility.getBindablePropertyName(optionKeys[i])
        };

        if (optionKeys[i] === 'widget') {
          nameOrConfigOrTarget.defaultBindingMode = bindingMode.twoWay;
        }

        var bindableProperty = new BindableProperty(nameOrConfigOrTarget);
        bindableProperty.registerWith(target, behaviorResource, descriptor);
      }
    };
  }

  return {
    setters: [function (_aureliaTemplating) {
      BindableProperty = _aureliaTemplating.BindableProperty;
      HtmlBehaviorResource = _aureliaTemplating.HtmlBehaviorResource;
    }, function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function (_aureliaMetadata) {
      metadata = _aureliaMetadata.metadata;
    }, function (_aureliaBinding) {
      bindingMode = _aureliaBinding.bindingMode;
    }, function (_ejWidgetUtility) {
      Utility = _ejWidgetUtility.Utility;
    }],
    execute: function () {}
  };
});