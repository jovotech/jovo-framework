import { BaseApp, JovoError } from "jovo-core"
import { FileDb2 } from "./../src/FileDb2";
import * as fs from "fs";
import * as path from 'path';
import _merge = require('lodash.merge');

describe('test installation', () => {
    test('test should create db folder on install with default config', () => {
        const filedb2 = new FileDb2();
        const app = new BaseApp();
        filedb2.install(app);
        expect(fs.existsSync(filedb2.config.path!)).toBeTruthy();
    });

    test('test install should throw JovoError if path is empty string', () => {
        const filedb2 = new FileDb2({
            path: ''
        });
        const app = new BaseApp();
        expect(() => {
            filedb2.install(app)
        }).toThrow(Error);
    });

});

describe('test database operations', () => {
    /**
     * From now on tests will write/load/delete from database, which is the reason, we will reset the db before each test.
     * Reset state has an array containing one sample object (`existingObject`)
     */


    const filedb2 = new FileDb2();
    const app = new BaseApp();
    filedb2.install(app);

    const existingUserId = 'idTest';
    const existingObject = {
        key: 'valueTest'
    };

    async function resetDatabase() {
        const pathToFile = path.join(filedb2.config.path!, `${existingUserId}.json`);
        const data = existingObject;
        const stringifiedData = JSON.stringify(data, null, '\t');
        await fs.writeFileSync(pathToFile, stringifiedData);
    }

    beforeAll(async () => {
        await resetDatabase();
    });

    afterEach(async () => {
        await resetDatabase();
    });

    afterAll(() => {
        deleteDatabaseFolder(filedb2.config.path!);
    })

    describe('test save()', () => {
        test('test should save userData in ${userId}.json inside folder specified in path', async () => {
            const userId = 'testId';
            const objectToBeSaved = {
                testKey: 'testValue'
            };

            await filedb2.save(userId, 'testKey', objectToBeSaved.testKey);

            // get object from json file
            const pathToFile = path.join(filedb2.config.path!, `${userId}.json`);
            const dataJson: any = fs.readFileSync(pathToFile);
            const userData = JSON.parse(dataJson);

            expect(userData).toEqual(objectToBeSaved);
        });

        test('test should add new key-value pair to existing userData without removing anything', async () => {
            await filedb2.save(existingUserId, 'newKey', 'newValue');
            let modifiedObject = {
                newKey: 'newValue'
            };
            modifiedObject = _merge(modifiedObject, existingObject);

            // get object from db.json file
            const pathToFile = path.join(filedb2.config.path!, `${existingUserId}.json`);
            const dataJson: any = fs.readFileSync(pathToFile);
            const userData = JSON.parse(dataJson);

            expect(userData).toEqual(modifiedObject)
        });
    
        test('test should add new object for new primaryKey (new user) and keep the existing data', async () => {
            const newUserId = 'testId';
            const newObject = {
                testKey: 'testValue'
            };
    
            await filedb2.save(newUserId, 'testKey', newObject.testKey);

            // exisitingUserData still exists
            const pathToExistingData = path.join(filedb2.config.path!, `${existingUserId}.json`);
            const existingDataJson: any = fs.readFileSync(pathToExistingData);
            const existingUserData = JSON.parse(existingDataJson);
            expect(existingUserData).toEqual(existingObject);;
    
            // newUserData exists
            const pathToNewData = path.join(filedb2.config.path!, `${newUserId}.json`);
            const newDataJson: any = fs.readFileSync(pathToNewData);
            const newUserData = JSON.parse(newDataJson);
            expect(newUserData).toEqual(newObject);;
        });
    
        test('test should override user\'s existing data for existing key', async () => {
            await filedb2.save(existingUserId, 'key', 'newValue'); // same user, new value for `key`
    
            // get object from db.json file
            const pathToFile = path.join(filedb2.config.path!, `${existingUserId}.json`);
            const dataJson: any = fs.readFileSync(pathToFile);
            const userData = JSON.parse(dataJson);
    
            expect(userData.key).not.toEqual(existingObject.key);
        });
    });
    
    describe('test load()', async () => {
        test('test should load data', async () => {
            const loadedObject = await filedb2.load(existingUserId);
    
            expect(loadedObject).toEqual(existingObject);
        });
    
        test.skip('test should return undefined if there is no data for that user', async () => {
            // TODO FileDb2.load() returns empty array if there is no data for that user. FileDb returns undefined --> inconsistent
            // FileDb2 should return undefined as well, then this test will run
            const loadedObject = await filedb2.load('xyz');
    
            expect(loadedObject).toBeUndefined();
        });
    });
    
    describe.skip('test delete()', () => {
        // TODO FileDb2.delete() is not implemented yet
        test('test should delete previously saved data', async () => {
            await filedb2.delete(existingUserId);
    
            // get object from db.json file
            const pathToFile = path.join(filedb2.config.path!, `${existingUserId}.json`);
            const dataJson: any = fs.readFileSync(pathToFile);
            const userData = JSON.parse(dataJson);
    
            expect(userData).toBeUndefined();
        });
    
        test('test should not delete anything if primaryKey (user) doesn\'t exist', async () => {
            await filedb2.delete('xyz');
    
            // get object from db.json file
            const pathToFile = path.join(filedb2.config.path!, `${existingUserId}.json`);
            const dataJson: any = fs.readFileSync(pathToFile);
            const userData = JSON.parse(dataJson);
    
            expect(userData).toEqual(existingObject);
        })
    });
});

function deleteDatabaseFolder(dirPath: string) {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach(function (entry) {
            var entryPath = path.join(dirPath, entry);
            if (fs.lstatSync(entryPath).isDirectory()) {
                deleteDatabaseFolder(entryPath);
            } else {
                fs.unlinkSync(entryPath);
            }
        });
        fs.rmdirSync(dirPath);
    }
}
