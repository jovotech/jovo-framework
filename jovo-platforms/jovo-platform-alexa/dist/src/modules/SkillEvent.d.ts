import { AlexaSkill } from '../core/AlexaSkill';
import { Plugin } from 'jovo-core';
import { Alexa } from '../Alexa';
export interface EventSkillAccountLinkedBody {
    accessToken: string;
}
export interface EventSkillEnabledBody {
}
export interface EventSkillDisabledBody {
    userInformationPersistenceStatus: 'PERSISTED' | 'NOT_PERSISTED';
}
export interface AcceptedPermission {
    scope: string;
}
export interface EventSkillPermissionAcceptedBody {
    acceptedPermissions: AcceptedPermission[];
}
export declare class SkillEvent implements Plugin {
    install(alexa: Alexa): void;
    uninstall(alexa: Alexa): void;
    type(alexaSkill: AlexaSkill): void;
}
