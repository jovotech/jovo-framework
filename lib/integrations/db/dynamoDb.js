'use strict';
const _ = require('lodash');

const ERR_MAIN_KEY_NOT_FOUND = 'ERR_MAIN_KEY_NOT_FOUND';
const ERR_DATA_KEY_NOT_FOUND = 'ERR_DATA_KEY_NOT_FOUND';
const ERR_AWS = 'ERR_AWS';
/**
 * Class DynamoDb
 */
class DynamoDb {
    /**
     * constructor
     * @param {string} tableName
     * @param {*} awsConfig
     */
    constructor(tableName, awsConfig) {
        try {
            this.aws = require('aws-sdk');
        } catch (err) {
          throw Error('Please install the AWS Sdk: npm install aws-sdk');
        }
        if (awsConfig) {
            this.aws.config.update(awsConfig);
        }
        this.tableName = tableName;
        this.dynamoClient = new this.aws.DynamoDB();
        this.docClient = new this.aws.DynamoDB.DocumentClient({
            convertEmptyValues: true,
        });
    }
    /**
     * Sets mainkey (userId)
     * @param {string} mainKey
     * @return {DynamoDb}
     */
    setMainKey(mainKey) {
        this.mainKey = mainKey;
        return this;
    }
    /**
     * Saves value
     * @param {string} key
     * @param {object|string} value
     * @param {function} callback
     */
    save(key, value, callback) {
        let docClient = this.docClient;
        let that = this;

            let getDataMapParams = {
                Key: {
                    userId: this.mainKey,
                },
                TableName: this.tableName,
                ConsistentRead: true,
            };

            // get datamap first
            docClient.get(getDataMapParams, function(err, data) {
            // create new table if resource has not been found
            if (err && err.code === 'ResourceNotFoundException') {
                that.createTable(tableName, 'userId', function(err, data) {
                    callback(err, {});
                });
            } else {
                let newData = {};

                if (data && Object.keys(data).length > 0 && data.Item.data) {
                    newData = data.Item.data;
                }

                newData[key] = value;
                let params = {
                    TableName: that.tableName,
                    Item: {
                        'userId': that.mainKey,
                        'data': newData,
                    },
                };
                docClient.put(params, function(err, data) {
                    callback(err, data);
                });
            }
        });
    }

    /**
     * Saves whole row
     * @param {string} key
     * @param {object} newData
     * @param {function} callback
     */
    saveFullObject(key, newData, callback) {
        let params = {
            Key: {
                userId: this.mainKey,
            },
            TableName: this.tableName,
            ConsistentRead: true,
        };
        let that = this;

        that.docClient.get(params, function(err, data) {
            if (err) { // AWS error
                that.checkResourceNotFound(err, callback);
            } else {
                // data not found for that user
                if (Object.keys(data).length === 0) {
                    // callback(createMainKeyNotFoundError(that.mainKey), null);
                    // return;
                    params = {
                        TableName: that.tableName,
                        Item: {
                            'userId': that.mainKey,
                        },
                    };
                } else {
                    params = data;
                }

                _.set(params, 'TableName', that.tableName);
                _.set(params, `Item.${key}`, newData);

                that.docClient.put(params, function(err, data) {
                    callback(err, data);
                });
            }
        });
    }

    /**
     * Saves whole row
     * @param {string} key
     * @param {object} newData
     * @param {function} callback
     */
    saveObject(key, newData, callback) {
        let docClient = this.docClient;

        let params = {
            TableName: this.tableName,
            Item: {
                'userId': this.mainKey,
            },
        };


        _.set(params, `Item.${key}`, newData);

        docClient.put(params, function(err, data) {
            callback(err, data);
        });
    }
    /**
     * Gets value from db
     * @param {string} key
     * @param {function} callback
     */
    load(key, callback) {
        let params = {
            Key: {
                userId: this.mainKey,
            },
            TableName: this.tableName,
            ConsistentRead: true,
        };
        let that = this;

        that.docClient.get(params, function(err, data) {
            if (err) { // AWS error
                that.checkResourceNotFound(err, callback);
            } else {
                // data not found for that user
                if (Object.keys(data).length === 0) {
                    callback(createMainKeyNotFoundError(that.mainKey), null);
                    return;
                }

                // data with that key not found
                if (!_.get(data, `Item.data.${key}`)) {
                    callback(createDataKeyNotFoundError(that.mainKey, key),
                        null);
                    return;
                }

                callback(err, _.get(data, `Item.data.${key}`));
            }
        });
    }

    /**
     * Gets whole row from db
     * @param {function} callback
     */
    loadObject(callback) {
        let params = {
            Key: {
                userId: this.mainKey,
            },
            TableName: this.tableName,
            ConsistentRead: true,
        };
        let that = this;

        that.docClient.get(params, function(err, data) {
            if (err) { // AWS error
                that.checkResourceNotFound(err, callback);
            } else {
                // data not found for that user
                if (Object.keys(data).length === 0) {
                    callback(createMainKeyNotFoundError(that.mainKey), null);
                    return;
                }

                callback(err, data.Item);
            }
        });
    }

    /**
     * Deletes all data of the user
     * @param {function} callback
     */
    deleteUser(callback) {
        let params = {
            Key: {
                userId: this.mainKey,
            },
            TableName: this.tableName,
            ConsistentRead: true,
        };
        this.docClient.delete(params, function(err, data) {
            callback(err, data);
        });
    }

    /**
     * Deletes data for that key
     * @param {string} key
     * @param {function} callback
     */
    deleteData(key, callback) {
        let getDataMapParams = {
            Key: {
                userId: this.mainKey,
            },
            TableName: this.tableName,
            ConsistentRead: true,
        };
        let that = this;
        // get datamap first
        that.docClient.get(getDataMapParams, function(err, data) {
            if (err) {
               callback(err, data);
               return;
            }

            if (Object.keys(data).length === 0) {
                callback(createMainKeyNotFoundError(that.mainKey), null);
                return;
            }
            if (!data.Item['data'][key]) {
                callback(createDataKeyNotFoundError(that.mainKey, key),
                    null);
                return;
            }
            let newData = data.Item.data;
            delete newData[key];
            let params = {
                TableName: that.tableName,
                Item: {
                    'userId': that.mainKey,
                    'data': newData,
                },
            };
            that.docClient.put(params, function(err, data) {
                callback(err, data);
            });
        });
    }

    /**
     * Triggers table (resource creation)
     * @param {string} tableName
     * @param {string} mainKey
     * @param {function} callback
     */
    createTable(tableName, mainKey, callback) {
        let newTable = {
            TableName: tableName,
            AttributeDefinitions: [
                {
                    AttributeName: mainKey,
                    AttributeType: 'S',
                },
            ],
            KeySchema: [
                {
                    AttributeName: mainKey,
                    KeyType: 'HASH',
                },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
        };
        this.dynamoClient.createTable(newTable, function(err, data) {
            if (err) {
                console.log('Error while creating dynamo db table');
            } else {
                console.log('Table '+ tableName + ' created.');
            }
            // TODO: table is creating. not created yet
            callback(err, data);
        });
    }

    /**
     * Checks ResourceNotFoundException
     * @param {object} error
     * @param {function} callback
     */
     checkResourceNotFound(error, callback) {
        if (error.code !== 'ResourceNotFoundException') {
            callback(error, null);
            return;
        }
        // table not found, create a new one
        this.createTable(this.tableName, 'userId', function(err, data) {
            callback(err, {});
        });
     }
}

/**
 * Data key not found error
 * @param {string} mainKey
 * @param {string} key
 * @return {Error}
 */
function createDataKeyNotFoundError(mainKey, key) {
    let err = new Error('Data key "'+key+'" not found for main key "'+mainKey+'"');
    err.code = ERR_DATA_KEY_NOT_FOUND;
    return err;
}
/**
 * Main key not found error
 * @param {string} mainKey
 * @return {Error}
 */
function createMainKeyNotFoundError(mainKey) {
    let err = new Error('Mainkey "'+mainKey+'" not found in database');
    err.code = ERR_MAIN_KEY_NOT_FOUND;
    return err;
}

module.exports.DynamoDb = DynamoDb;

module.exports.DynamoDb.ERR_MAIN_KEY_NOT_FOUND = ERR_MAIN_KEY_NOT_FOUND;
module.exports.DynamoDb.ERR_DATA_KEY_NOT_FOUND = ERR_DATA_KEY_NOT_FOUND;
module.exports.DynamoDb.ERR_AWS = ERR_AWS;
