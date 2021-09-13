import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  DynamoDBClientConfig,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import {
  DbItem,
  DbPlugin,
  DbPluginConfig,
  HandleRequest,
  Jovo,
  PersistableSessionData,
  PersistableUserData,
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
  };
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
      table: {
        name: '',
        primaryKeyColumn: 'userId',
        createTableOnInit: true,
        readCapacityUnits: 2,
        writeCapacityUnits: 2,
      },
    };
  }

  constructor(config: DynamoDbConfig) {
    super(config);
    this.client = new DynamoDBClient(this.config.libraryConfig?.dynamoDbClient || {});
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

  async loadData(jovo: Jovo): Promise<void> {
    this.checkRequirements();
    const dbItem = await this.getDbItem(jovo.$user.id);

    if (dbItem) {
      jovo.$user.isNew = false;
      jovo.setPersistableData(unmarshall(dbItem), this.config.storedElements);
    }
  }

  async saveData(jovo: Jovo): Promise<void> {
    this.checkRequirements();

    const params = {
      Item: {
        [this.config.table.primaryKeyColumn!]: jovo.$user.id as string,
      } as UnknownObject,
      TableName: this.config.table.name!,
    };

    const item: DbItem = {
      [this.config.table.primaryKeyColumn!]: jovo.$user.id,
    };
    await this.applyPersistableData(jovo, item);

    await this.client.send(
      new PutItemCommand({
        TableName: params.TableName,
        Item: marshall(item, { removeUndefinedValues: true }),
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
