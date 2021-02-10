import { Plugin } from 'jovo-core';
import { Alexa } from '../Alexa';
import { AlexaSkill } from '../core/AlexaSkill';
export declare class Cards implements Plugin {
    install(alexa: Alexa): void;
    uninstall(alexa: Alexa): void;
    output(alexaSkill: AlexaSkill): void;
}
