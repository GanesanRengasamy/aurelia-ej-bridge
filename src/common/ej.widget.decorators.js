import {BindableProperty, HtmlBehaviorResource} from 'aurelia-templating';
import {Container} from 'aurelia-dependency-injection';
import {metadata} from 'aurelia-metadata';
import {bindingMode} from 'aurelia-binding';
import {Utils} from './ej.widget.utils';

export function generateEJBindables(pluginName: string, extraProperties = []) {
  return function(target, key, descriptor) {
    // get or create the HtmlBehaviorResource
    // on which we're going to create the BindableProperty's
    let behaviorResource = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, target);
    let container = (Container.instance || new Container());
    let utils = container.get(Utils);
    let optionKeys = utils.getProperties(pluginName, extraProperties);
	let obsevablesKeys = utils.getObservableProperties(pluginName);
    for (let i = 0; i < optionKeys.length; i++) {
		
      let nameOrConfigOrTarget = {
        name: utils.getBindablePropertyName(optionKeys[i])
      };
	  
	  if (obsevablesKeys.indexOf(optionKeys[i]) != -1 ) { 
        nameOrConfigOrTarget.defaultBindingMode = bindingMode.twoWay;
      }
	  
      let bindableProperty = new BindableProperty(nameOrConfigOrTarget);
      bindableProperty.registerWith(target, behaviorResource, descriptor);
    }
  };
}
