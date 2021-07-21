import { App, DbItem, DbPlugin, DbPluginConfig, HandleRequest, Jovo } from '@jovotech/framework';
import fs from 'fs';
import path from 'path';
import process from 'process';

export interface FileDbConfig extends DbPluginConfig {
  pathToFile: string;
  primaryKeyColumn?: string;
}

export class FileDb extends DbPlugin<FileDbConfig> {
  constructor(config?: FileDbConfig) {
    super(config);
  }

  getDefaultConfig(): FileDbConfig {
    return {
      ...super.getDefaultConfig(),
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

  async install(parent: App): Promise<void> {
    parent.middlewareCollection.use('after.request', this.loadData);
    parent.middlewareCollection.use('before.response', this.saveData);
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

  getDbItem = async (primaryKey: string): Promise<DbItem> => {
    const fileDataStr = await fs.promises.readFile(this.pathToFile, 'utf8');
    const users = fileDataStr.length > 0 ? JSON.parse(fileDataStr) : [];

    return users.find((userItem: DbItem) => {
      return userItem.id === primaryKey;
    });
  };

  loadData = async (handleRequest: HandleRequest, jovo: Jovo): Promise<void> => {
    const dbItem = await this.getDbItem(jovo.$user.id);
    if (dbItem) {
      jovo.$user.isNew = false;
      jovo.setPersistableData(dbItem, this.config.storedElements);
    }
  };

  saveData = async (handleRequest: HandleRequest, jovo: Jovo): Promise<void> => {
    const fileDataStr = await fs.promises.readFile(this.pathToFile, 'utf8');
    const users = fileDataStr.length > 0 ? JSON.parse(fileDataStr) : [];
    const id = jovo.$user.id;

    const dbItem = users.find((userItem: DbItem) => {
      return userItem.id === id;
    });

    // // create new user
    if (!dbItem) {
      const item: DbItem = {
        id,
      };
      await this.applyPersistableData(jovo, item);
      users.push(item);
    } else {
      // update existing user
      for (let i = 0; i < users.length; i++) {
        if (users[i].id === id) {
          await this.applyPersistableData(jovo, users[i]);
        }
      }
    }
    return fs.promises.writeFile(this.pathToFile, JSON.stringify(users, null, 2));
  };
}
