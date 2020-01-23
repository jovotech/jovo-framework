import { JovoError, User } from 'jovo-core';
import _get = require('lodash.get');
import { GoogleAction } from './GoogleAction';
import * as https from 'https';

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

  async getGoogleProfile(): Promise<GoogleAccountProfile> {
    const tokenId = _get(this.googleAction.$originalRequest, 'user.idToken');

    if (!tokenId) {
      throw new JovoError('No token found.!');
    }

    return new Promise((resolve, reject) => {
      const options = {
        host: 'oauth2.googleapis.com',
        port: 443,
        path: `/tokeninfo?id_token=${tokenId}`,
        timeout: 2000,
        protocol: 'https:',
      };

      const req = https
        .get(options, (resp) => {
          let data = '';

          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            data += chunk;
          });

          // The whole response has been received. Print out the result.
          resp.on('end', () => {
            try {
              const googleAccount = JSON.parse(data) as GoogleAccountProfile;
              return resolve(googleAccount);
            } catch (e) {
              reject(e);
            }
          });
        })
        .on('error', (err) => {
          reject(err);
        });
      req.on('timeout', () => {
        req.abort();
      });
    });
  }
}
