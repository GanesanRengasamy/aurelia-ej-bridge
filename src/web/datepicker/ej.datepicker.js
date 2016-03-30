import {inject} from 'aurelia-dependency-injection';
import {customAttribute, bindable} from 'aurelia-templating';
import {EJWidget} from '../common/ej.widget.core';
import {generateEJBindables} from '../common/ej.widget.decorators';
import {ejConstants} from '../common/ej.widget.constants';

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