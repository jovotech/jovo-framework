import { HandleRequest, Plugin } from 'jovo-core';
import { GoogleBusinessBot } from '../core/GoogleBusinessBot';
import { GoogleBusiness } from '../GoogleBusiness';
export declare class GoogleBusinessCore implements Plugin {
    install(googleBusiness: GoogleBusiness): void;
    init(handleRequest: HandleRequest): Promise<void>;
    request(googleBusinessBot: GoogleBusinessBot): Promise<void>;
    type(googleBusinessBot: GoogleBusinessBot): Promise<void>;
    output(googleBusinessBot: GoogleBusinessBot): Promise<void>;
}
