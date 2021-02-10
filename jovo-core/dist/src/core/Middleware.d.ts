import { Extensible } from './Extensible';
export declare class Middleware {
    fns: Function[];
    name: string;
    parent: Extensible;
    enabled: boolean;
    constructor(name: string, parent: Extensible);
    /**
     * Adds function to middleware array
     * @param {Function[]} fns
     * @returns {this}
     */
    use(...fns: Function[]): this;
    /**
     * Removes function from functions array
     * @param {Function} fn
     */
    remove(fn: Function): void;
    /**
     * Calls every function from the functions array.
     * Also checks for a 'before' middleware and calls it.
     * @emits middleware name
     * @param {any} obj
     * @param {boolean} concurrent
     * @return {Promise<void>}
     */
    run(obj: any, concurrent?: boolean): Promise<void>;
    /**
     * Disables middleware
     */
    disable(): void;
    /**
     * Disables middleware
     */
    skip(): void;
}
