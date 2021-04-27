import {
  Plugin,
  App,
  HandleRequest,
  Jovo,
  DbPluginConfig,
  PersistableUserData,
  PersistableSessionData,
} from '@jovotech/framework';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

export interface FileDbConfig extends DbPluginConfig {
  pathToFile: string;
  primaryKeyColumn?: string;
}

export interface FileDbItem {
  id: string;
  user?: PersistableUserData;
  session?: PersistableSessionData;
  createdAt?: string;
  updatedAt?: string;
}

export class FileDb extends Plugin<FileDbConfig> {
  getDefaultConfig(): FileDbConfig {
    return {
      pathToFile: './db/db.json',
      storedElements: {
        $user: {
          enabled: true,
        },
        $session: {
          enabled: false,
        },
      },
    };
  }

  get pathToFile(): string {
    return path.join(process.cwd(), this.config.pathToFile);
  }

  async install(parent: App): Promise<void> {
    const pathToFileDir = path.dirname(this.pathToFile);

    const pathExists = async (pathToFile: string) =>
      !!(await fs.promises.stat(pathToFile).catch((e) => false));

    if (!(await pathExists(pathToFileDir))) {
      await fs.promises.mkdir(path.dirname(this.config.pathToFile), { recursive: true });
    }

    if (!(await pathExists(this.pathToFile))) {
      await fs.promises.writeFile(this.pathToFile, '[]');
    }

    parent.middlewareCollection.use('after.request', this.loadData);
    parent.middlewareCollection.use('before.response', this.saveData);
  }

  getDbItem = async (primaryKey: string): Promise<FileDbItem> => {
    const fileDataStr = await fs.promises.readFile(this.pathToFile, 'utf8');
    const users = fileDataStr.length > 0 ? JSON.parse(fileDataStr) : [];

    return users.find((userItem: FileDbItem) => {
      return userItem['id'] === primaryKey;
    });
  };

  loadData = async (handleRequest: HandleRequest, jovo: Jovo): Promise<void> => {
    const dbItem = await this.getDbItem(jovo.$user.id);

    if (this.config.storedElements.$user?.enabled && dbItem?.user) {
      jovo.$user.setPersistableData(dbItem?.user || { ...jovo.$user.defaultPersistableData });
    }

    if (this.config.storedElements.$session?.enabled && dbItem?.session) {
      jovo.$session.setPersistableData(
        dbItem?.session || { ...jovo.$session.defaultPersistableData },
      );
    }
  };

  saveData = async (handleRequest: HandleRequest, jovo: Jovo): Promise<void> => {
    const fileDataStr = await fs.promises.readFile(this.pathToFile, 'utf8');
    const users = fileDataStr.length > 0 ? JSON.parse(fileDataStr) : [];
    const id = jovo.$user.id;

    const dbItem = users.find((userItem: FileDbItem) => {
      return userItem['id'] === id;
    });

    // create new user
    if (!dbItem) {
      const item: FileDbItem = {
        id,
        user: this.config.storedElements.$user?.enabled
          ? { ...jovo.$user.getPersistableData(), updatedAt: new Date() }
          : undefined,

        session: this.config.storedElements.$session?.enabled
          ? { ...jovo.$session.getPersistableData() }
          : undefined,
      };
      users.push(item);
    } else {
      // update existing user
      for (let i = 0; i < users.length; i++) {
        if (users[i].id === id) {
          if (this.config.storedElements.$user?.enabled) {
            users[i]['user'] = { ...jovo.$user.getPersistableData(), updatedAt: new Date() };
          }
          if (this.config.storedElements.$session?.enabled) {
            users[i]['session'] = { ...jovo.$session.getPersistableData() };
          }
        }
      }
    }

    await fs.promises.writeFile(this.pathToFile, JSON.stringify(users, null, 2));
  };
}
