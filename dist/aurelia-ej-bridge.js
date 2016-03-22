import 'jquery';
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
@inject(TaskQueue, Utility)
export class EJWidget {

  element: Element;

  taskQueue: TaskQueue;

  target: Element;

  pluginName: string;

  $parent: any;

  viewModel: any;

  protoObj: any;

  constructor(taskQueue, utility, ejevents) {
    this.taskQueue = taskQueue;
    this.utility = utility;
	this.ejevent = ejevents;
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
      _$parent: [options.parentCtx],
      _$resources: [this.viewResources]
    });

    let widget = this._renderWidget(options.element, allOptions, this.pluginName);

    widget._$parent = options.parentCtx;
    widget._$resources = this.viewResources;

    if (this.withValueBinding) {
      widget.first('change', (args) => this._handleChange(args.sender));

      this._handleChange(widget);
    }

    if (options.afterInitialize) {
      options.afterInitialize();
    }

    return widget;
  }


  _renderWidget(element, options, pluginName) {
    return jQuery(element)[pluginName](options).data(pluginName);
  }

  _getOptions(element) {
    let options = this.utility.getOptions(this.viewModel, this.pluginName);
    let eventOptions = this.getEventOptions(element);
    return this.utility.pruneOptions(Object.assign({}, this.viewModel.defaults, options, eventOptions));
  }

  getEventOptions(element) {
    let options = {};
    let delayedExecution = ['change'];

    let events = this.utility.getEJEvents(element);

    events.forEach(event => {
      if (!this.protoObj.proto.defaults.includes(event)) {
        throw new Error(`${event} is not an event on the ${this.pluginName} control`);
      }

      if (delayedExecution.includes(event)) {
        options[event] = e => {
          this.taskQueue.queueMicroTask(() => this.ejevent.fireEJEvent(element, this.utility._hyphenate(event), e));
        };
      } else {
        options[event] = e => this.ejevent.fireEJEvent(element, this.utility._hyphenate(event), e);
      }
    });

    return options;
  }


  _handleChange(widget) {
    this.viewModel[this.utility.getBindablePropertyName(this.valueBindingProperty)] = widget[this.valueFunction]();
  }

  handlePropertyChanged(widget, property, newValue, oldValue) {
    if (property === this.utility.getBindablePropertyName(this.valueBindingProperty) && this.withValueBinding) {
      widget[this.valueFunction](newValue);
    }
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
    let utility = container.get(Utility);
    let optionKeys = utility.getProperties(pluginName, extraProperties);

    optionKeys.push('widget');

    for (let i = 0; i < optionKeys.length; i++) {
		
      let nameOrConfigOrTarget = {
        name: utility.getBindablePropertyName(optionKeys[i])
      };

      if (optionKeys[i] === 'widget') {
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

export class Utility {

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

  getEJPropertyName(propertyName: string): string {
    let withoutPrefix = propertyName.substring(1);

    return (withoutPrefix.charAt(0).toLowerCase() + withoutPrefix.slice(1));
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

import 'web/ej.datepicker.min';

@customAttribute(`${ejConstants.attributePrefix}datepicker`)
@generateEJBindables('ejDatePicker')
@inject(Element, EJWidget)
export class DatePicker {

  @bindable defaults = {};

  constructor(element, ejWidget) {
    this.element = element;
    this.ejWidget = ejWidget
                        .initiateWidget('ejDatePicker')
                        .linkViewModel(this)
                        .useValueBinding();
  }

  bind(ctx) {
    this.$parent = ctx;
  }

  attached() {
    this.widget = this.ejWidget.renderWidget({
      element: this.element,
      parentCtx: this.$parent
    });
  }

  propertyChanged(property, newValue, oldValue) {
    this.ejWidget.handlePropertyChanged(this.widget, property, newValue, oldValue);
  }

  detached() {
    this.ejWidget.destroy(this.widget);
  }
}