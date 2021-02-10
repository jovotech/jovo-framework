/**
 * Set of middlewares predefined for an extensible class
 */
import { Extensible } from './Extensible';
import { Middleware } from './Middleware';
export declare class ActionSet {
    middleware: Map<string, Middleware>;
    constructor(names: string[], parent: Extensible);
    /**
     * Returns middleware
     * @param {string} middlewareName
     * @return {Middleware | undefined}
     */
    get(middlewareName: string): Middleware | undefined;
    /**
     * Creates meiddleware
     * @param {string} middlewareName
     * @param {Extensible} parent
     * @returns {Middleware}
     */
    create(middlewareName: string, parent: Extensible): Middleware;
}
