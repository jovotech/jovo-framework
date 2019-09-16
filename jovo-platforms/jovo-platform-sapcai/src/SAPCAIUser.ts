import {User, Jovo} from 'jovo-core';
import { SAPCAIRequest } from "./SAPCAIRequest";
import { SAPCAISkill } from './SAPCAISkill';

export class SAPCAIUser extends User {
    sapcaiSkill: SAPCAISkill;

    constructor(sapcaiSkill: SAPCAISkill) {
        super(sapcaiSkill);
        this.sapcaiSkill = sapcaiSkill;
        const sapcaiRequest: SAPCAIRequest = this.sapcaiSkill.$request as SAPCAIRequest;
    }

    getAccessToken() {
        return this.sapcaiSkill.$request!.getAccessToken();
    }

    getId(): string {
        return this.sapcaiSkill.$request!.getUserId();
    }
    
}
