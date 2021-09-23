import { afterAll, afterEach } from '@jest/globals';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join as joinPaths, resolve as resolvePaths } from 'path';
import { DbItem, DbPlugin, DbPluginConfig, Jovo } from '..';

export interface FileDbConfig extends DbPluginConfig {
  directory: string;
  deleteAfterEach: boolean;
  deleteAfterAll: boolean;
}

export class TestDb extends DbPlugin<FileDbConfig> {
  get dbDirectory(): string {
    return resolvePaths(process.cwd(), 'dist', this.config.directory);
  }

  get dbPath(): string {
    return joinPaths(this.dbDirectory, 'db.json');
  }

  getDefaultConfig(): FileDbConfig {
    return {
      ...super.getDefaultConfig(),
      deleteAfterEach: true,
      deleteAfterAll: true,
    };
  }

  install(): void {
    if (this.config.deleteAfterEach) {
      afterEach(this.clearData.bind(this));
    }

    if (this.config.deleteAfterAll) {
      afterAll(this.clearData.bind(this));
    }
  }

  initialize(): void {
    if (!existsSync(this.dbDirectory)) {
      mkdirSync(this.dbDirectory, { recursive: true });
    }
  }

  getDbItems(): DbItem[] {
    if (!existsSync(this.dbPath)) {
      return [];
    }

    const rawDbData: string = readFileSync(this.dbPath, 'utf-8');
    const dbItems: DbItem[] = rawDbData.length ? JSON.parse(rawDbData) : [];
    return dbItems;
  }

  getDbItem(primaryKey: string): DbItem | undefined {
    const dbItems: DbItem[] = this.getDbItems();
    return dbItems.find((dbItem: DbItem) => dbItem.id === primaryKey);
  }

  async loadData(userId: string, jovo: Jovo): Promise<void> {
    const dbItem: DbItem | undefined = this.getDbItem(userId);
    if (dbItem) {
      jovo.$user.isNew = false;
      jovo.setPersistableData(dbItem, this.config.storedElements);
    }
  }

  async saveData(userId: string, jovo: Jovo): Promise<void> {
    const dbItems: DbItem[] = this.getDbItems();
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

    writeFileSync(this.dbPath, JSON.stringify(dbItems, null, 2));
  }

  clearData(): void {
    if (!existsSync(this.dbPath)) {
      return;
    }

    unlinkSync(this.dbPath);
  }
}
