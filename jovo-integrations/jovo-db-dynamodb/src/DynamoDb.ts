import * as AWS from 'aws-sdk';
import { GetItemOutput } from 'aws-sdk/clients/dynamodb'; // tslint:disable-line:no-submodule-imports
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'; // tslint:disable-line:no-submodule-imports
import { BaseApp, Db, ErrorCode, Jovo, JovoError, Log, PluginConfig } from 'jovo-core';
import _get = require('lodash.get');
import _merge = require('lodash.merge');

interface JovoDynamoDbKeySchemaElement extends AWS.DynamoDB.Types.KeySchemaElement {
  // This value is used to grab the value from userData and project it the root of a dynamodb record.
  // Json path that starts from userData. i.e. if Path=$data.subscribed then it will project userData.$data.subscribed
  Path: string;
  // The type of the value to project. This value is required when creating the attribute definition.
  AttributeType: AWS.DynamoDB.Types.ScalarAttributeType;
}

interface JovoDynamoDbGlobalSecondaryIndex extends AWS.DynamoDB.Types.GlobalSecondaryIndex {
  KeySchema: JovoDynamoDbKeySchemaElement[];
}

const DEFAULT_PROVISIONED_THROUGHPUT: AWS.DynamoDB.ProvisionedThroughput = {
  ReadCapacityUnits: 5,
  WriteCapacityUnits: 5,
};

export interface Config extends PluginConfig {
  tableName?: string;
  createTableOnInit?: boolean;
  primaryKeyColumn?: string;
  primaryKeyPrefix?: string;
  prefixPrimaryKeyWithPlatform?: boolean;
  sortKeyColumn?: string;
  sortKey?: string;
  globalSecondaryIndexes?: JovoDynamoDbGlobalSecondaryIndex[];
  provisionedThroughput?: AWS.DynamoDB.Types.ProvisionedThroughput;
  dynamoDbConfig?: AWS.DynamoDB.Types.ClientConfiguration;
  documentClientConfig?: DocumentClient.DocumentClientOptions &
    AWS.DynamoDB.Types.ClientConfiguration;
  dax?: {
    endpoints?: string[];
    region?: string;
  };
  awsXray?: boolean;
  awsConfig?: AWS.DynamoDB.Types.ClientConfiguration;
}

export class DynamoDb implements Db {
  config: Config = {
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
  needsWriteFileAccess = false;
  dynamoClient?: AWS.DynamoDB;
  docClient?: AWS.DynamoDB.DocumentClient;
  isCreating = false;
  aws: any; // tslint:disable-line

  constructor(config?: Config) {
    if (config) {
      this.config = _merge(this.config, config);
    }
    this.aws = AWS;
  }

  install(app: BaseApp) {
    if (this.config.awsConfig) {
      this.config.dynamoDbConfig = _merge(this.config.dynamoDbConfig, this.config.awsConfig);
      this.config.documentClientConfig = _merge(
        this.config.documentClientConfig,
        this.config.awsConfig,
      );
    }

    if (this.config.awsXray) {
      try {
        const AWSXRay = require('aws-xray-sdk-core'); // tslint:disable-line
        this.aws = AWSXRay.captureAWS(require('aws-sdk'));
      } catch (e) {
        if (e.message.includes(`Cannot find module 'aws-xray-sdk-core'`)) {
          throw new JovoError(
            e.message,
            ErrorCode.ERR_PLUGIN,
            'jovo-db-dynamodb',
            undefined,
            'Please run `npm install aws-xray-sdk-core`',
          );
        } else {
          throw e;
        }
      }
    }

    this.dynamoClient = new this.aws.DynamoDB(this.config.dynamoDbConfig);

    if (this.config.dax) {
      if (this.config.awsXray) {
        throw new JovoError(
          `DynamoDB Accelerator doesn't work with AWS X-Ray`,
          ErrorCode.ERR_PLUGIN,
          'jovo-db-dynamodb',
        );
      }

      try {
        const AmazonDaxClient = require('amazon-dax-client'); // tslint:disable-line
        const dax = new AmazonDaxClient(this.config.dax);
        this.docClient = new this.aws.DynamoDB.DocumentClient({ service: dax });
      } catch (e) {
        if (e.message.includes(`Cannot find module 'amazon-dax-client'`)) {
          throw new JovoError(
            e.message,
            ErrorCode.ERR_PLUGIN,
            'jovo-db-dynamodb',
            undefined,
            'Please run `npm install amazon-dax-client`',
          );
        } else {
          throw e;
        }
      }
    } else {
      this.docClient = new this.aws.DynamoDB.DocumentClient(this.config.documentClientConfig);
    }

    if (_get(app.config, 'db.default')) {
      if (_get(app.config, 'db.default') === 'DynamoDb') {
        app.$db = this;
      }
    } else {
      app.$db = this;
    }
  }

  /**
   * Returns object for given primaryKey
   * @param {string} primaryKey
   * @return {Promise<any>}
   */
  async load(primaryKey: string, jovo?: Jovo): Promise<any> {
    // tslint:disable-line
    this.errorHandling();

    const getDataMapParams: DocumentClient.GetItemInput = {
      ConsistentRead: true,
      Key: {
        [this.config.primaryKeyColumn!]: this.formatPrimaryKey(primaryKey, jovo),
      },
      TableName: this.config.tableName!,
    };

    if (this.config.sortKeyColumn) {
      getDataMapParams.Key[this.config.sortKeyColumn!] = this.config.sortKey!;
    }

    try {
      const result: GetItemOutput = await this.docClient!.get(getDataMapParams).promise();
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
  }

  errorHandling() {
    if (!this.config.tableName) {
      throw new JovoError(
        `Couldn't use DynamoDB. tableName has to be set.`,
        ErrorCode.ERR_PLUGIN,
        'jovo-db-dynamodb',
      );
    }
    if (!this.docClient) {
      throw new JovoError(
        `Couldn't use DynamoDb. DocClient is not initialized.`,
        ErrorCode.ERR_PLUGIN,
        'jovo-db-dynamodb',
      );
    }
    if (!this.config.primaryKeyColumn) {
      throw new JovoError(
        `Couldn't use DynamoDB. primaryKeyColumn has to be set.`,
        ErrorCode.ERR_PLUGIN,
        'jovo-db-dynamodb',
      );
    }
    if (this.config.sortKeyColumn && !this.config.sortKey) {
      throw new JovoError(
        `Couldn't use DynamoDB. when using sortKeyColumn, sortKey has to be set.`,
        ErrorCode.ERR_PLUGIN,
        'jovo-db-dynamodb',
      );
    }
  }

  async save(primaryKey: string, key: string, data: any, updatedAt?: string, jovo?: Jovo) {
    // tslint:disable-line
    this.errorHandling();

    const getDataMapParams: DocumentClient.PutItemInput = {
      Item: {
        [this.config.primaryKeyColumn!]: this.formatPrimaryKey(primaryKey, jovo),
        [key]: data,
      },
      TableName: this.config.tableName!,
    };
    if (updatedAt) {
      getDataMapParams.Item.updatedAt = updatedAt;
    }

    if (this.config.sortKeyColumn) {
      getDataMapParams.Item[this.config.sortKeyColumn!] = this.config.sortKey!;
    }

    if (this.config.globalSecondaryIndexes?.length) {
      // For each KeySchema in each GSI, we will use the path and project the data to the root level
      this.config.globalSecondaryIndexes.forEach((gsi) => {
        gsi.KeySchema.forEach((schema) => {
          const { Path, AttributeName } = schema;
          const dataToProject = _get(data, Path);

          getDataMapParams.Item[AttributeName] = dataToProject;
        });
      });
    }

    if (!this.isCreating) {
      return this.docClient!.put(getDataMapParams).promise();
    }
  }

  async delete(primaryKey: string, jovo?: Jovo) {
    this.errorHandling();

    const deleteItemInput: DocumentClient.DeleteItemInput = {
      Key: {
        [this.config.primaryKeyColumn!]: this.formatPrimaryKey(primaryKey, jovo),
      },
      TableName: this.config.tableName!,
    };

    if (this.config.sortKeyColumn) {
      deleteItemInput.Key[this.config.sortKeyColumn!] = this.config.sortKey!;
    }

    return this.docClient!.delete(deleteItemInput).promise();
  }

  async createTable() {
    if (!this.dynamoClient) {
      throw new JovoError(
        `Couldn't use DynamoDb. DynamoClient is not initialized.`,
        ErrorCode.ERR_PLUGIN,
        'jovo-db-dynamodb',
      );
    }

    const newTableParams: AWS.DynamoDB.Types.CreateTableInput = {
      AttributeDefinitions: [
        {
          AttributeName: this.config.primaryKeyColumn!,
          AttributeType: 'S',
        },
      ],
      GlobalSecondaryIndexes: [],
      KeySchema: [
        {
          AttributeName: this.config.primaryKeyColumn!,
          KeyType: 'HASH',
        },
      ],
      ProvisionedThroughput: this.config.provisionedThroughput ?? DEFAULT_PROVISIONED_THROUGHPUT,
      TableName: this.config.tableName!,
    };

    if (this.config.sortKeyColumn) {
      newTableParams.AttributeDefinitions.push({
        AttributeName: this.config.sortKeyColumn!,
        AttributeType: 'S',
      });

      newTableParams.KeySchema.push({
        AttributeName: this.config.sortKeyColumn!,
        KeyType: 'RANGE',
      });
    }

    if (this.config.globalSecondaryIndexes) {
      this.config.globalSecondaryIndexes.forEach((gsi) => {
        const awsKeySchemas = gsi.KeySchema.map((key) => {
          // Add GSI key's to Attribute Definitions
          newTableParams.AttributeDefinitions.push({
            AttributeName: key.AttributeName,
            AttributeType: key.AttributeType,
          });

          // We need to remove Jovo custom keys that aren't apart of
          // dynamodb's api request structure.
          const { Path, AttributeType, ...restOfKeySchema } = key;
          return restOfKeySchema;
        });

        newTableParams.GlobalSecondaryIndexes?.push({
          ...gsi,
          KeySchema: awsKeySchemas,
          // Add provision throughput
          ProvisionedThroughput: gsi.ProvisionedThroughput ?? DEFAULT_PROVISIONED_THROUGHPUT,
        });
      });
    }
    try {
      const result = await this.dynamoClient!.createTable(newTableParams).promise();

      if (_get(result, 'TableDescription.TableStatus') === 'CREATING') {
        Log.info(Log.header('INFO: DynamoDB', 'jovo-db-dynamodb'));
        Log.info(`Creating DynamoDB table '${this.config.tableName}'...!`);
        Log.info();
        Log.info('Table configuration:');
        Log.info(JSON.stringify(newTableParams, null, '\t'));

        Log.info('More Info: >> https://www.jovo.tech/docs/databases/dynamodb');
        Log.info(Log.header());

        this.isCreating = true;
      }

      // return result;
    } catch (err) {
      throw new JovoError(err.message, ErrorCode.ERR_PLUGIN, 'jovo-db-dynamodb');
    }
  }

  formatPrimaryKey(primaryKey: string, jovo?: Jovo, includePrefix = true) {
    let key = primaryKey;

    if (this.config.prefixPrimaryKeyWithPlatform && jovo) {
      const platform = jovo.getType();

      key = `${platform}::${key}`;
    }

    if (includePrefix) {
      key = `${this.config.primaryKeyPrefix!}${key}`;
    }

    return key;
  }
}
