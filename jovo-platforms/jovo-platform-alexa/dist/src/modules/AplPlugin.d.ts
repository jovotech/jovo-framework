import { Plugin } from 'jovo-core';
import { AlexaSkill } from '../core/AlexaSkill';
import { Alexa } from '../Alexa';
export declare class Apl {
    version: string;
    alexaSkill: AlexaSkill;
    constructor(alexaSkill: AlexaSkill);
    addDocumentDirective(documentDirective: any): this;
    addCommands(token: string, commands: any[]): this;
    setVersion(version: string): void;
    isUserEvent(): boolean;
    getEventArguments(): any;
}
export declare class AplPlugin implements Plugin {
    install(alexa: Alexa): void;
    uninstall(alexa: Alexa): void;
    type(alexaSkill: AlexaSkill): void;
    output(alexaSkill: AlexaSkill): void;
}
