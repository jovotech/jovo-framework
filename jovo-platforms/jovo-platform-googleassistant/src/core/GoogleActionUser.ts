import {User} from 'jovo-core';
import _get = require('lodash.get');
import {GoogleAction} from "./GoogleAction";

export interface UserProfile {
    displayName: string;
    givenName: string;
    familyName: string;
}

export class GoogleActionUser extends User {
    googleAction: GoogleAction;

    $storage: any = {}; // tslint:disable-line

    constructor(googleAction: GoogleAction) {
        super(googleAction);
        this.googleAction = googleAction;

    }

    getAccessToken() {
        return this.googleAction.$request!.getAccessToken();
    }
    getId(): string {
        return this.$storage.userId;
    }

    /**
     * Returns user profile after askForName permission
     * @return {UserProfile}
     */
    getProfile(): UserProfile {
        return _get(this.googleAction.$originalRequest, 'user.profile');
    }

    /**
     * Returns granted permission array after askForPermission
     * @return {string[]}
     */
    getPermissions(): string[] {
        return _get(this.googleAction.$originalRequest, 'user.permissions');
    }


    /**
     * Checks for permission
     * @param {string} permission
     * @return {boolean}
     */
    hasPermission(permission: string): boolean {
        const permissions = this.getPermissions();

        if (!permissions) {
            return false;
        }
        return permissions.includes(permission);

    }


    /**
     * Checks for name permission
     * @return {boolean}
     */
    hasNamePermission(): boolean {
        return this.hasPermission('NAME');
    }


    /**
     * Checks for precise location permission
     * @return {boolean}
     */
    hasPreciseLocationPermission(): boolean {
        return this.hasPermission('DEVICE_PRECISE_LOCATION');
    }


    /**
     * Checks for coarse location permission
     * @return {boolean}
     */
    hasCoarseLocationPermission(): boolean {
        return this.hasPermission('DEVICE_COARSE_LOCATION');
    }
}
