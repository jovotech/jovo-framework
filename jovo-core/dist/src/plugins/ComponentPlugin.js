"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = require("../plugins/Component");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
const path = require("path");
const __1 = require("..");
const Extensible_1 = require("./../core/Extensible");
const I18Next_1 = require("./I18Next");
class ComponentPlugin extends Extensible_1.Extensible {
    constructor(config) {
        super(config);
        this.components = {};
        /**
         * Can't save array of components parsed to `useComponents()` inside `components`,
         * because their names aren't final yet.
         * Has to be done in `install()`.
         * The components are saved until then inside this array.
         */
        this.componentsToBeInstalled = [];
        this.config = {};
        this.handler = {};
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    /**
     * Sets the active components, which are either the $baseComponents (if no component is active)
     * or the active component (last element in component session stack),
     * and the components inside its `components` object
     * @param {Jovo} jovo
     */
    static setActiveComponentPlugins(jovo) {
        const componentSessionStack = jovo.$session.$data[__1.SessionConstants.COMPONENT];
        if (!componentSessionStack || componentSessionStack.length < 1) {
            jovo.$activeComponents = jovo.$app.$baseComponents;
        }
        else {
            const componentSessionStackNames = componentSessionStack.map(([name]) => name);
            const componentPath = componentSessionStackNames.reduce((accumulator, currentValue) => `${accumulator}.components.${currentValue}`);
            const activeComponent = _get(jovo.$app.$baseComponents, componentPath);
            jovo.$activeComponents = {
                [activeComponent.name]: activeComponent,
            };
            const activeComponentsChildComponents = Object.values(activeComponent.components);
            activeComponentsChildComponents.forEach((component) => {
                jovo.$activeComponents[component.name] = component;
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
    static initializeComponents(handleRequest) {
        if (!handleRequest.jovo) {
            return;
        }
        ComponentPlugin.setActiveComponentPlugins(handleRequest.jovo);
        if (!handleRequest.jovo.$components) {
            handleRequest.jovo.$components = {};
        }
        const activeComponents = Object.values(handleRequest.jovo.$activeComponents);
        activeComponents.forEach((component) => {
            const componentObject = new Component_1.Component({ config: component.config, name: component.name });
            handleRequest.jovo.$components[componentObject.name] = componentObject;
        });
        ComponentPlugin.loadLatestComponentSessionData(handleRequest.jovo);
    }
    /**
     * Stores the data from the $components object of the current active component
     * inside the session data
     * @param {HandleRequest} handleRequest
     */
    static saveComponentSessionData(handleRequest) {
        if (!handleRequest.jovo) {
            return;
        }
        const componentSessionStack = handleRequest.jovo.$session.$data[__1.SessionConstants.COMPONENT];
        if (!componentSessionStack || componentSessionStack.length < 1) {
            return;
        }
        else {
            const latestComponentFromSessionStack = componentSessionStack[componentSessionStack.length - 1];
            const activeComponentObject = handleRequest.jovo.$components[latestComponentFromSessionStack[0]];
            /**
             * ! operator used, since we only access these properties of **active** components,
             * for which these values are set in `delegate()`
             */
            const componentSessionData = {
                data: activeComponentObject.data,
                onCompletedIntent: activeComponentObject.onCompletedIntent,
                stateBeforeDelegate: activeComponentObject.stateBeforeDelegate,
            };
            latestComponentFromSessionStack[1] = componentSessionData;
        }
    }
    /**
     * Loads the data of the current active component (last element in component array inside session data)
     * to its $components object
     * @param {Jovo} jovo
     */
    static loadLatestComponentSessionData(jovo) {
        if (!jovo.$session.$data[__1.SessionConstants.COMPONENT] ||
            jovo.$session.$data[__1.SessionConstants.COMPONENT].length < 1) {
            return;
        }
        else {
            const componentSessionArray = jovo.$session.$data[__1.SessionConstants.COMPONENT];
            const activeComponentData = componentSessionArray[componentSessionArray.length - 1];
            jovo.$components[activeComponentData[0]] = _merge(jovo.$components[activeComponentData[0]], activeComponentData[1]);
        }
    }
    install(app) {
        this.componentsToBeInstalled.forEach((componentPlugin) => {
            componentPlugin.name = componentPlugin.name || componentPlugin.constructor.name;
            _merge(componentPlugin.config, this.config[componentPlugin.name]);
            this.components[componentPlugin.name] = componentPlugin;
            componentPlugin.install(app);
        });
        app
            .middleware('after.setup')
            .use(this.prepareHandler.bind(this), this.loadI18nFiles.bind(this));
        this.i18next = new I18Next_1.I18Next();
    }
    /**
     * Adds the component to the app object's $baseComponents, i.e. first layer
     * @param {HandleRequest} handleRequest
     */
    setAsBaseComponent(handleRequest) {
        if (!handleRequest.app.$baseComponents) {
            handleRequest.app.$baseComponents = {};
        }
        handleRequest.app.$baseComponents[this.name] = this;
    }
    /**
     * Merge the handlers of the component's components inside the the component's own handler.
     * @param {HandleRequest} handleRequest
     */
    prepareHandler(handleRequest) {
        const childComponents = Object.values(this.components);
        childComponents.forEach((component) => {
            this.handler[this.name] = Object.assign(Object.assign({}, this.handler[this.name]), component.handler);
        });
    }
    /**
     * Adds the component's handler to the app's one
     * @param {HandleRequest} handleRequest
     */
    setHandler(handleRequest) {
        handleRequest.app.setHandler(this.handler);
    }
    /**
     * Saves component's components inside the `components` array.
     *
     * We can't initialize here, because at the time at which this function is executed we don't have
     * access to an app object, which we need to set the handler, etc.
     * @param {ComponentPlugin[]} components
     */
    useComponents(...components) {
        this.componentsToBeInstalled = [...this.componentsToBeInstalled, ...components];
    }
    /**
     * Adds the components i18n files to the $cms.I18Next object
     * @param handleRequest
     */
    async loadI18nFiles(handleRequest) {
        const pathToComponent = `./components/${this.name}/`;
        this.i18next.config.filesDir = path
            .join(pathToComponent, this.pathToI18n || '')
            .replace(new RegExp('\\' + path.sep, 'g'), '/');
        this.i18next.loadFiles(handleRequest);
    }
}
exports.ComponentPlugin = ComponentPlugin;
//# sourceMappingURL=ComponentPlugin.js.map