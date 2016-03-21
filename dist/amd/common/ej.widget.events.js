define(['exports', './ej.widget.constants'], function (exports, _ejWidgetConstants) {
	'use strict';

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Events = (function () {
		function Events() {
			_classCallCheck(this, Events);
		}

		Events.prototype.fireEvent = function fireEvent(element, name) {
			var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			var event = new CustomEvent(name, {
				detail: data,
				bubbles: true
			});
			element.dispatchEvent(event);
			return event;
		};

		Events.prototype.fireEJEvent = function fireEJEvent(element, name) {
			var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

			return fireEvent(element, '' + _ejWidgetConstants.constants.eventPrefix + name, data);
		};

		return Events;
	})();

	exports.Events = Events;
});