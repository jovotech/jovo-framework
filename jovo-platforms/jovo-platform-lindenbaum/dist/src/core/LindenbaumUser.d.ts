import { User } from 'jovo-core';
import { LindenbaumBot } from './LindenbaumBot';
export declare class LindenbaumUser extends User {
    lindenbaumBot: LindenbaumBot;
    constructor(lindenbaumBot: LindenbaumBot);
    getId(): string;
}
