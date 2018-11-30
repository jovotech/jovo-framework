import {Extensible} from "./Extensible";

export class Middleware {

    fns: Function[];
    name: string;
    parent: Extensible;
    enabled = true;

    constructor(name: string, parent: Extensible) {
        this.name = name;
        this.parent = parent;
        this.fns = [];
    }

    /**
     * Adds function to middleware array
     * @param {Function[]} fns
     * @returns {this}
     */
    use(...fns: Function[]) {
        this.fns = this.fns.concat(fns);
        return this;
    }


    /**
     * Calls every function from the functions array.
     * Also checks for a 'before' middleware and calls it.
     * @emits middleware name
     * @param {any} obj
     * @return {Promise<void>}
     */
    async run(obj: object) {

        if (!this.parent.config.enabled) {
            return Promise.resolve();
        }
        if (this.enabled === false) {
            return Promise.resolve();
        }

        // before middleware available?
        if (this.parent.hasMiddleware(`before.${this.name}`)) {
            await this.parent.middleware(`before.${this.name}`)!.run(obj);
        }
        this.parent.emit(`before.${this.name}`, obj);

        for (const fn of this.fns) {
            await fn.apply(null, arguments);
        }

        this.parent.emit(`${this.name}`, obj);

        // after middleware available?
        if (this.parent.hasMiddleware(`after.${this.name}`)) {
            await this.parent.middleware(`after.${this.name}`)!.run(obj);
        }
        this.parent.emit(`after.${this.name}`, obj);
    }

    disable() {
        this.enabled = false;
    }

    skip() {
        this.enabled = false;
    }
}
