"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Middleware_1 = require("./Middleware");
class ActionSet {
    constructor(names, parent) {
        this.middleware = new Map();
        names.forEach((name) => {
            this.create(name, parent);
        });
    }
    /**
     * Returns middleware
     * @param {string} middlewareName
     * @return {Middleware | undefined}
     */
    get(middlewareName) {
        return this.middleware.get(middlewareName);
    }
    /**
     * Creates meiddleware
     * @param {string} middlewareName
     * @param {Extensible} parent
     * @returns {Middleware}
     */
    create(middlewareName, parent) {
        const middleware = new Middleware_1.Middleware(middlewareName, parent);
        this.middleware.set(middlewareName, middleware);
        return middleware;
    }
}
exports.ActionSet = ActionSet;
//# sourceMappingURL=ActionSet.js.map