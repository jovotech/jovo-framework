import { User } from 'jovo-core';
import { GoogleAction } from './GoogleAction';
export interface UserProfile {
    displayName: string;
    givenName: string;
    familyName: string;
}
export interface GoogleAccountProfile {
    email: string;
    email_verified: boolean;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    [key: string]: string | boolean;
}
export declare class ConversationalActionUser extends User {
    conversationalAction: GoogleAction;
    $params: any;
    constructor(conversationalAction: GoogleAction);
    getId(): string | undefined;
    getGoogleProfile(): Promise<GoogleAccountProfile>;
    isAccountLinked(): boolean;
    isVerified(): boolean;
    getEntitlements(): import("./Interfaces").PackageEntitlement[] | undefined;
}
