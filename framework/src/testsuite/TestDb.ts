import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve as resolvePaths, join as joinPaths } from 'path';
import { App, DbItem, DbPlugin, DbPluginConfig, Jovo } from '..';
import { HandleRequest } from '../HandleRequest';

export interface FileDbConfig extends DbPluginConfig {
  dbDirectory: string;
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

  private getDbFilePath(primaryKey: string): string {
    return joinPaths(this.dbDirectory, `${primaryKey}.json`);
  }
}
