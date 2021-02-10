import { Jovo } from 'jovo-core';
import { DialogflowUser } from '../../DialogflowUser';
import { CarrierLocation, TwilioPayload } from './interfaces';
export declare class TwilioUser extends DialogflowUser {
    private twilioPayload;
    constructor(jovo: Jovo);
    getAccessToken(): string | undefined;
    getPhoneNumber(): string;
    getCarrierLocation(): CarrierLocation;
    getTwilioPayload(): TwilioPayload;
}
