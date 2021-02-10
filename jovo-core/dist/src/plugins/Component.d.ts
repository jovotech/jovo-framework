import { PluginConfig } from '../Interfaces';
declare class Component {
    $response?: Response;
    config: Config;
    data: ComponentData;
    name: string;
    onCompletedIntent?: string;
    stateBeforeDelegate?: string;
    constructor(options: ConstructorOptions);
}
interface ComponentData {
    [key: string]: any;
}
/**
 * Data from a component that has to be persisted across requests & responses
 */
interface ComponentSessionData {
    data: ComponentData;
    onCompletedIntent: string;
    stateBeforeDelegate: string;
}
interface Config extends PluginConfig {
    intentMap?: {
        [key: string]: string;
    };
}
interface ConstructorOptions {
    config: Config;
    name: string;
}
interface DelegationOptions {
    data?: ComponentData;
    onCompletedIntent: string;
    stateBeforeDelegate?: string;
}
interface Response {
    data?: ComponentData;
    error?: Error;
    status: ResponseStatus;
}
declare type ResponseStatus = 'SUCCESSFUL' | 'REJECTED' | 'ERROR';
export { Component, ComponentData, ComponentSessionData, Config as ComponentConfig, ConstructorOptions as ComponentConstructorOptions, DelegationOptions as ComponentDelegationOptions, Response as ComponentResponse, ResponseStatus as ComponentResponseStatus, };
