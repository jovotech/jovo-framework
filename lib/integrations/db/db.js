'use strict';

const _ = require('lodash');

// Database implementation
const FilePersistence = require('./filePersistenceV2').FilePersistence;
const DynamoDb = require('./dynamoDb').DynamoDb;
const DatastoreDb = require('./datastore').DatastoreDb;

/**
 * DB Wrapper class
 */
class Db {
    /**
     * Constructor
     * @param {string} name name of database
     * @param {*} implementation Database implementation
     */
    constructor(name, implementation) {
        this.databaseInstances = {};

        if (name && implementation) {
          this.databaseInstances[name] = implementation;
        }
    }

    /**
     * Selects database by name
     * @param {string} mainKey
     * @param {string} name
     * @return {*}
     */
    use(mainKey, name) {
        if (!name) {
            return this.databaseInstances[Object.keys(this.databaseInstances)[0]]
                .setMainKey(mainKey);
        }
        return this.databaseInstances[name].setMainKey(mainKey);
    }

    /**
     * Adds another database instance
     * @param {string} name name of database
     * @param {*} instance Database implementation
     */
    addDb(name, instance) {
        this.databaseInstances[name] = instance;
    }

    /**
    * Create a databayse instance by config.
    * @param {object} config The config for the database.
    *                 config.type will be used to determine the implementation.
    * @return {*} The new instance.
    * @throws {Error} on error
    */
    static createInstance(config) {
      if (!_.isObject(config)) {
          throw new Error('db config must be an object');
      }

      if (!config.type) {
          throw new Error('db type is not defined');
      }

      let creatorFunction = Db.dbIntegrations[config.type];

      if (!creatorFunction) {
        throw new Error('Database type ' + config.type + ' is not supported.');
      }

      try {
        let dbInstance = new Db(config.type, creatorFunction(config));
        return dbInstance;
      } catch (e) {
        // COULD to something here.
        throw e;
      }

      return null;
    }

    /**
     * Adds another database implementation by an creator function.
     * The creatorFunction will be called with the config and should return
     * the database instance (or throw an error).
     *
     * creatorFunction(config) -> dbInstance
     *
     * @param {string} name name of database
     * @param {*} creatorFunction Function for creating the database instance.
     */
    static addDbIntegration(name, creatorFunction) {
      Db.dbIntegrations = Db.dbIntegrations || {};
      Db.dbIntegrations[name] = creatorFunction;
    }

    /**
    * Initialize standard integrations. Will be called automatically for you (see below);
    */
    static initializeStandardIntegrations() {
      // Add standard db integrations.
      // The following code should be moved out to some initialization place
      Db.addDbIntegration('file', function(config) {
        if (!config.localDbFilename || !_.isString(config.localDbFilename)) {
            throw new Error('localDbFilename variable is not defined');
        }
        return new FilePersistence(config.localDbFilename);
      });

      Db.addDbIntegration('dynamodb', function(config) {
        if (!config.tableName || !_.isString(config.tableName)) {
            throw new Error('tableName variable is not defined');
        }
        return new DynamoDb(config.tableName, _.get(config, 'awsConfig', {}));
      });

      Db.addDbIntegration('datastore', function(config) {
        return new DatastoreDb(config);
      });
    }
}

Db.initializeStandardIntegrations();

module.exports.Db = Db;
