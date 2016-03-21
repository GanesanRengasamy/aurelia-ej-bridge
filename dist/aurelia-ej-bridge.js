import 'jquery';
import {Aurelia} from 'aurelia-framework';
import {inject} from 'aurelia-dependency-injection';
import {customAttribute,bindable} from 'aurelia-templating';

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

export let bindables = {"ejDatePicker":["dayHeaderFormat", "showPopupButton", "enableAnimation", "showFooter", "displayInline", "htmlAttributes", "dateFormat", "watermarkText", "value", "minDate", "maxDate", "startLevel", "depthLevel", "cssClass", "startDay", "stepMonths", "locale", "showOtherMonths", "enableStrictMode", "enablePersistence", "enabled", "width", "height", "enableRTL", "showRoundedCorner", "headerFormat", "buttonText", "readOnly", "specialDates", "fields", "showTooltip", "showDisabledRange", "highlightSection", "highlightWeekend", "validationRules", "validationMessage", "allowEdit", "tooltipFormat", "allowDrillDown", "beforeDateCreate", "open", "close", "select", "change", "focusIn", "focusOut", "beforeOpen", "beforeClose", "create", "destroy"]}
export const constants = {
  eventPrefix: 'ej-on-',
  bindablePrefix: 'ej-',
  attributePrefix: 'ej-',
  elementPrefix: 'ej-'
};
/**
* Fire DOM event on an element
* @param element The Element which the DOM event will be fired on
* @param name The Event's name
* @param data Addition data to attach to an event
*/
export function fireEvent(element: Element, name: string, data? = {}) {
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
export function fireEJEvent(element: Element, name: string, data? = {}) {
  return fireEvent(element, `${constants.eventPrefix}${name}`, data);
}

@customAttribute(`${constants.attributePrefix}datepicker`)
@generateBindables('ejDatePicker')
@inject(Element)
export class DatePicker {

  @bindable defaults = {};

  constructor(element, widgetBase) {
    this.element = element; 
  }

  bind() {
    
  }

  attached() {
    
  }

  propertyChanged(property, newValue, oldValue) {
     
  }

  detached() {
    
  }
}
