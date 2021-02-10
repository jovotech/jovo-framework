import { BaseApp, Plugin, PluginConfig } from 'jovo-core';
import { Dialogflow } from './Dialogflow';
import { DialogflowAgent } from './DialogflowAgent';
export interface Config extends PluginConfig {
    sessionContextId?: string;
}
export declare class DialogflowCore implements Plugin {
    config: Config;
    constructor(config?: Config);
    install(dialogFlow: Dialogflow): void;
    uninstall(app: BaseApp): void;
    request(dialogflowAgent: DialogflowAgent): void;
    type(dialogflowAgent: DialogflowAgent): void;
    nlu(dialogflowAgent: DialogflowAgent): void;
    inputs(dialogflowAgent: DialogflowAgent): void;
    session(dialogflowAgent: DialogflowAgent): void;
    output(dialogflowAgent: DialogflowAgent): void;
}
