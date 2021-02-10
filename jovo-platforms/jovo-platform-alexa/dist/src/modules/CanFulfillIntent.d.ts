import { AlexaSkill } from '../core/AlexaSkill';
import { Alexa } from '../Alexa';
import { Plugin } from 'jovo-core';
export declare class CanFulfillIntent implements Plugin {
    static VALID_VALUES: string[];
    constructor();
    install(alexa: Alexa): void;
    uninstall(alexa: Alexa): void;
    type(alexaSkill: AlexaSkill): void;
    output(alexaSkill: AlexaSkill): Promise<void>;
}
