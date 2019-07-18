import { I18Next } from 'jovo-cms-i18next';
import {
	BaseApp,
	Extensible,
	Log,
    Handler,
    HandleRequest,
	SessionConstants,
} from 'jovo-core';
import { Component, ComponentConfig } from './Component';

import _merge = require('lodash.merge');
import _cloneDeep = require('lodash.clonedeep');
import * as path from 'path';

class ComponentPlugin extends Extensible {
	components: {
		[key: string]: ComponentPlugin;
	} = {};
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
		this.name = this.name || this.constructor.name;
		const childComponents = Object.values(this.components);
		childComponents.forEach((component) => {
			component.install(app);
		});

		// load components i18n files before setup as in setup the i18n object is initialized
		app.middleware('after.setup')!.use(
			this.prepareHandler.bind(this),
			this.loadI18nFiles.bind(this)
		);

		this.i18next = new I18Next();
	}

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
			this.handler[this.name!] = {...this.handler[this.name!], ...component.handler};
		});
	}

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
		components.forEach((component) => {
			this.components[component.name!] = component;
		});
	}

	/**
	 * Adds the components i18n files to the $cms.I18Next object
	 * @param handleRequest
	 */
	async loadI18nFiles(handleRequest: HandleRequest) {
		const pathToComponent = `../components/${this.name}/`;
		const filesDir = path
			.join(pathToComponent, this.pathToI18n || '')
			.replace(new RegExp('\\' + path.sep, 'g'), '/');
		this.i18next!.config.filesDir = filesDir;

		this.i18next!.loadFiles(handleRequest);
	}

	/**
	 * Merges the component's default config with the config defined in the project's main config.js file,
	 * and saves it inside components `config` property
	 * @param {ComponentConfig} appConfig config defined in project's main config.js file
	 */
	mergeConfig(appConfig: ComponentConfig): ComponentConfig {
		const mergedComponentConfig = _merge(this.config, appConfig);

		return mergedComponentConfig;
	}

	/**
	 * Sets the active components, which are either the $baseComponents (if no component is active)
	 * or the active component and the components inside its `components` object
	 * Needs access to Jovo object!
	 * @param {HandleRequest} handleRequest
	 */
	static setActiveComponents(handleRequest: HandleRequest) {
		if (!handleRequest.jovo) return;

		const sessionComponentStack: string[] = handleRequest.jovo.$session.$data[SessionConstants.COMPONENT];
		
		if (sessionComponentStack.length < 1) {
			handleRequest.jovo.$activeComponents = handleRequest.app.$baseComponents;
		} else {
			const componentPath: string = sessionComponentStack.reduce(
				(accumulator, currentValue) => `${accumulator}.components.${currentValue}`
			);
			const activeComponent: ComponentPlugin = getDeepValue(handleRequest.app.$baseComponents, componentPath);

			handleRequest.jovo.$activeComponents= {
				[activeComponent.name!]: activeComponent
			};

			const activeComponentsChildComponents = Object.values(activeComponent.components);
			activeComponentsChildComponents.forEach((component) => {
				handleRequest.jovo!.$activeComponents[component.name!] = component;
			});
		}
	}

	/**
	 * Updates the component stack in the session attributes.
	 * If the framework delegated to a component, the stack is up to date.
	 * It only needs to be updated if the component was done and routed back to the initial state,
	 * which means the state and the component name are different.
	 * In that case the latest element in the stack is removed.
	 * @param {HandleRequest} handleRequest
	 */
	static updateSessionComponentStack(handleRequest: HandleRequest) {
		if (!handleRequest.jovo) return;

		const state: string = handleRequest.jovo.$session.$data[SessionConstants.STATE];
		const sessionComponentStack: string[] = handleRequest.jovo.$session.$data[SessionConstants.COMPONENT]
		const componentName = sessionComponentStack[sessionComponentStack.length - 1];

		if (state !== componentName) {
			handleRequest.jovo.$session.$data[SessionConstants.COMPONENT].pop();
		}
	}

	/**
	 * Adds a reference to a specific component inside the $components object
	 * @param handleRequest
	 */
	static initializeComponent(handleRequest: HandleRequest) {
		if (!handleRequest.jovo) return;

		if (!handleRequest.jovo.$components) {
			handleRequest.jovo.$components = {};
		}

		const activeComponents: ComponentPlugin[] = Object.values(handleRequest.jovo.$activeComponents);

		activeComponents.forEach((component) => {
			const componentObject = new Component(component.config);
			componentObject.name = component.name;
			handleRequest.jovo!.$components[component.name!] = componentObject;
		});	
	}
}

/**
 * The function will return the value of the property specified using the path.
 * Similar to lodash.get
 * @param obj Object from which the function will get the value
 * @param path The path to the value of the object
 */
function getDeepValue(obj: any, path: string): any { // tslint:disable-line
	return path.split('.').reduce((res, prop) => res[prop], obj);
}

export { ComponentPlugin };