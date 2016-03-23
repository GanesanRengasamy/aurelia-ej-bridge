System.register(['./ej.widget.bindables', 'aurelia-dependency-injection', './ej.widget.constants'], function (_export) {
  'use strict';

  var ejBindables, inject, ejConstants, capitalMatcher, Utils;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_ejWidgetBindables) {
      ejBindables = _ejWidgetBindables.ejBindables;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
    }, function (_ejWidgetConstants) {
      ejConstants = _ejWidgetConstants.ejConstants;
    }],
    execute: function () {
      capitalMatcher = /([A-Z])/g;

      Utils = (function () {
        function Utils() {
          _classCallCheck(this, Utils);

          this.cache = {};
        }

        Utils.prototype.getProperties = function getProperties(pluginName) {
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

        Utils.prototype.getGeneratedDefaults = function getGeneratedDefaults(pluginName) {
          if (!ejBindables[pluginName]) {
            throw new Error(pluginName + ' not found in generated ej.widget.bindables.js');
          }
          return ejBindables[pluginName];
        };

        Utils.prototype.getWidgetDefaults = function getWidgetDefaults(pluginName) {
          if (ej.widget.registeredWidgets[pluginName]) {
            return Object.keys(ej.widget.registeredWidgets[pluginName].proto.defaults);
          }
          return [];
        };

        Utils.prototype.getOptions = function getOptions(viewModel, className) {
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

        Utils.prototype.hasValue = function hasValue(prop) {
          return typeof prop !== 'undefined' && prop !== null;
        };

        Utils.prototype.pruneOptions = function pruneOptions(options) {
          var returnOptions = {};

          for (var prop in options) {
            if (this.hasValue(options[prop])) {
              returnOptions[prop] = options[prop];
            }
          }

          return returnOptions;
        };

        Utils.prototype.addHyphenAndLower = function addHyphenAndLower(char) {
          return '-' + char.toLowerCase();
        };

        Utils.prototype._hyphenate = function _hyphenate(name) {
          return (name.charAt(0).toLowerCase() + name.slice(1)).replace(capitalMatcher, this.addHyphenAndLower);
        };

        Utils.prototype._unhyphenate = function _unhyphenate(name) {
          return name.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
          });
        };

        Utils.prototype.getBindablePropertyName = function getBindablePropertyName(propertyName) {
          return this._unhyphenate('' + ejConstants.bindablePrefix + propertyName);
        };

        Utils.prototype.getEJPropertyName = function getEJPropertyName(propertyName) {
          var withoutPrefix = propertyName.substring(1);

          return withoutPrefix.charAt(0).toLowerCase() + withoutPrefix.slice(1);
        };

        Utils.prototype.getEJEvents = function getEJEvents(element) {
          var attributes = Array.prototype.slice.call(element.attributes);
          var events = [];

          for (var i = 0; i < attributes.length; i++) {
            var attributeName = attributes[i].name;
            if (!attributeName.startsWith(ejConstants.eventPrefix)) continue;
            events.push(this._unhyphenate(attributeName.split(ejConstants.eventPrefix)[1].split('.')[0]));
          }

          return events;
        };

        return Utils;
      })();

      _export('Utils', Utils);
    }
  };
});