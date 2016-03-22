import {BindableProperty, HtmlBehaviorResource} from 'aurelia-templating';
import {Container} from 'aurelia-dependency-injection';
import {metadata} from 'aurelia-metadata';
import {bindingMode} from 'aurelia-binding';
import {Utility} from './ej.widget.utility';

export function generateEJBindables(pluginName: string, extraProperties = []) {
  return function(target, key, descriptor) {
    // get or create the HtmlBehaviorResource
    // on which we're going to create the BindableProperty's
    let behaviorResource = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, target);
    let container = (Container.instance || new Container());
    let utility = container.get(Utility);
    let optionKeys = utility.getProperties(pluginName, extraProperties);

    optionKeys.push('widget');

    for (let i = 0; i < optionKeys.length; i++) {
		
      let nameOrConfigOrTarget = {
        name: utility.getBindablePropertyName(optionKeys[i])
      };

      if (optionKeys[i] === 'widget') {
        nameOrConfigOrTarget.defaultBindingMode = bindingMode.twoWay;
      }

      let bindableProperty = new BindableProperty(nameOrConfigOrTarget);
      bindableProperty.registerWith(target, behaviorResource, descriptor);
    }
  };
}
