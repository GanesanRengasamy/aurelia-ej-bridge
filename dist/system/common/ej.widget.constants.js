System.register([], function (_export) {
  'use strict';

  var ejConstants;
  return {
    setters: [],
    execute: function () {
      ejConstants = {
        eventPrefix: 'e-on-',
        bindablePrefix: 'e-',
        attributePrefix: 'ej-',
        elementPrefix: 'ej-'
      };

      _export('ejConstants', ejConstants);
    }
  };
});