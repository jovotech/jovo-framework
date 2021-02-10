import { Plugin } from 'jovo-core';
import { GoogleBusiness, GoogleBusinessBot } from '../../../src';
export declare class GoogleBusinessMockNlu implements Plugin {
    install(googleBusiness: GoogleBusiness): void;
    nlu(googleBusinessBot: GoogleBusinessBot): Promise<void>;
    inputs(googleBusinessBot: GoogleBusinessBot): Promise<void>;
}
