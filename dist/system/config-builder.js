System.register([], function (_export) {
  'use strict';

  var EJConfigBuilder;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [],
    execute: function () {
      EJConfigBuilder = (function () {
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

      _export('EJConfigBuilder', EJConfigBuilder);
    }
  };
});