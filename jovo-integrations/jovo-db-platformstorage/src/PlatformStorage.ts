import {BaseApp, Db, Jovo, PluginConfig} from 'jovo-core';
import _merge = require('lodash.merge');

interface Config extends PluginConfig {

}

export class PlatformStorage implements Db {
    needsWriteFileAccess = false;

    config: Config = {};

    constructor(config?: Config) {
        if (config) {
            this.config = _merge(this.config, config);
        }
    }

    install(app: BaseApp): void {
        app.$db = this;
    }

    async load(primaryKey: string, jovo?: Jovo): Promise<any> {
        if (!jovo) {
            return Promise.resolve();
        }
        const request = jovo.$request as any;
        return request.user && request.user.storage ? {userData: request.user.storage} : {userData: {data: {}}};
    }

    async save(primaryKey: string, key: string, data: any, updatedAt?: string | undefined, jovo?: Jovo): Promise<any> {
        if (!jovo) {
            return Promise.resolve();
        }
        const request = jovo.$request as any;

        const userData = request.user!.storage.userData;
        Object.assign(userData, data);

        (jovo.$response as any).user = {
            storage: {
                userData
            }
        };
        return Promise.resolve();
    }

    async delete(primaryKey: string, jovo?: Jovo): Promise<any> {
        if (!jovo) {
            return Promise.resolve();
        }

        (jovo.$response as any).user = {
            storage: {
                userData: {}
            }
        };
        return Promise.resolve();
    }
}
