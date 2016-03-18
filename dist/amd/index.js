define(['exports', 'aurelia-framework', './config-builder', 'jquery'], function (exports, _aureliaFramework, _configBuilder, _jquery) {
  'use strict';

  exports.__esModule = true;
  exports.configure = configure;

  function configure(aurelia, configCallback) {
    var builder = new _configBuilder.EJConfigBuilder();

    if (configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(builder);
    }

    if (builder.useGlobalResources) {
      aurelia.globalResources(builder.globalResources);
    }
  }
});