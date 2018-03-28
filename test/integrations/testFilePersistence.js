'use strict';
let assert = require('chai').assert;
const FilePersistence = require('../../lib/integrations/db/filePersistenceV2').FilePersistence;

const fs = require('fs');

let testFileContent = '[ { "userId": "testID", "data": { "foo": "bar" } } ]';
let testFileContentEmpty = '[ { "userId": "testID", "data": {  } } ]';


describe('FilePersistence Class', function() {
    describe('constructor', function() {
        it('should throw error Filename not valid', function() {
            assert.throws(
                function() {
                    new FilePersistence('$asd');
                },
                Error,
                'Filename not valid'
            );
        });

        it('should set filename', function() {
            let fp = new FilePersistence('mydb');
            assert(fp.filename === './db/mydb.json', 'filename set correctly');
            fp = new FilePersistence('./tmp/mydb');
            assert(fp.filename === './tmp/mydb.json', 'filename set correctly');
        });
    });

    describe('save', function() {
        it('should create a file if none existing', function(done) {
            this.timeout(1000);
            let filename = './db/testdb.json';

            let fp = new FilePersistence('testdb');
            fp.setMainKey('testID');
            fp.save('foo', 'bar', function(err) {
               assert(fs.existsSync(filename) === true, 'File does not exist');
               fs.unlinkSync(filename);
               done();
            });
        });

        //
        it('should save file with new data', function(done) {
            this.timeout(1000);
            let filename = './db/testdb4.json';

            let fp = new FilePersistence('testdb4');
            fp.setMainKey('testID');
            fp.save('foo', 'bar', function(err) {
                fs.readFile(filename, 'utf8', function(err, data) {
                    if (!err) {
                        let fileObj = data.length > 0 ? JSON.parse(data) : {};
                        assert.ok(data.length > 0);
                        assert.ok(fileObj[0]['userId']);
                        assert.ok(fileObj[0]['data']['foo']);
                        assert.ok(fileObj[0]['data']['foo'] === 'bar');
                        fs.unlinkSync(filename);
                        done();
                    }
                });
            });
        });

        it('should save file overwriting old data with new data', function(done) {
            this.timeout(1000);
            let filename = './db/testdb5.json';
            fs.writeFileSync(filename, testFileContent);

            let existingData = fs.readFileSync(filename, 'utf8');
            assert.ok(JSON.parse(existingData)[0]['data']['foo'] === 'bar');

            let fp = new FilePersistence('testdb5');
            fp.setMainKey('testID');
            fp.save('foo', 'barbarbar', function(err) {
                fs.readFile(filename, 'utf8', function(err, data) {
                    if (!err) {
                        let fileObj = data.length > 0 ? JSON.parse(data) : {};
                        assert.ok(fileObj[0]['data']['foo'] === 'barbarbar');
                        fs.unlinkSync(filename);
                        done();
                    }
                });
            });
        });

        it('should save file with additional data', function(done) {
            this.timeout(1000);
            let filename = './db/testdb6.json';
            fs.writeFileSync(filename, testFileContent);

            let fp = new FilePersistence('testdb6');
            fp.setMainKey('testID');
            fp.save('hello', 'world', function(err) {
                fs.readFile(filename, 'utf8', function(err, data) {
                    if (!err) {
                        let fileObj = data.length > 0 ? JSON.parse(data) : {};
                        assert.ok(fileObj[0]['data']['foo'] === 'bar');
                        assert.ok(fileObj[0]['data']['hello'] === 'world');
                        fs.unlinkSync(filename);
                        done();
                    }
                });
            });
        });
    });

    describe('load', function() {
        it('should load a file without main key', function(done) {
            let filename = './db/testdb2.json';
            fs.writeFileSync(filename, '[]');
            let fp = new FilePersistence('testdb2');
            fp.setMainKey('testID');
            fp.load('testKey', function(err, data) {
                assert(err.code === FilePersistence.ERR_MAIN_KEY_NOT_FOUND, 'Main key not found');
                fs.unlinkSync(filename);
                done();
            });
        });
        it('should load a file without data key', function(done) {
            let filename = './db/testdb3.json';
            fs.writeFileSync(filename, testFileContentEmpty);
            let fp = new FilePersistence('testdb3');
            fp.setMainKey('testID');
            fp.load('testKey', function(err, data) {
                assert(err.code === FilePersistence.ERR_DATA_KEY_NOT_FOUND, 'Data key not found');
                fs.unlinkSync(filename);
                done();
            });
        });

        it('should load a file and read data for given key', function(done) {
            let filename = './db/testdb4.json';
            fs.writeFileSync(filename, testFileContent);
            let fp = new FilePersistence('testdb4');
            fp.setMainKey('testID');
            fp.load('foo', function(err, data) {
                assert(data === 'bar', 'data was wrong');
                fs.unlinkSync(filename);
                done();
            });
        });
    });

    describe('deleteUser', function() {
        it('should return error if file does not exist', function(done) {
            let fp = new FilePersistence('testdb8');
            fp.setMainKey('testID');
            fp.deleteUser(function(err, deleted) {
                assert(err.code === 'ENOENT', 'file exists');
                done();
            });
        });
        it('should return error if user does not exist', function(done) {
            let filename = './db/testdb7.json';
            fs.writeFileSync(filename, testFileContent);
            let fp = new FilePersistence('testdb7');
            fp.setMainKey('testID2');
            fp.deleteUser( function(err, deleted) {
                assert(err.code === FilePersistence.ERR_MAIN_KEY_NOT_FOUND, 'Main key not found');
                fs.unlinkSync(filename);
                done();
            });
        });
        it('should return remove all user data', function(done) {
            let filename = './db/testdb9.json';
            fs.writeFileSync(filename, testFileContent);
            let existingData = fs.readFileSync(filename, 'utf8');
            assert.ok(JSON.parse(existingData)[0]['data']['foo'] === 'bar');
            let fp = new FilePersistence('testdb9');
            fp.setMainKey('testID');
            fp.deleteUser(function(err, deleted) {
                assert.ok(deleted);
                fs.unlinkSync(filename);
                done();
            });
        });
    });

    describe('deleteData', function() {
        it('should return error if file does not exist', function(done) {
            let fp = new FilePersistence('testdb10');
            fp.setMainKey('testID');
            fp.deleteData('foo', function(err, deleted) {
                assert(err.code === 'ENOENT', 'file exists');
                done();
            });
        });
        it('should return error if user does not exist', function(done) {
            let filename = './db/testdb11.json';
            fs.writeFileSync(filename, testFileContent);
            let fp = new FilePersistence('testdb11');
            fp.setMainKey('testID2');
            fp.deleteData('foo', function(err, deleted) {
                assert(err.code === FilePersistence.ERR_MAIN_KEY_NOT_FOUND, 'Main key not found');
                fs.unlinkSync(filename);
                done();
            });
        });
        it('should return error if key does not exist', function(done) {
            let filename = './db/testdb12.json';
            fs.writeFileSync(filename, testFileContent);
            let fp = new FilePersistence('testdb12');
            fp.setMainKey('testID');
            fp.deleteData('foofoofoo', function(err, deleted) {
                assert(err.code === FilePersistence.ERR_DATA_KEY_NOT_FOUND, 'key found');
                fs.unlinkSync(filename);
                done();
            });
        });
        it('should return remove data for given key', function(done) {
            let filename = './db/testdb13.json';
            fs.writeFileSync(filename, testFileContent);
            let existingData = fs.readFileSync(filename, 'utf8');
            assert.ok(JSON.parse(existingData)[0]['data']['foo'] === 'bar');
            let fp = new FilePersistence('testdb13');
            fp.setMainKey('testID');
            fp.deleteData('foo', function(err, deleted) {
                assert.ok(deleted);
                fs.unlinkSync(filename);
                done();
            });
        });
    });
});
