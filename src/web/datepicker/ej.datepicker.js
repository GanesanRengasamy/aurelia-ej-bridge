import {inject} from 'aurelia-dependency-injection';
import {customAttribute, bindable} from 'aurelia-templating';
import {EJWidget} from '../common/ej.widget.core';
import {generateEJBindables} from '../common/ej.widget.decorators';
import {ejConstants} from '../common/ej.widget.constants';
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