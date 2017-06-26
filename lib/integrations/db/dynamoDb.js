const AWS = require('aws-sdk');

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
        if (awsConfig) {
            AWS.config.update({
                accessKeyId: awsConfig.accessKeyId,
                secretAccessKey: awsConfig.secretAccessKey,
                region: awsConfig.region,
            });
        }
        this.tableName = tableName;
        this.docClient = new AWS.DynamoDB.DocumentClient();
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
        let tableName = this.tableName;
        let docClient = this.docClient;
        let params = {
            TableName: this.tableName,
            Item: {
                'userId': this.mainKey,
            },
        };
        params['Item'][key] = value;
        docClient.put(params, function(err, data) {
            if (err && err.code === 'ResourceNotFoundException') {
                let newTable = {
                    AttributeDefinitions: [
                        {
                            AttributeName: 'userId',
                            AttributeType: 'S',
                        },
                    ],
                    KeySchema: [
                        {
                            AttributeName: 'userId',
                            KeyType: 'HASH',
                        },
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5,
                    },
                };
                newTable['TableName'] = tableName;
                let dynamoClient = new AWS.DynamoDB();
                dynamoClient.createTable(newTable, function(err, data) {
                    if (err) {
                        console.log('Error creating table: ' + JSON.stringify(err, null, '\t'));
                    } else {
                        docClient.put(params, function(err, data) {
                            callback(err, data);
                        });
                    }
                });
            } else {
                callback(err, data);
            }
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
        this.docClient.get(params, function(err, data) {
            callback(data.Item[key], err);
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
            callback(data, err);
        });
    }

    /**
     * Deletes data for that key
     * @param {string} key
     * @param {function} callback
     */
    deleteData(key, callback) {
        let params = {
            TableName: this.tableName,
            Item: {
                'userId': this.mainKey,
            },
        };
        params['Item'][key] = {}; // TODO find better solution, just a workaround
        this.docClient.put(params, function(err, data) {
            callback(data, err);
        });
    }
}

module.exports.DynamoDb = DynamoDb;

