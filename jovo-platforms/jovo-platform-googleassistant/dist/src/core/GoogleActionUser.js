"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const https = require("https");
class GoogleActionUser extends jovo_core_1.User {
    constructor(googleAction) {
        super(googleAction);
        this.$storage = {};
        this.googleAction = googleAction;
    }
    getAccessToken() {
        return this.googleAction.$request.getAccessToken();
    }
    getId() {
        return this.$storage.userId;
    }
    getProfile() {
        return _get(this.googleAction.$originalRequest, 'user.profile');
    }
    getPermissions() {
        return _get(this.googleAction.$originalRequest, 'user.permissions');
    }
    hasPermission(permission) {
        const permissions = this.getPermissions();
        if (!permissions) {
            return false;
        }
        return permissions.includes(permission);
    }
    hasNamePermission() {
        return this.hasPermission('NAME');
    }
    hasPreciseLocationPermission() {
        return this.hasPermission('DEVICE_PRECISE_LOCATION');
    }
    hasCoarseLocationPermission() {
        return this.hasPermission('DEVICE_COARSE_LOCATION');
    }
    async getGoogleProfile() {
        const tokenId = _get(this.googleAction.$originalRequest, 'user.idToken');
        if (!tokenId) {
            throw new jovo_core_1.JovoError('No token found.!');
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
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    try {
                        const googleAccount = JSON.parse(data);
                        return resolve(googleAccount);
                    }
                    catch (e) {
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
exports.GoogleActionUser = GoogleActionUser;
//# sourceMappingURL=GoogleActionUser.js.map