'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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
    this.globalResources.push('datepicker/datepicker');
    return this;
  };

  EJConfigBuilder.prototype.withoutGlobalResources = function withoutGlobalResources() {
    this.useGlobalResources = false;
    return this;
  };

  return EJConfigBuilder;
})();

exports.EJConfigBuilder = EJConfigBuilder;