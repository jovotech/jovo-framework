'use strict';
const _ = require('lodash');

const ERR_MAIN_KEY_NOT_FOUND = 'ERR_MAIN_KEY_NOT_FOUND';
const ERR_DATA_KEY_NOT_FOUND = 'ERR_DATA_KEY_NOT_FOUND';

/**
 * GCloud Datastore integration.
 * Currently only supports projectId and apiEndpoint as config parameter,
 * the rest hsould be handled by ENV variables.
 */
class DatastoreDb {
    /**
     * constructor
     * @param {*} config
     */
    constructor(config) {
        try {
            this.Datastore = require('@google-cloud/datastore');
        } catch (err) {
          throw Error('Please install the Google Cloud Datastore package: npm install @google-cloud/datastore');
        }
        let dbConfig = {};
        if (config.projectId) dbConfig.projectId = config.projectId;
        if (config.apiEndpoint) dbConfig.apiEndpoint = config.apiEndpoint;

        this.datastore = new this.Datastore(dbConfig);

        // use this as entity name in the database
        this.entity = 'JovoUser';
    }
    /**
     * Sets mainkey (userId). All database access always has this mainKey as the primary namespace.
     *
     * @param {string} mainKey
     * @return {DatastoreDb}
     */
    setMainKey(mainKey) {
        this.mainKey = mainKey;
        return this;
    }

    /**
     * Saves a single value in the database in a separate "data" namespace (i.e. {mainKey}.data)
     *
     * @param {string} key
     * @param {object|string} value
     * @param {function} callback
     */
    save(key, value, callback) {
      this.saveFullObject('data.' + key, value, callback);
    }

    /**
     * Gets value from the database from the separate "data" namespace (i.e. {mainKey}.data)
     *
     * @param {string} key
     * @param {function} callback
     */
    load(key, callback) {
      this.loadObject(function(err, entity) {
        if (err) {
          callback(err, entity);
          return;
        }
        callback(undefined, entity.data[key]);
      });
    }

    /**
     * Saves a object in the main namespace (i.e. {mainKey}.{key})
     *
     * @param {string} key
     * @param {object} value
     * @param {function} callback
     */
    saveFullObject(key, value, callback) {
      let entityKey = this.datastore.key([this.entity, this.mainKey]);

      let that = this;
      this.datastore.get(entityKey).then(function(entities) {
        let entity = undefined;
        if (!entities || entities.length === 0 || entities[0] === undefined) {
          entity = {
            userId: that.mainKey,
          };
        } else {
          entity = entities[0];
        }


        // Don't confuse with the "data" key form the "save" method, actually this is
        // the data node necessary for datastore, whereas in the "save" method we add a second data
        // node for storing our own data.
        _.set(entity, 'data.' + key, value);

        let data = {
          key: entityKey,
          data: entity,
        };


        that.datastore.save(data).then(function() {
          callback(undefined, null);
        }, function(err) {
          callback(err, null);
        });
      }, function(err) {
        callback(err, null);
      });
    }

    /**
     * Saves whole row. Same as saveFullObject.
     *
     * @param {string} key
     * @param {object} newData
     * @param {function} callback
     */
    saveObject(key, newData, callback) {
      this.saveFullObject(key, newData, callback);
    }


    /**
     * Gets whole object from db with all namespaces (ie. lookup {mainKey})
     *
     * @param {function} callback
     */
    loadObject(callback) {
      let entityKey = this.datastore.key([this.entity, this.mainKey]);
      let that = this;

      this.datastore.get(entityKey).then(function(entities) {
        if (!entities || entities.length === 0) {
          callback(createError(ERR_MAIN_KEY_NOT_FOUND, that.mainKey), null);
          return;
        }
        let entity = entities[0];
        if (entity === undefined) {
          callback(createError(ERR_MAIN_KEY_NOT_FOUND, that.mainKey), null);
          return;
        }
        callback(undefined, (entity) ? entity.data : {});
      }, function(err) {
        callback(createError(ERR_MAIN_KEY_NOT_FOUND, that.mainKey), null);
      });
    }

    /**
     * Deletes all data of the user
     * @param {function} callback
     */
    deleteUser(callback) {
      let entityKey = this.datastore.key([this.entity, this.mainKey]);

      this.datastore.delete(entityKey).then(function() {
        callback(undefined, null);
      }, function(err) {
        callback(err, null);
      });
    }

    /**
     * Deletes data for that key in the "{mainKey}.data." namespace.
     * @param {string} key
     * @param {function} callback
     */
    deleteData(key, callback) {
      let entityKey = this.datastore.key([this.entity, this.mainKey]);

      let that = this;
      this.datastore.get(entityKey).then(function(entities) {
          let entity;
        if (!entities.length === 0) {
          entity = {};
        } else {
          entity = entities[0];
        }
        delete entity['data'][key];


        let data = {
          key: entityKey,
          data: value,
        };

        that.datastore.save(data).then(function() {
          callback(undefined, null);
        }, function(err) {
          callback(err, null);
        });
      }, function(err) {
        callback(err, null);
      });
    }

}

/**
 * Error Helper
 * @param {*} code
 * @param {*} mainKey
 * @param {*} key
 * @return {Error}
 */
function createError(code, mainKey, key) {
    let err = new Error((key) ? ('Data key "'+key+'" not found for main key "'+mainKey+'"') : ('Mainkey "'+mainKey+'" not found in database'));
    err.code = code;
    return err;
}

module.exports.DatastoreDb = DatastoreDb;
module.exports.DatastoreDb.ERR_MAIN_KEY_NOT_FOUND = ERR_MAIN_KEY_NOT_FOUND;
module.exports.DatastoreDb.ERR_DATA_KEY_NOT_FOUND = ERR_DATA_KEY_NOT_FOUND;
