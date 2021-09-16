import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { resolve as resolvePaths, join as joinPaths } from 'path';
import { DbItem, DbPlugin, DbPluginConfig, Jovo, JovoResponse } from '..';
import { HandleRequest } from '../HandleRequest';

export interface FileDbConfig extends DbPluginConfig {
  dbDirectory: string;
  deleteDbOnSessionEnded?: boolean;
}

export class TestDb extends DbPlugin<FileDbConfig> {
  get dbDirectory(): string {
    return resolvePaths(process.cwd(), 'dist', this.config.dbDirectory);
  }

  getDefaultConfig(): FileDbConfig {
    return {
      ...super.getDefaultConfig(),
      dbDirectory: '../db/tests',
    };
  }

  async mount(handleRequest: HandleRequest): Promise<void> {
    handleRequest.middlewareCollection.use('request.end', this.loadData.bind(this));
    handleRequest.middlewareCollection.use('response.start', this.saveData.bind(this));
    handleRequest.middlewareCollection.use('after.response.end', this.clearData.bind(this));
  }

  initialize(): void {
    if (!existsSync(this.dbDirectory)) {
      mkdirSync(this.dbDirectory, { recursive: true });
    }
  }

  getDbItems(primaryKey: string): DbItem[] {
    if (!existsSync(this.getDbFilePath(primaryKey))) {
      return [];
    }

    const rawDbData: string = readFileSync(this.getDbFilePath(primaryKey), 'utf-8');
    const dbItems: DbItem[] = rawDbData.length ? JSON.parse(rawDbData) : [];
    return dbItems;
  }

  getDbItem(primaryKey: string): DbItem | undefined {
    const dbItems: DbItem[] = this.getDbItems(primaryKey);
    return dbItems.find((dbItem: DbItem) => dbItem.id === primaryKey);
  }

  async loadData(jovo: Jovo): Promise<void> {
    const dbItem: DbItem | undefined = this.getDbItem(jovo.$user.id);
    if (dbItem) {
      jovo.$user.isNew = false;
      jovo.setPersistableData(dbItem, this.config.storedElements);
    }
  }

  async saveData(jovo: Jovo): Promise<void> {
    const userId: string = jovo.$user.id;
    const dbItems: DbItem[] = this.getDbItems(userId);
    const dbItem: DbItem | undefined = dbItems.find((dbItem: DbItem) => dbItem.id === userId);

    // Create new user
    if (!dbItem) {
      const item: DbItem = {
        id: userId,
      };
      await this.applyPersistableData(jovo, item);
      dbItems.push(item);
    } else {
      // Update existing user
      await this.applyPersistableData(jovo, dbItem);
    }

    writeFileSync(this.getDbFilePath(userId), JSON.stringify(dbItems, null, 2));
  }

  async clearData(jovo: Jovo): Promise<void> {
    if (
      !this.config.deleteDbOnSessionEnded ||
      !existsSync(this.getDbFilePath(jovo.$user.id)) ||
      !jovo.$response
    ) {
      return;
    }

    const responses: JovoResponse[] = Array.isArray(jovo.$response)
      ? jovo.$response
      : [jovo.$response];

    for (const response of responses) {
      if (response.hasSessionEnded()) {
        unlinkSync(this.getDbFilePath(jovo.$user.id));
        return;
      }
    }
  }

  private getDbFilePath(primaryKey: string): string {
    return joinPaths(this.dbDirectory, `${primaryKey}.json`);
  }
}
