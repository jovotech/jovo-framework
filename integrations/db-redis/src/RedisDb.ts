import { DbItem, DbPlugin, DbPluginConfig, Jovo, RequiredOnlyWhere } from '@jovotech/framework';
import { createClient } from '@redis/client';

export interface RedisDbConfig extends DbPluginConfig {
  connectionString: string;
  keyPrefix?: string;
  keySeparator: string;
  entries: RedisEntryConfig[];
  onCreateKey: (
    userId: string,
    config: RedisDbConfig,
    jovo: Jovo,
    entry: RedisEntryConfig,
  ) => Promise<string> | string;
  onEncodeValue: (entryId: string, dbItem: DbItem) => Promise<string> | string;
  onDecodeValue: (entryId: string, value: string) => Promise<DbItem> | DbItem;
}

export interface RedisEntryConfig {
  id: string;
  user?: boolean;
  session?: boolean;
  history?: boolean;
  createdAt?: boolean;
  updatedAt?: boolean;
  ttlSeconds?: number;
}

export type RedisDbInitConfig = RequiredOnlyWhere<RedisDbConfig, 'connectionString'>;

export class RedisDb extends DbPlugin<RedisDbConfig> {
  constructor(config?: RedisDbInitConfig) {
    super(config);
  }

  getDefaultConfig(): RedisDbConfig {
    return {
      ...super.getDefaultConfig(),
      skipTests: true,
      connectionString: '<YOUR-REDIS-URI>',
      keyPrefix: '',
      keySeparator: ':',
      entries: [
        {
          id: 'data',
          ttlSeconds: 0,
          user: true,
          session: true,
          history: true,
          createdAt: true,
          updatedAt: true,
        },
      ],
      onCreateKey: onCreateKey,
      onEncodeValue: onEncodeValue,
      onDecodeValue: onDecodeValue,
    };
  }

  getInitConfig(): RedisDbInitConfig {
    return { connectionString: '<YOUR-REDIS-URI>' };
  }

  async getDbItem(userId: string, jovo: Jovo): Promise<DbItem> {
    let result = {};
    const client = createClient({
      url: this.config.connectionString,
    });

    await client.connect();

    for (const configEntry of this.config.entries) {
      const key = await this.config.onCreateKey(userId, this.config, jovo, configEntry);
      const data = await client.get(key);
      if (data) {
        result = { ...result, ...(await this.config.onDecodeValue(configEntry.id, data)) };
      }
    }

    await client.disconnect();

    return result;
  }

  async loadData(userId: string, jovo: Jovo): Promise<void> {
    const dbItem = await this.getDbItem(userId, jovo);
    if (dbItem) {
      jovo.$user.isNew = false;
      jovo.setPersistableData(dbItem, this.config.storedElements);
    }
  }

  async saveData(userId: string, jovo: Jovo): Promise<void> {
    const data: DbItem = {};
    await this.applyPersistableData(jovo, data);

    const client = createClient({
      url: this.config.connectionString,
    });

    await client.connect();

    const commands = client.multi();

    // include all Redis commands in a single transaction
    for (const configEntry of this.config.entries) {
      const key = await this.config.onCreateKey(userId, this.config, jovo, configEntry);
      const value: DbItem = {};

      if (configEntry.user && data.user) {
        value.user = data.user;
      }

      if (configEntry.session && data.session) {
        value.session = data.session;
      }

      if (configEntry.history && data.history) {
        value.history = data.history;
      }

      if (configEntry.createdAt && data.createdAt) {
        value.createdAt = data.createdAt;
      }

      if (configEntry.updatedAt && data.updatedAt) {
        value.updatedAt = data.updatedAt;
      }

      // set value
      commands.set(key, await this.config.onEncodeValue(configEntry.id, value));

      const ttlSeconds = configEntry.ttlSeconds ?? 0;
      if (ttlSeconds > 0) {
        // set TTL expiration
        commands.expire(key, ttlSeconds);
      }
    }

    // execute the transaction
    await commands.exec();

    await client.disconnect();
  }
}

function onCreateKey(
  userId: string,
  config: RedisDbConfig,
  jovo: Jovo,
  entry: RedisEntryConfig,
): Promise<string> | string {
  const parts: string[] = [];

  if (config.keyPrefix) {
    parts.push(config.keyPrefix);
  }

  parts.push(entry.id);
  parts.push(userId);

  return parts.join(config.keySeparator);
}

function onEncodeValue(_entryId: string, dbItem: DbItem): Promise<string> | string {
  return JSON.stringify(dbItem);
}

function onDecodeValue(_entryId: string, value: string): Promise<DbItem> | DbItem {
  return JSON.parse(value);
}
