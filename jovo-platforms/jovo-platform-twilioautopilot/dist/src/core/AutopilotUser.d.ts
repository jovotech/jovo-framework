import { User } from 'jovo-core';
import { AutopilotBot } from './AutopilotBot';
export declare class AutopilotUser extends User {
    autopilotBot: AutopilotBot;
    constructor(autopilotBot: AutopilotBot);
    getId(): string;
}
