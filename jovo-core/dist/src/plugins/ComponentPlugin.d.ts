import { ComponentConfig } from '../plugins/Component';
import { BaseApp, HandleRequest, Jovo } from '..';
import { Extensible } from './../core/Extensible';
import { Handler } from './../Interfaces';
import { I18Next } from './I18Next';
declare class ComponentPlugin extends Extensible {
    /**
     * Sets the active components, which are either the $baseComponents (if no component is active)
     * or the active component (last element in component session stack),
     * and the components inside its `components` object
     * @param {Jovo} jovo
     */
    static setActiveComponentPlugins(jovo: Jovo): void;
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
    static initializeComponents(handleRequest: HandleRequest): void;
    /**
     * Stores the data from the $components object of the current active component
     * inside the session data
     * @param {HandleRequest} handleRequest
     */
    static saveComponentSessionData(handleRequest: HandleRequest): void;
    /**
     * Loads the data of the current active component (last element in component array inside session data)
     * to its $components object
     * @param {Jovo} jovo
     */
    static loadLatestComponentSessionData(jovo: Jovo): void;
    components: {
        [key: string]: ComponentPlugin;
    };
    /**
     * Can't save array of components parsed to `useComponents()` inside `components`,
     * because their names aren't final yet.
     * Has to be done in `install()`.
     * The components are saved until then inside this array.
     */
    componentsToBeInstalled: ComponentPlugin[];
    config: ComponentConfig;
    handler: Handler;
    i18next?: I18Next;
    id?: string;
    moduleName?: string;
    name?: string;
    pathToI18n?: string;
    constructor(config?: ComponentConfig);
    install(app: BaseApp): void;
    /**
     * Adds the component to the app object's $baseComponents, i.e. first layer
     * @param {HandleRequest} handleRequest
     */
    setAsBaseComponent(handleRequest: HandleRequest): void;
    /**
     * Merge the handlers of the component's components inside the the component's own handler.
     * @param {HandleRequest} handleRequest
     */
    prepareHandler(handleRequest: HandleRequest): void;
    /**
     * Adds the component's handler to the app's one
     * @param {HandleRequest} handleRequest
     */
    setHandler(handleRequest: HandleRequest): void;
    /**
     * Saves component's components inside the `components` array.
     *
     * We can't initialize here, because at the time at which this function is executed we don't have
     * access to an app object, which we need to set the handler, etc.
     * @param {ComponentPlugin[]} components
     */
    useComponents(...components: ComponentPlugin[]): void;
    /**
     * Adds the components i18n files to the $cms.I18Next object
     * @param handleRequest
     */
    loadI18nFiles(handleRequest: HandleRequest): Promise<void>;
}
export { ComponentPlugin };
