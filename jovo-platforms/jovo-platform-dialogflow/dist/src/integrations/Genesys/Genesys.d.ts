import { Plugin, BaseApp } from 'jovo-core';
import { Config } from '../../DialogflowCore';
import { Dialogflow } from '../../Dialogflow';
import { DialogflowAgent } from '../../DialogflowAgent';
export declare class Genesys implements Plugin {
    config: {
        enabled: boolean;
    };
    constructor(config?: Config);
    install(dialogFlow: Dialogflow): void;
    uninstall(app: BaseApp): void;
    type(dialogflowAgent: DialogflowAgent): void;
    output(dialogflowAgent: DialogflowAgent): void;
}
