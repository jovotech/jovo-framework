import {Db, BaseApp, PluginConfig} from 'jovo-core';
import * as _ from "lodash";
import * as AWS from 'aws-sdk';
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";

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
        createTableOnInit: true,
        primaryKeyColumn: 'userId',
        documentClientConfig: {
            convertEmptyValues: true,
        },
        dynamoDbConfig: {},
    };
    needsWriteFileAccess = false;
    dynamoClient: AWS.DynamoDB;
    docClient: AWS.DynamoDB.DocumentClient;
    isCreating = false;

    constructor(config?: Config) {

        if (config) {
            this.config = _.merge(this.config, config);
        }
        if (this.config.awsConfig) {
            this.config.dynamoDbConfig = _.merge(this.config.dynamoDbConfig, this.config.awsConfig);
        }
        this.dynamoClient = new AWS.DynamoDB(this.config.dynamoDbConfig);
        this.docClient = new AWS.DynamoDB.DocumentClient(this.config.documentClientConfig);
    }

    install(app: BaseApp) {
        app.$db = this;
    }

    uninstall(app: BaseApp) {

    }

    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    async load(primaryKey: string): Promise<object> {
        if (!this.config.tableName) {
            throw new Error(`Couldn't use DynamoDB. tableName has to be set.`);
        }

        const getDataMapParams: DocumentClient.GetItemInput = {
            Key: {
                userId: primaryKey,
            },
            TableName: this.config.tableName,
            ConsistentRead: true,
        };

        try {
            const result = await this.docClient.get(getDataMapParams).promise();
            this.isCreating = false;
            return result;
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

            if (_.get(result, 'TableDescription.TableStatus') === 'CREATING') {
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
