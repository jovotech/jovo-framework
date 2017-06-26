let assert = require('chai').assert;
const FilePersistence = require('../../lib/integrations/db/filePersistence').FilePersistence;
const Db = require('../../lib/integrations/db/db').Db;

const fs = require('fs');
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
        });

    });

    describe('save', function() {
        it.skip('should create a folder if none existing', function() {

        });

        it('should create a file if none existing', function() {
            let filename = './db/testdb.json';
            // assert(fs.existsSync(filename) === false, 'File does not exist');


            // let fp = new FilePersistence('testdb');
            // fp.setMainKey('testID');
            // fp.save('testkey', {bla: 'bla'}, function(err) {
            //     // assert(fs.existsSync(filename) === true, 'File exists');
            //     console.log('sdadasadasd')
            //     console.log(fs.existsSync(filename));
            //     // fs.unlinkSync(filename);
            //     console.log(fs.existsSync(filename));
            // });
        });

        it.skip('should read an empty file and parse data', function() {

        });

        it.skip('should read a file with data and parse it', function() {

        });

        it.skip('should save file with new data', function() {

        });

        it.skip('should save file overwriting new data', function() {

        });
    });

    describe('load', function() {
        it.skip('should return empty data if file does not exist', function() {

        });

        it.skip('should read file', function() {

        });

        it.skip('should read file with no data', function() {

        });

        it.skip('should read file with data', function() {

        });

        it.skip('should read file with data, but not for that specific user', function() {

        });
    });

    describe('deleteUser', function() {
        it.skip('should return empty data if file does not exist', function() {

        });

        it.skip('should read file', function() {

        });

        it.skip('should read file with no data', function() {

        });

        it.skip('should read file with data', function() {

        });

        it.skip('should read file with data, but not for that specific user', function() {

        });

        it.skip('should delete specific user', function() {

        });
    });

    describe('deleteData', function() {
        it.skip('should return empty data if file does not exist', function() {

        });

        it.skip('should read file', function() {

        });

        it.skip('should read file with no data', function() {

        });

        it.skip('should read file with data', function() {

        });

        it.skip('should read file with data, but not for that specific user', function() {

        });

        it.skip('should delete specific user data', function() {

        });
    });
});
