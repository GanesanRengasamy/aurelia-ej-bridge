import {Utils} from './ej.widget.utils';
import {EJEvent} from './ej.widget.events';
import {inject, transient} from 'aurelia-dependency-injection';
import {TaskQueue} from 'aurelia-task-queue';

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
