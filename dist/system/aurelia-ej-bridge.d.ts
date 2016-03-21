declare module 'aurelia-ej-bridge' {
  import 'jquery';
  import { Aurelia }  from 'aurelia-framework';
  import { inject }  from 'aurelia-dependency-injection';
  import { customAttribute, bindable }  from 'aurelia-templating';
  
  /**
  * Aurelia-EJ-Bridge configuration builder
  */
  export class EJConfigBuilder {
    useGlobalResources: boolean;
    globalResources: any;
    web(): EJConfigBuilder;
    
    /**
      * Resources for the EJ Widgets
      */
    ejDatePicker(): EJConfigBuilder;
    
    /**
      * Don't globalize any resources
      * Allows you to import yourself via <require></require>
      */
    withoutGlobalResources(): EJConfigBuilder;
  }
  export function configure(aurelia: Aurelia, configCallback?: ((builder: EJConfigBuilder) => void)): any;
  export let bindables: any;
  export const constants: any;
  
  /**
  * Fire DOM event on an element
  * @param element The Element which the DOM event will be fired on
  * @param name The Event's name
  * @param data Addition data to attach to an event
  */
  export function fireEvent(element: Element, name: string, data?: any): any;
  
  /**
  * Fire DOM event on an element with the ej-on prefix
  * @param element The Element which the DOM event will be fired on
  * @param name The Event's name, without ej-on prefix
  * @param data Addition data to attach to an event
  */
  export function fireEJEvent(element: Element, name: string, data?: any): any;
  export class DatePicker {
    defaults: any;
    constructor(element: any, widgetBase: any);
    bind(): any;
    attached(): any;
    propertyChanged(property: any, newValue: any, oldValue: any): any;
    detached(): any;
  }
}