import * as fs from 'fs';
import { BaseApp, JovoError } from 'jovo-core';
import _merge = require('lodash.merge');
import * as path from 'path';
import rimraf = require('rimraf'); // tslint:disable-line:no-implicit-dependencies

import { FileDb } from './../src/FileDb';

process.env.NODE_ENV = 'UNIT_TEST';

describe('test installation', () => {
  afterAll(() => {
    deleteDatabaseFolder('./../db/');
  });

  test('test should create db.json file on install with default config', () => {
    const filedb = new FileDb();
    const app = new BaseApp();
    filedb.install(app);

    const result = fs.existsSync(filedb.config.pathToFile!);

    expect(result).toBeTruthy();
  });

  test('should throw JovoError because pathToFile is falsy', () => {
    // it's validatePathToFile() that throws the error, but its a static function, which gets called by install()
    const filedb = new FileDb({
      pathToFile: '',
      primaryKeyColumn: 'userId',
    });
    const app = new BaseApp();
    expect(() => {
      filedb.install(app);
    }).toThrow(JovoError);
  });

  test('should throw JovoError if pathToFile is not a valid path string', () => {
    // it's validatePathToFile() that throws the error, but its a static function, which gets called by install()
    const filedb = new FileDb({
      pathToFile: '.#/db.json',
      primaryKeyColumn: 'userId',
    });
    const app = new BaseApp();
    expect(() => {
      filedb.install(app);
    }).toThrow(JovoError);
  });

  test('should throw JovoError if pathToFile is not json file', () => {
    // it's validatePathToFile() that throws the error, but its a static function, which gets called by install()
    const filedb = new FileDb({
      pathToFile: './../db.js',
      primaryKeyColumn: 'userId',
    });
    const app = new BaseApp();
    expect(() => {
      filedb.install(app);
    }).toThrow(JovoError);
  });
});

describe('test database operations', () => {
  /**
   * From now on tests will write/load/delete from database, which is the reason, we will reset the db before each test.
   * Reset state has an array containing one sample object (`existingObject`)
   */

  let filedb: FileDb;
  let app: BaseApp;

  const existingObject = {
    key: 'valueTest',
    userId: 'idTest',
  };

  function resetDatabase() {
    const data = [existingObject];
    const stringifiedData = JSON.stringify(data, null, '\t');
    fs.writeFileSync(filedb.config.pathToFile!, stringifiedData);
  }

  beforeAll(() => {
    filedb = new FileDb();
    app = new BaseApp();
    filedb.install(app);
    resetDatabase();
  });

  afterEach(() => {
    resetDatabase();
  });

  afterAll(() => {
    const folderPath = path.dirname(filedb.config.pathToFile!);
    deleteDatabaseFolder(folderPath);
  });

  describe('test save()', () => {
    test('test should save userData', async () => {
      const objectToBeSaved = {
        testKey: 'testValue',
        userId: 'testId',
      };

      await filedb.save(objectToBeSaved.userId, 'testKey', objectToBeSaved.testKey);

      // get object from db.json file
      const dataJson: any = fs.readFileSync(filedb.config.pathToFile!); // tslint:disable-line
      const dataArr = JSON.parse(dataJson);
      const userData = dataArr.find((o: any) => {
        // tslint:disable-line
        return o[filedb.config.primaryKeyColumn!] === objectToBeSaved.userId;
      });

      expect(userData).toEqual(objectToBeSaved);
    });

    test('test should add new key-value pair to existing userData without removing anything', async () => {
      await filedb.save(existingObject.userId, 'newKey', 'newValue');
      let modifiedObject = {
        newKey: 'newValue',
      };
      modifiedObject = _merge(modifiedObject, existingObject);

      // get object from db.json file
      const dataJson: any = fs.readFileSync(filedb.config.pathToFile!); // tslint:disable-line
      const dataArr = JSON.parse(dataJson);
      const userData = dataArr.find((o: any) => {
        // tslint:disable-line
        return o[filedb.config.primaryKeyColumn!] === existingObject.userId;
      });

      expect(userData).toEqual(modifiedObject);
    });

    test('test should add new object for new primaryKey (new user) and keep the existing data', async () => {
      const objectToBeSaved = {
        testKey: 'testValue',
        userId: 'testId',
      };

      await filedb.save(objectToBeSaved.userId, 'testKey', objectToBeSaved.testKey);

      // get object from db.json file
      const dataJson: any = fs.readFileSync(filedb.config.pathToFile!); // tslint:disable-line
      const dataArr = JSON.parse(dataJson);

      // existingObject still exists
      let userData = dataArr.find((o: any) => {
        // tslint:disable-line
        return o[filedb.config.primaryKeyColumn!] === existingObject.userId;
      });
      expect(userData).toEqual(existingObject);

      // objectToBeSaved also exists
      userData = dataArr.find((o: any) => {
        // tslint:disable-line
        return o[filedb.config.primaryKeyColumn!] === objectToBeSaved.userId;
      });
      expect(userData).toEqual(objectToBeSaved);
    });

    test(`test should override user's existing data for existing key`, async () => {
      await filedb.save(existingObject.userId, 'key', 'newValue'); // same user, new value for `key`

      // get object from db.json file
      const dataJson: any = fs.readFileSync(filedb.config.pathToFile!); // tslint:disable-line
      const dataArr = JSON.parse(dataJson);
      const userData = dataArr.find((o: any) => {
        // tslint:disable-line
        return o[filedb.config.primaryKeyColumn!] === existingObject.userId;
      });

      expect(userData.key).not.toEqual(existingObject.key);
    });
  });

  describe('test load()', () => {
    test('test should load data', async () => {
      const loadedObject = await filedb.load(existingObject.userId);

      expect(loadedObject).toEqual(existingObject);
    });

    test('test should return undefined if there is no data for that user', async () => {
      const loadedObject = await filedb.load('xyz');

      expect(loadedObject).toBeUndefined();
    });
  });

  describe('test delete()', () => {
    test('test should delete previously saved data', async () => {
      await filedb.delete(existingObject.userId);

      // get object from db.json file
      const dataJson: any = fs.readFileSync(filedb.config.pathToFile!); // tslint:disable-line
      const dataArr = JSON.parse(dataJson);
      const userData = dataArr.find((o: any) => {
        // tslint:disable-line
        return o[filedb.config.primaryKeyColumn!] === existingObject.userId;
      });

      expect(userData).toBeUndefined();
    });

    test(`test should not delete anything if primaryKey (user) doesn't exist`, async () => {
      await filedb.delete('xyz');

      // get object from db.json file
      const dataJson: any = fs.readFileSync(filedb.config.pathToFile!); // tslint:disable-line
      const dataArr = JSON.parse(dataJson);

      const existingArr = [existingObject];

      expect(dataArr).toEqual(existingArr);
    });
  });
});

function deleteDatabaseFolder(dirPath: string) {
  rimraf.sync(dirPath);
}
