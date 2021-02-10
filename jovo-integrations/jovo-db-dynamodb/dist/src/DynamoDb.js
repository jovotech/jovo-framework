"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
class DynamoDb {
    constructor(config) {
        this.config = {
            awsConfig: undefined,
            awsXray: false,
            createTableOnInit: true,
            dax: undefined,
            documentClientConfig: {
                convertEmptyValues: true,
            },
            dynamoDbConfig: {},
            prefixPrimaryKeyWithPlatform: false,
            primaryKeyColumn: 'userId',
            primaryKeyPrefix: '',
            sortKey: 'USER#jovo.user.data',
            sortKeyColumn: undefined,
            tableName: undefined,
        };
        this.needsWriteFileAccess = false;
        this.isCreating = false;
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.aws = AWS;
    }
    install(app) {
        if (this.config.awsConfig) {
            this.config.dynamoDbConfig = _merge(this.config.dynamoDbConfig, this.config.awsConfig);
            this.config.documentClientConfig = _merge(this.config.documentClientConfig, this.config.awsConfig);
        }
        if (this.config.awsXray) {
            try {
                const AWSXRay = require('aws-xray-sdk-core'); // tslint:disable-line
                this.aws = AWSXRay.captureAWS(require('aws-sdk'));
            }
            catch (e) {
                if (e.message.includes(`Cannot find module 'aws-xray-sdk-core'`)) {
                    throw new jovo_core_1.JovoError(e.message, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-dynamodb', undefined, 'Please run `npm install aws-xray-sdk-core`');
                }
                else {
                    throw e;
                }
            }
        }
        this.dynamoClient = new this.aws.DynamoDB(this.config.dynamoDbConfig);
        if (this.config.dax) {
            if (this.config.awsXray) {
                throw new jovo_core_1.JovoError(`DynamoDB Accelerator doesn't work with AWS X-Ray`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-dynamodb');
            }
            try {
                const AmazonDaxClient = require('amazon-dax-client'); // tslint:disable-line
                const dax = new AmazonDaxClient(this.config.dax);
                this.docClient = new this.aws.DynamoDB.DocumentClient({ service: dax });
            }
            catch (e) {
                if (e.message.includes(`Cannot find module 'amazon-dax-client'`)) {
                    throw new jovo_core_1.JovoError(e.message, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-dynamodb', undefined, 'Please run `npm install amazon-dax-client`');
                }
                else {
                    throw e;
                }
            }
        }
        else {
            this.docClient = new this.aws.DynamoDB.DocumentClient(this.config.documentClientConfig);
        }
        if (_get(app.config, 'db.default')) {
            if (_get(app.config, 'db.default') === 'DynamoDb') {
                app.$db = this;
            }
        }
        else {
            app.$db = this;
        }
    }
    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    async load(primaryKey, jovo) {
        // tslint:disable-line
        this.errorHandling();
        const getDataMapParams = {
            ConsistentRead: true,
            Key: {
                [this.config.primaryKeyColumn]: this.formatPrimaryKey(primaryKey, jovo),
            },
            TableName: this.config.tableName,
        };
        if (this.config.sortKeyColumn) {
            getDataMapParams.Key[this.config.sortKeyColumn] = this.config.sortKey;
        }
        try {
            const result = await this.docClient.get(getDataMapParams).promise();
            this.isCreating = false;
            return result.Item;
        }
        catch (err) {
            if (err.code === 'ResourceNotFoundException') {
                if (this.config.createTableOnInit) {
                    await this.createTable();
                    return {};
                }
            }
            else {
                throw err;
            }
        }
    }
    errorHandling() {
        if (!this.config.tableName) {
            throw new jovo_core_1.JovoError(`Couldn't use DynamoDB. tableName has to be set.`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-dynamodb');
        }
        if (!this.docClient) {
            throw new jovo_core_1.JovoError(`Couldn't use DynamoDb. DocClient is not initialized.`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-dynamodb');
        }
        if (!this.config.primaryKeyColumn) {
            throw new jovo_core_1.JovoError(`Couldn't use DynamoDB. primaryKeyColumn has to be set.`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-dynamodb');
        }
        if (this.config.sortKeyColumn && !this.config.sortKey) {
            throw new jovo_core_1.JovoError(`Couldn't use DynamoDB. when using sortKeyColumn, sortKey has to be set.`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-dynamodb');
        }
    }
    async save(primaryKey, key, data, updatedAt, jovo) {
        // tslint:disable-line
        this.errorHandling();
        const getDataMapParams = {
            Item: {
                [this.config.primaryKeyColumn]: this.formatPrimaryKey(primaryKey, jovo),
                [key]: data,
            },
            TableName: this.config.tableName,
        };
        if (updatedAt) {
            getDataMapParams.Item.updatedAt = updatedAt;
        }
        if (this.config.sortKeyColumn) {
            getDataMapParams.Item[this.config.sortKeyColumn] = this.config.sortKey;
        }
        if (!this.isCreating) {
            return this.docClient.put(getDataMapParams).promise();
        }
    }
    async delete(primaryKey, jovo) {
        this.errorHandling();
        const deleteItemInput = {
            Key: {
                [this.config.primaryKeyColumn]: this.formatPrimaryKey(primaryKey, jovo),
            },
            TableName: this.config.tableName,
        };
        if (this.config.sortKeyColumn) {
            deleteItemInput.Key[this.config.sortKeyColumn] = this.config.sortKey;
        }
        return this.docClient.delete(deleteItemInput).promise();
    }
    async createTable() {
        if (!this.dynamoClient) {
            throw new jovo_core_1.JovoError(`Couldn't use DynamoDb. DynamoClient is not initialized.`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-dynamodb');
        }
        const newTableParams = {
            AttributeDefinitions: [
                {
                    AttributeName: this.config.primaryKeyColumn,
                    AttributeType: 'S',
                },
            ],
            KeySchema: [
                {
                    AttributeName: this.config.primaryKeyColumn,
                    KeyType: 'HASH',
                },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
            TableName: this.config.tableName,
        };
        if (this.config.sortKeyColumn) {
            newTableParams.AttributeDefinitions.push({
                AttributeName: this.config.sortKeyColumn,
                AttributeType: 'S',
            });
            newTableParams.KeySchema.push({
                AttributeName: this.config.sortKeyColumn,
                KeyType: 'RANGE',
            });
        }
        try {
            const result = await this.dynamoClient.createTable(newTableParams).promise();
            if (_get(result, 'TableDescription.TableStatus') === 'CREATING') {
                jovo_core_1.Log.info(jovo_core_1.Log.header('INFO: DynamoDB', 'jovo-db-dynamodb'));
                jovo_core_1.Log.info(`Creating DynamoDB table '${this.config.tableName}'...!`);
                jovo_core_1.Log.info();
                jovo_core_1.Log.info('Table configuration:');
                jovo_core_1.Log.info(JSON.stringify(newTableParams, null, '\t'));
                jovo_core_1.Log.info('More Info: >> https://www.jovo.tech/docs/databases/dynamodb');
                jovo_core_1.Log.info(jovo_core_1.Log.header());
                this.isCreating = true;
            }
            // return result;
        }
        catch (err) {
            throw new jovo_core_1.JovoError(err.message, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-db-dynamodb');
        }
    }
    formatPrimaryKey(primaryKey, jovo, includePrefix = true) {
        let key = primaryKey;
        if (this.config.prefixPrimaryKeyWithPlatform && jovo) {
            const platform = jovo.getType();
            key = `${platform}::${key}`;
        }
        if (includePrefix) {
            key = `${this.config.primaryKeyPrefix}${key}`;
        }
        return key;
    }
}
exports.DynamoDb = DynamoDb;
//# sourceMappingURL=DynamoDb.js.map