import { Plugin, BaseApp } from 'jovo-core';
import { Config } from '../../DialogflowCore';
import { Dialogflow } from '../../Dialogflow';
import { DialogflowAgent } from '../../DialogflowAgent';
export declare class Twilio implements Plugin {
    config: Config;
    constructor(config?: Config);
    install(dialogFlow: Dialogflow): void;
    uninstall(app: BaseApp): void;
    type(dialogflowAgent: DialogflowAgent): void;
}
