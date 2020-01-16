import { Component, ComponentConfig, ComponentSessionData } from '../plugins/Component';

import _get = require('lodash.get');
import _merge = require('lodash.merge');
import * as path from 'path';
import { BaseApp, HandleRequest, Jovo, SessionConstants } from '..';
import { Extensible } from './../core/Extensible';
import { Handler } from './../Interfaces';

import { I18Next } from './I18Next';
class ComponentPlugin extends Extensible {
  /**
   * Sets the active components, which are either the $baseComponents (if no component is active)
   * or the active component (last element in component session stack),
   * and the components inside its `components` object
   * @param {Jovo} jovo
   */
  static setActiveComponentPlugins(jovo: Jovo) {
    const componentSessionStack: Array<[string, ComponentSessionData]> =
      jovo.$session.$data[SessionConstants.COMPONENT];

    if (!componentSessionStack || componentSessionStack.length < 1) {
      jovo.$activeComponents = jovo.$app.$baseComponents;
    } else {
      const componentSessionStackNames = componentSessionStack.map(([name]) => name);

      const componentPath: string = componentSessionStackNames.reduce(
        (accumulator, currentValue) => `${accumulator}.components.${currentValue}`,
      );

      const activeComponent: ComponentPlugin = _get(jovo.$app.$baseComponents, componentPath);
      jovo.$activeComponents = {
        [activeComponent.name!]: activeComponent,
      };

      const activeComponentsChildComponents = Object.values(activeComponent.components);
      activeComponentsChildComponents.forEach((component) => {
        jovo!.$activeComponents[component.name!] = component;
      });
    }
  }

  /**
   * Updates `$activeComponents`.
   *
   * initializes a `Component` object in `$components`
   * for each `ComponentPlugin` in `$activeComponents`.
   *
   * Loads the active component's data from the session data into its `$components` object.
   *
   * @param {HandleRequest} handleRequest
   */
  static initializeComponents(handleRequest: HandleRequest) {
    if (!handleRequest.jovo) {
      return;
    }
    ComponentPlugin.setActiveComponentPlugins(handleRequest.jovo);

    if (!handleRequest.jovo.$components) {
      handleRequest.jovo.$components = {};
    }

    const activeComponents: ComponentPlugin[] = Object.values(handleRequest.jovo.$activeComponents);

    activeComponents.forEach((component) => {
      const componentObject = new Component({ config: component.config, name: component.name! });
      handleRequest.jovo!.$components[componentObject.name] = componentObject;
    });

    ComponentPlugin.loadLatestComponentSessionData(handleRequest.jovo);
  }

  /**
   * Stores the data from the $components object of the current active component
   * inside the session data
   * @param {HandleRequest} handleRequest
   */
  static saveComponentSessionData(handleRequest: HandleRequest): void {
    if (!handleRequest.jovo) {
      return;
    }
    const componentSessionStack: Array<[string, ComponentSessionData]> =
      handleRequest.jovo.$session.$data[SessionConstants.COMPONENT];
    if (!componentSessionStack || componentSessionStack.length < 1) {
      return;
    } else {
      const latestComponentFromSessionStack: [string, ComponentSessionData] =
        componentSessionStack[componentSessionStack.length - 1];
      const activeComponentObject: Component =
        handleRequest.jovo.$components[latestComponentFromSessionStack[0]];

      /**
       * ! operator used, since we only access these properties of **active** components,
       * for which these values are set in `delegate()`
       */
      const componentSessionData: ComponentSessionData = {
        data: activeComponentObject.data!,
        onCompletedIntent: activeComponentObject.onCompletedIntent!,
        stateBeforeDelegate: activeComponentObject.stateBeforeDelegate!,
      };

      latestComponentFromSessionStack[1] = componentSessionData;
    }
  }

  /**
   * Loads the data of the current active component (last element in component array inside session data)
   * to its $components object
   * @param {Jovo} jovo
   */
  static loadLatestComponentSessionData(jovo: Jovo): void {
    if (
      !jovo.$session.$data[SessionConstants.COMPONENT] ||
      jovo.$session.$data[SessionConstants.COMPONENT].length < 1
    ) {
      return;
    } else {
      const componentSessionArray: Array<[string, ComponentSessionData]> =
        jovo.$session.$data[SessionConstants.COMPONENT];
      const activeComponentData: [string, ComponentSessionData] =
        componentSessionArray[componentSessionArray.length - 1];

      jovo.$components[activeComponentData[0]] = _merge(
        jovo.$components[activeComponentData[0]],
        activeComponentData[1],
      );
    }
  }

  components: {
    [key: string]: ComponentPlugin;
  } = {};
  /**
   * Can't save array of components parsed to `useComponents()` inside `components`,
   * because their names aren't final yet.
   * Has to be done in `install()`.
   * The components are saved until then inside this array.
   */
  componentsToBeInstalled: ComponentPlugin[] = [];
  config: ComponentConfig = {};
  handler: Handler = {};
  i18next?: I18Next;
  id?: string;
  moduleName?: string;
  name?: string;
  pathToI18n?: string; // path to dir

  constructor(config?: ComponentConfig) {
    super(config);
    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  install(app: BaseApp) {
    this.componentsToBeInstalled.forEach((componentPlugin) => {
      componentPlugin.name = componentPlugin.name || componentPlugin.constructor.name;
      _merge(componentPlugin.config, this.config[componentPlugin.name]);

      this.components[componentPlugin.name!] = componentPlugin;
      componentPlugin.install(app);
    });

    app
      .middleware('after.setup')!
      .use(this.prepareHandler.bind(this), this.loadI18nFiles.bind(this));

    this.i18next = new I18Next();
  }

  /**
   * Adds the component to the app object's $baseComponents, i.e. first layer
   * @param {HandleRequest} handleRequest
   */
  setAsBaseComponent(handleRequest: HandleRequest) {
    if (!handleRequest.app.$baseComponents) {
      handleRequest.app.$baseComponents = {};
    }

    handleRequest.app.$baseComponents[this.name!] = this;
  }

  /**
   * Merge the handlers of the component's components inside the the component's own handler.
   * @param {HandleRequest} handleRequest
   */
  prepareHandler(handleRequest: HandleRequest) {
    const childComponents = Object.values(this.components);
    childComponents.forEach((component) => {
      this.handler[this.name!] = { ...this.handler[this.name!], ...component.handler };
    });
  }

  /**
   * Adds the component's handler to the app's one
   * @param {HandleRequest} handleRequest
   */
  setHandler(handleRequest: HandleRequest) {
    handleRequest.app.setHandler(this.handler);
  }

  /**
   * Saves component's components inside the `components` array.
   *
   * We can't initialize here, because at the time at which this function is executed we don't have
   * access to an app object, which we need to set the handler, etc.
   * @param {ComponentPlugin[]} components
   */
  useComponents(...components: ComponentPlugin[]) {
    this.componentsToBeInstalled = [...this.componentsToBeInstalled, ...components];
  }

  /**
   * Adds the components i18n files to the $cms.I18Next object
   * @param handleRequest
   */
  async loadI18nFiles(handleRequest: HandleRequest) {
    const pathToComponent = `./components/${this.name}/`;
    this.i18next!.config.filesDir = path
      .join(pathToComponent, this.pathToI18n || '')
      .replace(new RegExp('\\' + path.sep, 'g'), '/');

    this.i18next!.loadFiles(handleRequest);
  }
}

export { ComponentPlugin };
