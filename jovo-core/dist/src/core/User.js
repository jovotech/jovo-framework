"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(jovo) {
        this.new = true;
        this.jovo = jovo;
    }
    /**
     * Returns user id
     * @returns {string | undefined}
     */
    getId() {
        return undefined;
    }
    /**
     * Returns true if user is new
     * @return {boolean}
     */
    isNew() {
        return this.new;
    }
    /**
     * Returns true if user is new
     * @return {boolean}
     */
    isNewUser() {
        return this.isNew();
    }
    /**
     * Returns user access token
     * @returns {string | undefined}
     */
    getAccessToken() {
        return undefined;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map