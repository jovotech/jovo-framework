import { Plugin } from 'jovo-core';
import { Alexa } from '../Alexa';
import { HandleRequest } from 'jovo-core';
import { AlexaSkill } from '../core/AlexaSkill';
export declare class AlexaCore implements Plugin {
    install(alexa: Alexa): void;
    uninstall(alexa: Alexa): void;
    init(handleRequest: HandleRequest): Promise<void>;
    request(alexaSkill: AlexaSkill): Promise<void>;
    type(alexaSkill: AlexaSkill): Promise<void>;
    session(alexaSkill: AlexaSkill): Promise<void>;
    output(alexaSkill: AlexaSkill): void;
}
