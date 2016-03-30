declare module 'aurelia-ej-bridge' {
  import { Aurelia }  from 'aurelia-framework';
  import { inject, transient, Container }  from 'aurelia-dependency-injection';
  import { TaskQueue }  from 'aurelia-task-queue';
  import { BindableProperty, HtmlBehaviorResource, customAttribute, bindable }  from 'aurelia-templating';
  import { metadata }  from 'aurelia-metadata';
  import { bindingMode }  from 'aurelia-binding';
  
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
  export let ejBindables: any;
  export const ejConstants: any;
  export class EJWidget {
    element: Element;
    taskQueue: TaskQueue;
    pluginName: string;
    viewModel: any;
    protoObj: any;
    constructor(taskQueue: any, utils: any, ejevent: any);
    initiateWidget(pluginName: any): any;
    linkViewModel(viewModel: any): any;
    useViewResources(resources: any): any;
    useValueBinding(valueBindingProperty?: any, valueFunction?: any): any;
    renderWidget(options: any): any;
    getEventOptions(element: any): any;
    destroy(widget: any): any;
  }
  export function generateEJBindables(pluginName: string, extraProperties?: any): any;
  
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
    fireEvent(element: Element, name: string, data?: any): any;
    
    /**
      * Fire DOM event on an element with the ej-on prefix
      * @param element The Element which the DOM event will be fired on
      * @param name The Event's name, without ej-on prefix
      * @param data Addition data to attach to an event
      */
    fireEJEvent(element: Element, name: string, data?: any): any;
  }
  export class Utils {
    cache: any;
    getProperties(pluginName: string, extraProperties?: any): string[];
    getGeneratedDefaults(pluginName: string): any;
    getWidgetDefaults(pluginName: string): string[];
    getObservableProperties(pluginName: string): string[];
    getOptions(viewModel: any, className: any): any;
    hasValue(prop: any): any;
    pruneOptions(options: any): any;
    addHyphenAndLower(char: string): string;
    getBindablePropertyName(propertyName: string): string;
    getEJEvents(element: Element): string[];
  }
  export class DatePicker {
    defaults: any;
    constructor(element: any, ejWidget: any);
    attached(): any;
    propertyChanged(property: any, newValue: any, oldValue: any): any;
    detached(): any;
  }
}