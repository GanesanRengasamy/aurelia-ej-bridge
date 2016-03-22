System.register(['./ej.widget.utility', './ej.widget.events', 'aurelia-dependency-injection', 'aurelia-task-queue'], function (_export) {
  'use strict';

  var Utility, EJEvent, inject, transient, TaskQueue, EJWidget;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_ejWidgetUtility) {
      Utility = _ejWidgetUtility.Utility;
    }, function (_ejWidgetEvents) {
      EJEvent = _ejWidgetEvents.EJEvent;
    }, function (_aureliaDependencyInjection) {
      inject = _aureliaDependencyInjection.inject;
      transient = _aureliaDependencyInjection.transient;
    }, function (_aureliaTaskQueue) {
      TaskQueue = _aureliaTaskQueue.TaskQueue;
    }],
    execute: function () {
      EJWidget = (function () {
        function EJWidget(taskQueue, utility, ejevents) {
          _classCallCheck(this, _EJWidget);

          this.taskQueue = taskQueue;
          this.utility = utility;
          this.ejevent = ejevents;
        }

        EJWidget.prototype.initiateWidget = function initiateWidget(pluginName) {
          if (!pluginName || !jQuery.fn[pluginName]) {
            throw new Error('The name of control ' + pluginName + ' is invalid or not set');
          }

          this.pluginName = pluginName;

          this.protoObj = ej.widget.registeredWidgets[this.pluginName];

          return this;
        };

        EJWidget.prototype.linkViewModel = function linkViewModel(viewModel) {
          if (!viewModel) {
            throw new Error('viewModel is not set');
          }

          this.viewModel = viewModel;

          return this;
        };

        EJWidget.prototype.useViewResources = function useViewResources(resources) {
          if (!resources) {
            throw new Error('resources is not set');
          }

          this.viewResources = resources;

          return this;
        };

        EJWidget.prototype.useValueBinding = function useValueBinding() {
          var valueBindingProperty = arguments.length <= 0 || arguments[0] === undefined ? 'value' : arguments[0];
          var valueFunction = arguments.length <= 1 || arguments[1] === undefined ? 'value' : arguments[1];

          this.valueBindingProperty = valueBindingProperty;
          this.valueFunction = valueFunction;
          this.withValueBinding = true;

          return this;
        };

        EJWidget.prototype.renderWidget = function renderWidget(options) {
          var _this = this;

          if (!options) {
            throw new Error('the createWidget() function needs to be called with an object');
          }

          if (!options.element) {
            throw new Error('element is not set');
          }

          var allOptions = this._getOptions(options.rootElement || options.element);

          if (options.beforeInitialize) {
            options.beforeInitialize(allOptions);
          }

          Object.assign(allOptions, {
            _$parent: [options.parentCtx],
            _$resources: [this.viewResources]
          });

          var widget = this._renderWidget(options.element, allOptions, this.pluginName);

          widget._$parent = options.parentCtx;
          widget._$resources = this.viewResources;

          if (this.withValueBinding) {
            widget.first('change', function (args) {
              return _this._handleChange(args.sender);
            });

            this._handleChange(widget);
          }

          if (options.afterInitialize) {
            options.afterInitialize();
          }

          return widget;
        };

        EJWidget.prototype._renderWidget = function _renderWidget(element, options, pluginName) {
          return jQuery(element)[pluginName](options).data(pluginName);
        };

        EJWidget.prototype._getOptions = function _getOptions(element) {
          var options = this.utility.getOptions(this.viewModel, this.pluginName);
          var eventOptions = this.getEventOptions(element);
          return this.utility.pruneOptions(Object.assign({}, this.viewModel.defaults, options, eventOptions));
        };

        EJWidget.prototype.getEventOptions = function getEventOptions(element) {
          var _this2 = this;

          var options = {};
          var delayedExecution = ['change'];

          var events = this.utility.getEJEvents(element);

          events.forEach(function (event) {
            if (!_this2.protoObj.proto.defaults.includes(event)) {
              throw new Error(event + ' is not an event on the ' + _this2.pluginName + ' control');
            }

            if (delayedExecution.includes(event)) {
              options[event] = function (e) {
                _this2.taskQueue.queueMicroTask(function () {
                  return _this2.ejevent.fireEJEvent(element, _this2.utility._hyphenate(event), e);
                });
              };
            } else {
              options[event] = function (e) {
                return _this2.ejevent.fireEJEvent(element, _this2.utility._hyphenate(event), e);
              };
            }
          });

          return options;
        };

        EJWidget.prototype._handleChange = function _handleChange(widget) {
          this.viewModel[this.utility.getBindablePropertyName(this.valueBindingProperty)] = widget[this.valueFunction]();
        };

        EJWidget.prototype.handlePropertyChanged = function handlePropertyChanged(widget, property, newValue, oldValue) {
          if (property === this.utility.getBindablePropertyName(this.valueBindingProperty) && this.withValueBinding) {
            widget[this.valueFunction](newValue);
          }
        };

        EJWidget.prototype.destroy = function destroy(widget) {
          if (widget && widget.element) {
            widget.destroy();
          }
        };

        var _EJWidget = EJWidget;
        EJWidget = inject(TaskQueue, Utility)(EJWidget) || EJWidget;
        EJWidget = transient()(EJWidget) || EJWidget;
        return EJWidget;
      })();

      _export('EJWidget', EJWidget);
    }
  };
});