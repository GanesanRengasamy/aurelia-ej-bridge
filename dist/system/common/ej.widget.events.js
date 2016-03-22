System.register(['./ej.widget.constants'], function (_export) {
  'use strict';

  var ejConstants, EJEvent;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_ejWidgetConstants) {
      ejConstants = _ejWidgetConstants.ejConstants;
    }],
    execute: function () {
      EJEvent = (function () {
        function EJEvent() {
          _classCallCheck(this, EJEvent);
        }

        EJEvent.prototype.fireEvent = function fireEvent(element, name) {
          var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

          var event = new CustomEvent(name, {
            detail: data,
            bubbles: true
          });
          element.dispatchEvent(event);

          return event;
        };

        EJEvent.prototype.fireEJEvent = function fireEJEvent(element, name) {
          var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

          return this.fireEvent(element, '' + ejConstants.eventPrefix + name, data);
        };

        return EJEvent;
      })();

      _export('EJEvent', EJEvent);
    }
  };
});