declare module 'aurelia-ej-bridge' {
  import 'jquery';
  import { Aurelia }  from 'aurelia-framework';
  import { inject }  from 'aurelia-dependency-injection';
  import { customAttribute, bindable }  from 'aurelia-templating';
  import 'ej.datepicker.min';
  
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
  export class Events {
    fireEvent(element: Element, name: string, data?: any): any;
    fireEJEvent(element: Element, name: string, data?: any): any;
  }
  export class DatePicker {
    ejDefaults: any;
    constructor(element: any);
    bind(): any;
    attached(): any;
    propertyChanged(property: any, newValue: any, oldValue: any): any;
    detached(): any;
  }
}