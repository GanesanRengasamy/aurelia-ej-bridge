import {inject} from 'aurelia-dependency-injection';
import {customAttribute, bindable} from 'aurelia-templating';
import {generateBindables, WidgetBase} from '../../common/ej.widget.core';
import {constants} from '../../common/ej.widget.constants';
import 'ej.datepicker.min';

@customAttribute(`${constants.attributePrefix}datepicker`)
@generateBindables('ejDatePicker')
@inject(Element)
export class DatePicker {

  @bindable ejDefaults = {};

  constructor(element) {
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
