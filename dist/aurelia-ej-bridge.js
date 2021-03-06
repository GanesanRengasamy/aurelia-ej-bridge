import {Aurelia} from 'aurelia-framework';
import {inject,transient,Container} from 'aurelia-dependency-injection';
import {TaskQueue} from 'aurelia-task-queue';
import {BindableProperty,HtmlBehaviorResource,customAttribute,bindable} from 'aurelia-templating';
import {metadata} from 'aurelia-metadata';
import {bindingMode} from 'aurelia-binding';

/**
* Aurelia-EJ-Bridge configuration builder
*/
export class EJConfigBuilder {

  useGlobalResources: boolean = true;
  globalResources = [];

  web() : EJConfigBuilder {
    return this.ejDatePicker();
  }
  /**
  * Resources for the EJ Widgets
  */
  ejDatePicker(): EJConfigBuilder {
    this.globalResources.push('web/datepicker/ej.datepicker');
    return this;
  }
  /**
  * Don't globalize any resources
  * Allows you to import yourself via <require></require>
  */
  withoutGlobalResources(): EJConfigBuilder {
    this.useGlobalResources = false;
    return this;
  }
}

export function configure(aurelia: Aurelia, configCallback?: (builder: EJConfigBuilder) => void) {
  let builder = new EJConfigBuilder();

  if (configCallback !== undefined && typeof(configCallback) === 'function') {
    configCallback(builder);
  }

  if (builder.useGlobalResources) {
    aurelia.globalResources(builder.globalResources);
  }
}

export let ejBindables = {"ejDatePicker":["dayHeaderFormat", "showPopupButton", "enableAnimation", "showFooter", "displayInline", "htmlAttributes", "dateFormat", "watermarkText", "value", "minDate", "maxDate", "startLevel", "depthLevel", "cssClass", "startDay", "stepMonths", "locale", "showOtherMonths", "enableStrictMode", "enablePersistence", "enabled", "width", "height", "enableRTL", "showRoundedCorner", "headerFormat", "buttonText", "readOnly", "specialDates", "fields", "showTooltip", "showDisabledRange", "highlightSection", "highlightWeekend", "validationRules", "validationMessage", "allowEdit", "tooltipFormat", "allowDrillDown", "beforeDateCreate", "open", "close", "select", "change", "focusIn", "focusOut", "beforeOpen", "beforeClose", "create", "destroy"]}
export const ejConstants = {
  eventPrefix: 'e-on-',
  bindablePrefix: 'e-',
  attributePrefix: 'ej-',
  elementPrefix: 'ej-'
};
@transient()
@inject(TaskQueue, Utils, EJEvent)
export class EJWidget {

  element: Element;

  taskQueue: TaskQueue;

  pluginName: string;

  viewModel: any;

  protoObj: any;

  constructor(taskQueue, utils, ejevent) {
    this.taskQueue = taskQueue;
    this.utils = utils;
	this.ejevent = ejevent;
  }

  initiateWidget(pluginName) {
    if (!pluginName || !jQuery.fn[pluginName]) {
      throw new Error(`The name of control ${pluginName} is invalid or not set`);
    }

    this.pluginName = pluginName;
    this.protoObj = ej.widget.registeredWidgets[this.pluginName];
    return this;
  }

  linkViewModel(viewModel) {
    if (!viewModel) {
      throw new Error('viewModel is not set');
    }

    this.viewModel = viewModel;

    return this;
  }

  useViewResources(resources) {
    if (!resources) {
      throw new Error('resources is not set');
    }

    this.viewResources = resources;

    return this;
  }

  useValueBinding(valueBindingProperty = 'value', valueFunction = 'value') {
    this.valueBindingProperty = valueBindingProperty;
    this.valueFunction = valueFunction;
    this.withValueBinding = true;

    return this;
  }

  renderWidget(options) {
    if (!options) {
      throw new Error('the createWidget() function needs to be called with an object');
    }

    if (!options.element) {
      throw new Error('element is not set');
    }

    let allOptions = this._getOptions(options.rootElement || options.element);

    if (options.beforeInitialize) {
      options.beforeInitialize(allOptions);
    }

    Object.assign(allOptions, {
      _$resources: [this.viewResources]
    });

    let widget = jQuery(options.element)[this.pluginName](allOptions).data(this.pluginName);	
    widget._$resources = this.viewResources;

    if (options.afterInitialize) {
      options.afterInitialize();
    }

    return widget;
  }

  _getOptions(element) {
    let options = this.utils.getOptions(this.viewModel, this.pluginName);
    let eventOptions = this.getEventOptions(element);
    return this.utils.pruneOptions(Object.assign({}, this.viewModel.defaults, options, eventOptions));
  }

  getEventOptions(element) {
    let options = {};
    let delayedExecution = ['change'];

    let events = this.utils.getEJEvents(element);
	
    events.forEach(event => {
      if (typeof(this.protoObj.proto.defaults[event]) === 'undefined') {
        throw new Error(`${event} is not an event on the ${this.pluginName} control`);
      }

      if (delayedExecution.indexOf(event) != -1 ) {
        options[event] = e => {
          this.taskQueue.queueMicroTask(() => this.ejevent.fireEJEvent(element, this.utils._hyphenate(event), e));
        };
      } else {
        options[event] = e => this.ejevent.fireEJEvent(element, this.utils._hyphenate(event), e);
      }
    });

    return options;
  }  

  destroy(widget) {
    if (widget && widget.element) {
      widget.destroy();
    }
  }
}

export function generateEJBindables(pluginName: string, extraProperties = []) {
  return function(target, key, descriptor) {
    // get or create the HtmlBehaviorResource
    // on which we're going to create the BindableProperty's
    let behaviorResource = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, target);
    let container = (Container.instance || new Container());
    let utils = container.get(Utils);
    let optionKeys = utils.getProperties(pluginName, extraProperties);
	let obsevablesKeys = utils.getObservableProperties(pluginName);
    for (let i = 0; i < optionKeys.length; i++) {
		
      let nameOrConfigOrTarget = {
        name: utils.getBindablePropertyName(optionKeys[i])
      };
	  
	  if (obsevablesKeys.indexOf(optionKeys[i]) != -1 ) { 
        nameOrConfigOrTarget.defaultBindingMode = bindingMode.twoWay;
      }
	  
      let bindableProperty = new BindableProperty(nameOrConfigOrTarget);
      bindableProperty.registerWith(target, behaviorResource, descriptor);
    }
  };
}

/**
* Collection of useful functions used in multiple parts of the plugin
*/
export class EJEvent {
  /**
  * Fire DOM event on an element
  * @param element The Element which the DOM event will be fired on
  * @param name The Event's name
  * @param data Addition data to attach to an event
  */
  fireEvent(element: Element, name: string, data = {}) {
    let event = new CustomEvent(name, {
      detail: data,
      bubbles: true
    });
    element.dispatchEvent(event);

    return event;
  }

  /**
  * Fire DOM event on an element with the ej-on prefix
  * @param element The Element which the DOM event will be fired on
  * @param name The Event's name, without ej-on prefix
  * @param data Addition data to attach to an event
  */
  fireEJEvent(element: Element, name: string, data = {}) {
    return this.fireEvent(element, `${ejConstants.eventPrefix}${name}`, data);
  }
}
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

@customAttribute(`${ejConstants.attributePrefix}datepicker`)
@generateEJBindables('ejDatePicker')
@inject(Element, EJWidget)
export class DatePicker {

  @bindable defaults = {};

  constructor(element, ejWidget) {
    this.element = element;
    this.ejWidget = ejWidget.initiateWidget('ejDatePicker').linkViewModel(this);
  }

  attached() {
    this.widget = this.ejWidget.renderWidget({ element: this.element });
  }
  
  propertyChanged(property, newValue, oldValue) {
	  
  }

  detached() {
    this.ejWidget.destroy(this.widget);
  }
}