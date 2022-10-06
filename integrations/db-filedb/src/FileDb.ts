import { DbItem, DbPlugin, DbPluginConfig, DeepPartial, Jovo } from '@jovotech/framework';
import fs from 'fs';
import path from 'path';
import process from 'process';

export interface FileDbConfig extends DbPluginConfig {
  pathToFile: string;
  primaryKeyColumn?: string;
}

export type FileDbInitConfig = DeepPartial<FileDbConfig>;

export class FileDb extends DbPlugin<FileDbConfig> {
  constructor(config?: FileDbInitConfig) {
    super(config);
  }

  getDefaultConfig(): FileDbConfig {
    return {
      ...super.getDefaultConfig(),
      skipTests: true,
      pathToFile: '../db/db.json',
    };
  }

  get pathToFile(): string {
    if (path.isAbsolute(this.config.pathToFile)) {
      return this.config.pathToFile;
    }
    // Make sure the pathToFile is applied relative to the dist-dir
    return path.join(process.cwd(), 'dist', this.config.pathToFile);
  }

  async initialize(): Promise<void> {
    const pathToFileDir = path.dirname(this.pathToFile);

    const pathExists = async (pathToFile: string) =>
      !!(await fs.promises.stat(pathToFile).catch(() => false));

    if (!(await pathExists(pathToFileDir))) {
      await fs.promises.mkdir(pathToFileDir, { recursive: true });
    }

    if (!(await pathExists(this.pathToFile))) {
      await fs.promises.writeFile(this.pathToFile, '[]');
    }
  }

  async getDbItem(primaryKey: string): Promise<DbItem> {
    const fileDataStr = await fs.promises.readFile(this.pathToFile, 'utf8');
    const users = fileDataStr.length > 0 ? JSON.parse(fileDataStr) : [];

    return users.find((userItem: DbItem) => {
      return userItem.id === primaryKey;
    });
  }

  async loadData(userId: string, jovo: Jovo): Promise<void> {
    const dbItem = await this.getDbItem(userId);
    if (dbItem) {
      jovo.$user.isNew = false;
      jovo.setPersistableData(dbItem, this.config.storedElements);
    }
  }

  async saveData(userId: string, jovo: Jovo): Promise<void> {
    const fileDataStr = await fs.promises.readFile(this.pathToFile, 'utf8');
    const users = fileDataStr.length > 0 ? JSON.parse(fileDataStr) : [];

    const dbItem = users.find((userItem: DbItem) => {
      return userItem.id === userId;
    });

    // // create new user
    if (!dbItem) {
      const item: DbItem = {
        id: userId,
      };
      await this.applyPersistableData(jovo, item);
      users.push(item);
    } else {
      // update existing user
      for (let i = 0; i < users.length; i++) {
        if (users[i].id === userId) {
          await this.applyPersistableData(jovo, users[i]);
        }
      }
    }
    return fs.promises.writeFile(this.pathToFile, JSON.stringify(users, null, 2));
  }
}
