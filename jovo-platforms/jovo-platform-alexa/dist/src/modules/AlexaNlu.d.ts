import { Alexa } from '../Alexa';
import { Plugin } from 'jovo-core';
import { AlexaSkill } from '../core/AlexaSkill';
export declare class AlexaNlu implements Plugin {
    install(alexa: Alexa): void;
    uninstall(alexa: Alexa): void;
    nlu(alexaSkill: AlexaSkill): Promise<void>;
    inputs(alexaSkill: AlexaSkill): void;
}
