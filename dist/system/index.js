System.register(['aurelia-framework', './config-builder', 'jquery'], function (_export) {
  'use strict';

  var Aurelia, EJConfigBuilder;

  _export('configure', configure);

  function configure(aurelia, configCallback) {
    var builder = new EJConfigBuilder();

    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(builder);
    }

    if (builder.useGlobalResources) {
      aurelia.globalResources(builder.globalResources);
    }
  }

  return {
    setters: [function (_aureliaFramework) {
      Aurelia = _aureliaFramework.Aurelia;
    }, function (_configBuilder) {
      EJConfigBuilder = _configBuilder.EJConfigBuilder;
    }, function (_jquery) {}],
    execute: function () {}
  };
});