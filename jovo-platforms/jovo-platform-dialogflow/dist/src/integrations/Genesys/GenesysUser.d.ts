import { Jovo } from 'jovo-core';
import { DialogflowUser } from '../../DialogflowUser';
export declare class GenesysUser extends DialogflowUser {
    constructor(jovo: Jovo);
    getAccessToken(): string | undefined;
    getId(): string;
    getNoInputLimit(): number | undefined;
    getConversationId(): number | undefined;
    getNoInputCount(): number | undefined;
}
