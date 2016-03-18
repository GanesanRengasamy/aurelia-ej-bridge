import 'bootstrap';
import {Aurelia} from 'aurelia-framework';
import {EJConfigBuilder} from './config-builder';
import 'jquery';

export function configure(aurelia: Aurelia, configCallback?: (builder: EJConfigBuilder) => void) {
  let builder = new EJConfigBuilder();

  if (configCallback !== undefined && typeof(configCallback) === 'function') {
    configCallback(builder);
  }

  if (builder.useGlobalResources) {
    aurelia.globalResources(builder.globalResources);
  }
}
