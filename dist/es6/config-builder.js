/**
* Plugin configuration builder
*/
export class EJConfigBuilder {

  useGlobalResources: boolean = true;
  globalResources = [];

  web() : EJConfigBuilder {
    return this.ejDatePicker();
  }
  /**
  * Use my control
  */
  ejDatePicker(): EJConfigBuilder {
    this.globalResources.push('datepicker/datepicker');
    return this;
  }
  /**
  * Don't globalize any resources
  * Allows you to import yourself via <require></require>
  */
  withoutGlobalResources(): EJConfigBuilder {
    this.useGlobalResources = false;
    return this;
  }
}
