import {
  App,
  DbItem,
  DbPlugin,
  DbPluginConfig,
  HandleRequest,
  Jovo,
  PersistableSessionData,
  PersistableUserData,
  Plugin,
} from '@jovotech/framework';
import {
  DynamoDBClient,
  GetItemCommand,
  CreateTableCommand,
  PutItemCommand,
  DynamoDBClientConfig,
  ResourceNotFoundException,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

export interface DynamoDbConfig extends DbPluginConfig {
  primaryKeyColumn?: string;
  tableName?: string;

  readCapacityUnits?: number;
  writeCapacityUnits?: number;

  dynamoDbClient?: DynamoDBClientConfig;
}

export interface DynamoDbItem {
  id: string;
  user?: PersistableUserData;
  session?: PersistableSessionData;
  createdAt?: string;
  updatedAt?: string;
}

export class DynamoDb extends DbPlugin<DynamoDbConfig> {
  client: DynamoDBClient;

  getDefaultConfig(): DynamoDbConfig {
    return {
      ...super.getDefaultConfig(),
      primaryKeyColumn: 'userId',
      readCapacityUnits: 2,
      writeCapacityUnits: 2,
    };
  }

  constructor(config: DynamoDbConfig) {
    super(config);
    this.client = new DynamoDBClient(this.config.dynamoDbClient || {});
  }

  async initialize() {
    try {
      const params = {
        TableName: this.config.tableName!,
      };
      const command = new DescribeTableCommand(params);
      await this.client.send(command);
    } catch (e) {
      if (e.name === 'ResourceNotFoundException') {
        await this.createTable();
        throw new Error('Creating a table. Please wait a moment and resend the request...');
      }
    }
  }

  async install(parent: App): Promise<void> {
    parent.middlewareCollection.use('after.request', this.loadData);
    parent.middlewareCollection.use('before.response', this.saveData);
  }

  createTable = async (): Promise<void> => {
    const params = {
      AttributeDefinitions: [
        {
          AttributeName: this.config.primaryKeyColumn,
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: this.config.primaryKeyColumn!,
          KeyType: 'HASH',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: this.config.readCapacityUnits,
        WriteCapacityUnits: this.config.writeCapacityUnits,
      },
      TableName: this.config.tableName!,
    };

    await this.client.send(new CreateTableCommand(params));
  };

  getDbItem = async (primaryKey: string): Promise<DbItem> => {
    const params = {
      ConsistentRead: true,
      Key: {
        [this.config.primaryKeyColumn!]: { S: primaryKey },
      },
      TableName: this.config.tableName!,
    };
    const data = await this.client.send<any, any>(new GetItemCommand(params));
    return data.Item;
  };

  loadData = async (handleRequest: HandleRequest, jovo: Jovo): Promise<void> => {
    this.checkRequirements();
    const dbItem = await this.getDbItem(jovo.$user.id);

    if (dbItem) {
      jovo.$user.isNew = false;
      jovo.setPersistableData(unmarshall(dbItem));
    }
  };

  saveData = async (handleRequest: HandleRequest, jovo: Jovo): Promise<void> => {
    this.checkRequirements();

    const params = {
      Item: {
        [this.config.primaryKeyColumn!]: jovo.$user.id as string,
      } as any,
      TableName: this.config.tableName!,
    };

    const item: DbItem = {
      [this.config.primaryKeyColumn!]: jovo.$user.id,
    };
    await this.applyPersistableData(jovo, item);

    await this.client.send<any, any>(
      new PutItemCommand({
        TableName: params.TableName,
        Item: marshall(item, { removeUndefinedValues: true, convertEmptyValues: true }),
      }),
    );
  };

  checkRequirements = () => {
    if (!this.config.primaryKeyColumn) {
      throw new Error('primaryKeyColumn must not be undefined');
    }
    if (!this.config.tableName) {
      throw new Error('tableName must not be undefined');
    }
  };
}
