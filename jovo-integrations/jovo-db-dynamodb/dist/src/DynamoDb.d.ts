import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { BaseApp, Db, Jovo, PluginConfig } from 'jovo-core';
export interface Config extends PluginConfig {
    tableName?: string;
    createTableOnInit?: boolean;
    primaryKeyColumn?: string;
    primaryKeyPrefix?: string;
    prefixPrimaryKeyWithPlatform?: boolean;
    sortKeyColumn?: string;
    sortKey?: string;
    dynamoDbConfig?: AWS.DynamoDB.Types.ClientConfiguration;
    documentClientConfig?: DocumentClient.DocumentClientOptions & AWS.DynamoDB.Types.ClientConfiguration;
    dax?: {
        endpoints?: string[];
        region?: string;
    };
    awsXray?: boolean;
    awsConfig?: AWS.DynamoDB.Types.ClientConfiguration;
}
export declare class DynamoDb implements Db {
    config: Config;
    needsWriteFileAccess: boolean;
    dynamoClient?: AWS.DynamoDB;
    docClient?: AWS.DynamoDB.DocumentClient;
    isCreating: boolean;
    aws: any;
    constructor(config?: Config);
    install(app: BaseApp): void;
    /**
     * Returns object for given primaryKey
     * @param {string} primaryKey
     * @return {Promise<any>}
     */
    load(primaryKey: string, jovo?: Jovo): Promise<any>;
    errorHandling(): void;
    save(primaryKey: string, key: string, data: any, updatedAt?: string, jovo?: Jovo): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.DynamoDB.DocumentClient.PutItemOutput, AWS.AWSError> | undefined>;
    delete(primaryKey: string, jovo?: Jovo): Promise<import("aws-sdk/lib/request").PromiseResult<AWS.DynamoDB.DocumentClient.DeleteItemOutput, AWS.AWSError>>;
    createTable(): Promise<void>;
    formatPrimaryKey(primaryKey: string, jovo?: Jovo, includePrefix?: boolean): string;
}
