import { User } from 'jovo-core';
import { SapCaiSkill } from './SapCaiSkill';
export declare class SapCaiUser extends User {
    caiSkill: SapCaiSkill;
    constructor(caiSkill: SapCaiSkill);
    getAccessToken(): string | undefined;
    getId(): string;
}
