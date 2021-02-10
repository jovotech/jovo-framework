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
export declare class GoogleActionUser extends User {
    googleAction: GoogleAction;
    $storage: any;
    constructor(googleAction: GoogleAction);
    getAccessToken(): string | undefined;
    getId(): string;
    getProfile(): UserProfile;
    getPermissions(): string[];
    hasPermission(permission: string): boolean;
    hasNamePermission(): boolean;
    hasPreciseLocationPermission(): boolean;
    hasCoarseLocationPermission(): boolean;
    getGoogleProfile(): Promise<GoogleAccountProfile>;
}
