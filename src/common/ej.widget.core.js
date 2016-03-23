import {Utils} from './ej.widget.utils';
import {EJEvent} from './ej.widget.events';
import {inject, transient} from 'aurelia-dependency-injection';
import {TaskQueue} from 'aurelia-task-queue';

@transient()
@inject(TaskQueue, Utils)
export class EJWidget {

  element: Element;

  taskQueue: TaskQueue;

  target: Element;

  pluginName: string;

  $parent: any;

  viewModel: any;

  protoObj: any;

  constructor(taskQueue, utils, ejevents) {
    this.taskQueue = taskQueue;
    this.utils = utils;
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
    let options = this.utils.getOptions(this.viewModel, this.pluginName);
    let eventOptions = this.getEventOptions(element);
    return this.utils.pruneOptions(Object.assign({}, this.viewModel.defaults, options, eventOptions));
  }

  getEventOptions(element) {
    let options = {};
    let delayedExecution = ['change'];

    let events = this.utils.getEJEvents(element);

    events.forEach(event => {
      if (!this.protoObj.proto.defaults.includes(event)) {
        throw new Error(`${event} is not an event on the ${this.pluginName} control`);
      }

      if (delayedExecution.includes(event)) {
        options[event] = e => {
          this.taskQueue.queueMicroTask(() => this.ejevent.fireEJEvent(element, this.utils._hyphenate(event), e));
        };
      } else {
        options[event] = e => this.ejevent.fireEJEvent(element, this.utils._hyphenate(event), e);
      }
    });

    return options;
  }


  _handleChange(widget) {
    this.viewModel[this.utils.getBindablePropertyName(this.valueBindingProperty)] = widget[this.valueFunction]();
  }

  handlePropertyChanged(widget, property, newValue, oldValue) {
    if (property === this.utils.getBindablePropertyName(this.valueBindingProperty) && this.withValueBinding) {
      widget[this.valueFunction](newValue);
    }
  }

  destroy(widget) {
    if (widget && widget.element) {
      widget.destroy();
    }
  }
}
