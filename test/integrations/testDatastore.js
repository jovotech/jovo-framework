'use strict';
/** *********************************
* You have to run the local datastore simulator for this to work!
***************************************/

/* var assert = require('chai').assert;
var uuid = require('uuid/v4');
var DatastoreDb = require('../../lib/integrations/db/datastore.js').DatastoreDb;
*/

/**
* Some settings
*/
// let config = {
//   apiEndpoint: 'localhost:8081',
//   projectId: 'testprojekt',
// };

describe('Datastore jovo Connector', function() {
/*  var originalValue = uuid();
  var datastore = new DatastoreDb(config);
  var filestore = new FilePersistance("./test_db.json");
  datastore.setMainKey("user1");
*/
  it.skip('should save a value', function(done) {
      datastore.save('test', originalValue, function(err, data) {
        assert.equal(err, undefined);
        done();
      });
  });

  it.skip('should load the same value', function(done) {
      datastore.load('test', function(err, v) {
        assert.equal(v, originalValue, 'the saved value should be the same as the loaded value');
        done();
      });
  });

  it.skip('should save a object with a special key', function(done) {
      datastore.saveFullObject('userData', ['test'], function(err, v) {
        assert.equal(err, undefined);
        done();
      });
  });
});
