import { Plugin, BaseApp } from 'jovo-core';
import { Config } from '../../DialogflowCore';
import { Dialogflow } from '../../Dialogflow';
import { DialogflowAgent } from '../../DialogflowAgent';
export interface SlackConfig extends Config {
    source: string;
}
export declare class Slack implements Plugin {
    config: SlackConfig;
    constructor(config?: Config);
    install(dialogFlow: Dialogflow): void;
    uninstall(app: BaseApp): void;
    type(dialogflowAgent: DialogflowAgent): void;
    output(dialogflowAgent: DialogflowAgent): void;
}
