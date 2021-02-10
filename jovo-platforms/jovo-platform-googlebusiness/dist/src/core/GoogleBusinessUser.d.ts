import { User } from 'jovo-core';
import { GoogleBusinessBot } from './GoogleBusinessBot';
export declare class GoogleBusinessUser extends User {
    googleBusinessBot: GoogleBusinessBot;
    constructor(googleBusinessBot: GoogleBusinessBot);
    getId(): string;
}
