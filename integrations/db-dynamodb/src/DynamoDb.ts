import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  DynamoDBClientConfig,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, marshallOptions, unmarshall } from '@aws-sdk/util-dynamodb';
import {
  DbItem,
  DbPlugin,
  DbPluginConfig,
  HandleRequest,
  Jovo,
  PersistableSessionData,
  PersistableUserData,
  RequiredOnlyWhere,
  UnknownObject,
} from '@jovotech/framework';

export interface DynamoDbConfig extends DbPluginConfig {
  table: {
    name: string;
    createTableOnInit?: boolean; // Creates a table if one does not already exist
    primaryKeyColumn?: string; // Name of primary key column
    readCapacityUnits?: number; // @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ProvisionedThroughput.html
    writeCapacityUnits?: number; // @see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ProvisionedThroughput.html
  };
  libraryConfig?: {
    dynamoDbClient?: DynamoDBClientConfig;
    marshall?: marshallOptions;
  };
}

export type DynamoDbInitConfig = RequiredOnlyWhere<DynamoDbConfig, 'table'>;

export interface DynamoDbItem {
  id: string;
  user?: PersistableUserData;
  session?: PersistableSessionData;
  createdAt?: string;
  updatedAt?: string;
}

export class DynamoDb extends DbPlugin<DynamoDbConfig> {
  client: DynamoDBClient;

  constructor(config: DynamoDbInitConfig) {
    super(config);
    this.client = new DynamoDBClient(this.config.libraryConfig?.dynamoDbClient || {});
  }

  getDefaultConfig(): DynamoDbConfig {
    return {
      ...super.getDefaultConfig(),
      table: {
        name: '<YOUR-TABLE-NAME>',
        primaryKeyColumn: 'userId',
        createTableOnInit: true,
        readCapacityUnits: 2,
        writeCapacityUnits: 2,
      },
      libraryConfig: {
        marshall: {
          removeUndefinedValues: true,
          convertClassInstanceToMap: true,
        },
      },
    };
  }

  getInitConfig(): DynamoDbInitConfig {
    return { table: { name: '<YOUR-TABLE-NAME>' } };
  }

  mount(parent: HandleRequest): Promise<void> | void {
    super.mount(parent);

    // initialize a new client for the mounted instance with the given request-config
    this.client = new DynamoDBClient(this.config.libraryConfig?.dynamoDbClient || {});
  }

  async initialize(): Promise<void> {
    try {
      const params = {
        TableName: this.config.table.name!,
      };
      const command = new DescribeTableCommand(params);
      await this.client.send(command);
    } catch (e) {
      if (e.name === 'ResourceNotFoundException') {
        if (this.config.table.createTableOnInit) {
          await this.createTable();
          throw new Error('Creating a table. Please wait a moment and resend the request...');
        } else {
          throw new Error(
            `Table ${this.config.table.name} does not exist and setting up a table automatically deactivated. Please setup a table manually.`,
          );
        }
      }
      throw e;
    }
  }

  async createTable(): Promise<void> {
    const params = {
      AttributeDefinitions: [
        {
          AttributeName: this.config.table.primaryKeyColumn,
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: this.config.table.primaryKeyColumn!,
          KeyType: 'HASH',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: this.config.table.readCapacityUnits!,
        WriteCapacityUnits: this.config.table.writeCapacityUnits!,
      },
      TableName: this.config.table.name!,
    };

    await this.client.send(new CreateTableCommand(params));
  }

  async getDbItem(primaryKey: string): Promise<DbItem> {
    const params = {
      ConsistentRead: true,
      Key: {
        [this.config.table.primaryKeyColumn!]: { S: primaryKey },
      },
      TableName: this.config.table.name!,
    };
    const data = await this.client.send(new GetItemCommand(params));
    return data.Item as DbItem;
  }

  async loadData(userId: string, jovo: Jovo): Promise<void> {
    this.checkRequirements();

    const dbItem = await this.getDbItem(userId);
    if (dbItem) {
      jovo.$user.isNew = false;
      jovo.setPersistableData(unmarshall(dbItem), this.config.storedElements);
    }
  }

  async saveData(userId: string, jovo: Jovo): Promise<void> {
    this.checkRequirements();

    const params = {
      Item: {
        [this.config.table.primaryKeyColumn!]: userId,
      } as UnknownObject,
      TableName: this.config.table.name!,
    };

    const item: DbItem = {
      [this.config.table.primaryKeyColumn!]: userId,
    };
    await this.applyPersistableData(jovo, item);

    await this.client.send(
      new PutItemCommand({
        TableName: params.TableName,
        Item: marshall(item, this.config.libraryConfig?.marshall),
      }),
    );
  }

  checkRequirements(): void | Error {
    if (!this.config.table.primaryKeyColumn) {
      throw new Error('this.config.table.primaryKeyColumn must not be undefined');
    }
    if (!this.config.table.name) {
      throw new Error('this.config.table.name must not be undefined');
    }
  }
}
