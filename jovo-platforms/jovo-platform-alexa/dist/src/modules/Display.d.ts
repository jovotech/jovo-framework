import { Plugin } from 'jovo-core';
import { AlexaSkill } from '../core/AlexaSkill';
import { Alexa } from '../Alexa';
export declare class Display implements Plugin {
    install(alexa: Alexa): void;
    uninstall(alexa: Alexa): void;
    type(alexaSkill: AlexaSkill): void;
    output(alexaSkill: AlexaSkill): void;
}
