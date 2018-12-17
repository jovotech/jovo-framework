import {Db, BaseApp, PluginConfig} from 'jovo-core';
import _merge = require('lodash.merge');
import _get = require('lodash.get');
import * as AWS from 'aws-sdk';
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {GetItemOutput} from 'aws-sdk/clients/dynamodb';

export interface Config extends PluginConfig {
    tableName?: string;
    createTableOnInit?: boolean;
    primaryKeyColumn?: string;
    dynamoDbConfig?: AWS.DynamoDB.Types.ClientConfiguration;
    documentClientConfig?: DocumentClient.DocumentClientOptions & AWS.DynamoDB.Types.ClientConfiguration;
    awsConfig?: AWS.DynamoDB.Types.ClientConfiguration;
}

export class DynamoDb implements Db {
    config: Config = {
        tableName: undefined,
        createTableOnInit: true,
        primaryKeyColumn: 'userId',
        documentClientConfig: {
            convertEmptyValues: true,
        },
        dynamoDbConfig: {},
    };
    needsWriteFileAccess = false;
    dynamoClient?: AWS.DynamoDB;
    docClient?: AWS.DynamoDB.DocumentClient;
    isCreating = false;

    constructor(config?: Config) {
        if (config) {
            this.config = _merge(this.config, config);
        }
        if (this.config.awsConfig) {
            this.config.dynamoDbConfig = _merge(this.config.dynamoDbConfig, this.config.awsConfig);
            this.config.documentClientConfig = _merge(this.config.documentClientConfig, this.config.awsConfig);

        }
    }

    install(app: BaseApp) {
        this.dynamoClient = new AWS.DynamoDB(this.config.dynamoDbConfig);
        this.docClient = new AWS.DynamoDB.DocumentClient(this.config.documentClientConfig);

        if (_get(app.config, 'db.default')) {
            if (_get(app.config, 'db.default') === 'DynamoDb') {
                app.$db = this;
            }
        } else {
            app.$db = this;
        }
    }

    uninstall(app: BaseApp) {

    }

    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    async load(primaryKey: string): Promise<any> { // tslint:disable-line
        if (!this.config.tableName) {
            throw new Error(`Couldn't use DynamoDb. tableName has to be set.`);
        }
        if (!this.docClient) {
            throw new Error(`Couldn't use DynamoDb. DocClient is not initialized.`);
        }

        const getDataMapParams: DocumentClient.GetItemInput = {
            Key: {
                userId: primaryKey,
            },
            TableName: this.config.tableName,
            ConsistentRead: true,
        };

        try {
            const result: GetItemOutput = await this.docClient.get(getDataMapParams).promise();
            this.isCreating = false;

            return result.Item;
        } catch (err) {
            if (err.code === 'ResourceNotFoundException') {
                if (this.config.createTableOnInit) {
                    await this.createTable();
                    return {};
                }
            } else {
                throw err;
            }

        }
        return {};
    }

    async save(primaryKey: string, key: string, data: object) {
        if (!this.config.tableName) {
            throw new Error(`Couldn't use DynamoDB. tableName has to be set.`);

        }
        if (!this.config.primaryKeyColumn) {
            throw new Error(`Couldn't use DynamoDB. primaryKeyColumn has to be set.`);

        }
        if (!this.docClient) {
            throw new Error(`Couldn't use DynamoDb. DocClient is not initialized.`);
        }
        const getDataMapParams: DocumentClient.PutItemInput = {
            TableName: this.config.tableName,
            Item: {
                [this.config.primaryKeyColumn]: primaryKey,
                [key]: data,
            }
        };
        if (!this.isCreating) {
            return await this.docClient.put(getDataMapParams).promise();
        }
    }

    async delete(primaryKey: string) {
    }

    private async createTable() {
        if (!this.config.tableName) {
            throw new Error(`Couldn't use DynamoDB. tableName has to be set.`);

        }
        if (!this.config.primaryKeyColumn) {
            throw new Error(`Couldn't use DynamoDB. primaryKeyColumn has to be set.`);

        }
        if (!this.dynamoClient) {
            throw new Error(`Couldn't use DynamoDb. DynamoClient is not initialized.`);
        }
        const newTableParams: AWS.DynamoDB.Types.CreateTableInput = {
            TableName: this.config.tableName,
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
        };

        try {
            const result = await this.dynamoClient.createTable(newTableParams).promise();

            if (_get(result, 'TableDescription.TableStatus') === 'CREATING') {
                console.info(`#  `);
                console.info(`#  Creating DynamoDB table '${this.config.tableName}'...`);
                console.info(`#  `);
                this.isCreating = true;
            }

            // return result;
        } catch (err) {
            throw new Error('Error while creating dynamo db table');
        }
    }
}
