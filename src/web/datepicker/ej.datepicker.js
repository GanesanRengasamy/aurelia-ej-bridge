import {inject} from 'aurelia-dependency-injection';
import {customAttribute, bindable} from 'aurelia-templating';
import {constants} from '../common/constants';

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
