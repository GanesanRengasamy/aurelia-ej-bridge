import {ejBindables} from './ej.widget.bindables';
import {inject} from 'aurelia-dependency-injection';
import {ejConstants} from './ej.widget.constants';
const capitalMatcher = /([A-Z])/g;

export class Utils {

  cache = {};

  getProperties(pluginName: string, extraProperties = []): string[] {
    if (this.cache[pluginName]) {
      return this.cache[pluginName];
    }
    let options1 = this.getWidgetDefaults(pluginName);
    let options2 = this.getGeneratedDefaults(pluginName);
    let keys = options1.concat(options2.filter(item => options1.indexOf(item) < 0));
    keys = keys.concat(extraProperties.filter(item => keys.indexOf(item) < 0));
    this.cache[pluginName] = keys;
    return keys;
  }

  getGeneratedDefaults(pluginName: string) {
    if (!ejBindables[pluginName]) {
      throw new Error(`${pluginName} not found in generated ej.widget.bindables.js`);
    }
    return ejBindables[pluginName];
  }

  getWidgetDefaults(pluginName: string): string[] {
    if (ej.widget.registeredWidgets[pluginName]) {
      return Object.keys(ej.widget.registeredWidgets[pluginName].proto.defaults);
    }
    return [];
  }
  
  getObservableProperties(pluginName: string): string[] {
    if (ej.widget.registeredWidgets[pluginName]) {
      return ej.widget.registeredWidgets[pluginName].proto.observables;
    }
    return [];
  }
  
  getOptions(viewModel, className) {
    let options = {};
    let props = this.getProperties(className);

    for (let i = 0; i < props.length; i++) {
      let prop = props[i];
      let value = viewModel[this.getBindablePropertyName(prop)];

      if (this.hasValue(value)) {
        options[prop] = value;
      }
    }

    return this.pruneOptions(options);
  }

  hasValue(prop) {
    return typeof(prop) !== 'undefined' && prop !== null;
  }
  
  pruneOptions(options: any) {
    let returnOptions = {};

    for (let prop in options) {
      if (this.hasValue(options[prop])) {
        returnOptions[prop] = options[prop];
      }
    }

    return returnOptions;
  }
  
  addHyphenAndLower(char: string): string {
    return '-' + char.toLowerCase();
  }

  _hyphenate(name: string): string {
    return (name.charAt(0).toLowerCase() + name.slice(1)).replace(capitalMatcher, this.addHyphenAndLower);
  }

  _unhyphenate(name: string): string {
    return name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

  getBindablePropertyName(propertyName: string): string {
    return this._unhyphenate(`${ejConstants.bindablePrefix}${propertyName}`);
  }

  getEJEvents(element: Element): string[] {
    let attributes = Array.prototype.slice.call(element.attributes);
    let events: string[] = [];

    for (let i = 0; i < attributes.length; i++) {
      let attributeName = attributes[i].name;
      if (!attributeName.startsWith(ejConstants.eventPrefix)) continue;	  
      events.push(this._unhyphenate(attributeName.split(ejConstants.eventPrefix)[1].split('.')[0]));
    }
	
    return events;
  }
}
