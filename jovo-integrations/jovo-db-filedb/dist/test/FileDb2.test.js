"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
const path = require("path");
const rimraf = require("rimraf"); // tslint:disable-line:no-implicit-dependencies
const FileDb2_1 = require("./../src/FileDb2");
process.env.NODE_ENV = 'UNIT_TEST';
describe('test installation', () => {
    afterAll(() => {
        deleteDatabaseFolder('./db/');
    });
    test('test should create db folder on install with default config', () => {
        const filedb2 = new FileDb2_1.FileDb2({
            path: './db/',
        });
        const app = new jovo_core_1.BaseApp();
        filedb2.install(app);
        expect(fs.existsSync(filedb2.config.path)).toBeTruthy();
    });
    test('test install should throw JovoError if path is empty string', () => {
        const filedb2 = new FileDb2_1.FileDb2({
            path: '',
        });
        const app = new jovo_core_1.BaseApp();
        expect(() => {
            filedb2.install(app);
        }).toThrow(jovo_core_1.JovoError);
    });
});
describe('test database operations', () => {
    /**
     * From now on tests will write/load/delete from database, which is the reason, we will reset the db before each test.
     * Reset state has an array containing one sample object (`existingObject`)
     */
    let filedb2;
    let app;
    const existingUserId = 'idTest';
    const existingObject = {
        key: 'valueTest',
    };
    function resetDatabase() {
        const pathToFile = path.join(filedb2.config.path, `${existingUserId}.json`);
        const stringifiedData = JSON.stringify(existingObject, null, '\t');
        fs.writeFileSync(pathToFile, stringifiedData);
    }
    beforeAll(() => {
        filedb2 = new FileDb2_1.FileDb2({
            path: './db/',
        });
        app = new jovo_core_1.BaseApp();
        filedb2.install(app);
        resetDatabase();
    });
    afterEach(() => {
        resetDatabase();
    });
    afterAll(() => {
        deleteDatabaseFolder('./db/');
    });
    describe('test save()', () => {
        test(`test should save userData in 'userId.json' inside folder specified in path`, async () => {
            const userId = 'testId';
            const objectToBeSaved = {
                testKey: 'testValue',
            };
            await filedb2.save(userId, 'testKey', objectToBeSaved.testKey);
            // get object from json file
            const pathToFile = path.join(filedb2.config.path, `${userId}.json`);
            const dataJson = fs.readFileSync(pathToFile); // tslint:disable-line
            const userData = JSON.parse(dataJson);
            expect(userData).toEqual(objectToBeSaved);
        });
        test('test should add new key-value pair to existing userData without removing anything', async () => {
            await filedb2.save(existingUserId, 'newKey', 'newValue');
            let modifiedObject = {
                newKey: 'newValue',
            };
            modifiedObject = _merge(modifiedObject, existingObject);
            // get object from db.json file
            const pathToFile = path.join(filedb2.config.path, `${existingUserId}.json`);
            const dataJson = fs.readFileSync(pathToFile); // tslint:disable-line
            const userData = JSON.parse(dataJson);
            expect(userData).toEqual(modifiedObject);
        });
        test('test should add new object for new primaryKey (new user) and keep the existing data', async () => {
            const newUserId = 'testId';
            const newObject = {
                testKey: 'testValue',
            };
            await filedb2.save(newUserId, 'testKey', newObject.testKey);
            // existingUserData still exists
            const pathToExistingData = path.join(filedb2.config.path, `${existingUserId}.json`);
            const existingDataJson = fs.readFileSync(pathToExistingData); // tslint:disable-line
            const existingUserData = JSON.parse(existingDataJson);
            expect(existingUserData).toEqual(existingObject);
            // newUserData exists
            const pathToNewData = path.join(filedb2.config.path, `${newUserId}.json`);
            const newDataJson = fs.readFileSync(pathToNewData); // tslint:disable-line
            const newUserData = JSON.parse(newDataJson);
            expect(newUserData).toEqual(newObject);
        });
        test(`test should override user's existing data for existing key`, async () => {
            await filedb2.save(existingUserId, 'key', 'newValue'); // same user, new value for `key`
            // get object from db.json file
            const pathToFile = path.join(filedb2.config.path, `${existingUserId}.json`);
            const dataJson = fs.readFileSync(pathToFile); // tslint:disable-line
            const userData = JSON.parse(dataJson);
            expect(userData.key).not.toEqual(existingObject.key);
        });
    });
    describe('test load()', () => {
        test('test should load data', async () => {
            const loadedObject = await filedb2.load(existingUserId);
            expect(loadedObject).toEqual(existingObject);
        });
        test('test should return undefined because there is no data for that user', async () => {
            const loadedObject = await filedb2.load('xyz');
            expect(loadedObject).toBeUndefined();
        });
    });
    describe('test delete()', () => {
        test('test should delete previously saved data', async () => {
            await filedb2.delete(existingUserId);
            // get object from db.json file
            const pathToFile = path.join(filedb2.config.path, `${existingUserId}.json`);
            expect(() => {
                fs.readFileSync(pathToFile);
            }).toThrowError('ENOENT: no such file or directory');
        });
        test('test should throw ENOENT error because there is no file for that user, i.e. no user data exists', async () => {
            await filedb2.delete('xyz').catch((e) => {
                expect(e.code).toBe('ENOENT');
            });
        });
    });
});
function deleteDatabaseFolder(dirPath) {
    rimraf.sync(dirPath);
}
//# sourceMappingURL=FileDb2.test.js.map