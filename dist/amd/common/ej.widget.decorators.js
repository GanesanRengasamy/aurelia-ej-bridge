define(['exports', 'aurelia-templating', 'aurelia-dependency-injection', 'aurelia-metadata', 'aurelia-binding', './ej.widget.utils'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _aureliaMetadata, _aureliaBinding, _ejWidgetUtils) {
  'use strict';

  exports.__esModule = true;
  exports.generateEJBindables = generateEJBindables;

  function generateEJBindables(pluginName) {
    var extraProperties = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    return function (target, key, descriptor) {
      var behaviorResource = _aureliaMetadata.metadata.getOrCreateOwn(_aureliaMetadata.metadata.resource, _aureliaTemplating.HtmlBehaviorResource, target);
      var container = _aureliaDependencyInjection.Container.instance || new _aureliaDependencyInjection.Container();
      var utils = container.get(_ejWidgetUtils.Utils);
      var optionKeys = utils.getProperties(pluginName, extraProperties);
      var obsevablesKeys = utils.getObservableProperties(pluginName);
      for (var i = 0; i < optionKeys.length; i++) {

        var nameOrConfigOrTarget = {
          name: utils.getBindablePropertyName(optionKeys[i])
        };

        if (obsevablesKeys.indexOf(optionKeys[i]) != -1) {
          nameOrConfigOrTarget.defaultBindingMode = _aureliaBinding.bindingMode.twoWay;
        }

        var bindableProperty = new _aureliaTemplating.BindableProperty(nameOrConfigOrTarget);
        bindableProperty.registerWith(target, behaviorResource, descriptor);
      }
    };
  }
});