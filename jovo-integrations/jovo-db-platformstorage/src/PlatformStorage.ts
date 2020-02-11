import { BaseApp, Db, Jovo, PluginConfig } from 'jovo-core';
import _merge = require('lodash.merge');

export interface Config extends PluginConfig {}

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

  // tslint:disable-next-line:no-any
  async load(primaryKey: string, jovo?: Jovo): Promise<any> {
    if (!jovo) {
      return;
    }

    // tslint:disable-next-line:no-any
    const request = jovo.$request as any;
    return request.user && request.user.storage
      ? { userData: request.user.storage }
      : { userData: { data: {} } };
  }

  async save(
    primaryKey: string,
    key: string,
    data: any, // tslint:disable-line:no-any
    updatedAt?: string | undefined,
    jovo?: Jovo,
  ): Promise<void> {
    if (!jovo) {
      return;
    }

    // tslint:disable-next-line:no-any
    const request = jovo.$request as any;
    const userData = request.user!.storage.userData;
    Object.assign(userData, data);

    // tslint:disable-next-line:no-any
    (jovo.$response as any).user = {
      storage: {
        userData,
      },
    };
    return;
  }

  async delete(primaryKey: string, jovo?: Jovo): Promise<void> {
    if (!jovo) {
      return;
    }

    // tslint:disable-next-line:no-any
    (jovo.$response as any).user = {
      storage: {
        userData: {},
      },
    };
    return;
  }
}
