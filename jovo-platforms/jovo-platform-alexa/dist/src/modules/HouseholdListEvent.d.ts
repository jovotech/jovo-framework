import { AlexaSkill } from '../core/AlexaSkill';
import { Plugin } from 'jovo-core';
import { Alexa } from '../Alexa';
export declare class HouseholdListEvent implements Plugin {
    install(alexa: Alexa): void;
    uninstall(alexa: Alexa): void;
    type(alexaSkill: AlexaSkill): void;
}
