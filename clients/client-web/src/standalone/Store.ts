import { Session, User } from '@jovotech/platform-core';
import _defaultsDeep from 'lodash.defaultsdeep';
import { v4 as uuidV4 } from 'uuid';
import { DeepPartial } from '..';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Data = Record<string, any>;

export interface PersistedData {
  user: User;
  session?: Session;
}

export interface StoreConfig {
  storageKey: string;
  shouldPersistSession: boolean;
  sessionExpirationInSeconds: number;
}

export class Store {
  static getDefaultConfig(): StoreConfig {
    return {
      storageKey: 'JOVO_WEB_CLIENT_DATA',
      shouldPersistSession: true,
      sessionExpirationInSeconds: 1800,
    };
  }

  readonly config: StoreConfig;

  data: Data = {};
  sessionData!: Session;
  userData!: User;

  constructor(config?: DeepPartial<StoreConfig>) {
    const defaultConfig = Store.getDefaultConfig();
    this.config = config ? _defaultsDeep(config, defaultConfig) : defaultConfig;
    this.load();
  }

  resetSession(): void {
    this.sessionData = this.newSessionData();
  }

  load(): void {
    const rawPersistedData = localStorage.getItem(this.config.storageKey) || '{}';
    const persistedData: Partial<PersistedData> = JSON.parse(rawPersistedData);

    const defaultUserData: User = {
      id: uuidV4(),
      data: {},
    };
    this.userData = _defaultsDeep(persistedData.user, defaultUserData);

    const defaultSessionData = this.newSessionData();
    const sessionExpirationDate = persistedData.session?.lastUpdatedAt
      ? this.config.sessionExpirationInSeconds * 1000 +
        new Date(persistedData.session.updatedAt).getTime()
      : undefined;
    const isExpired = sessionExpirationDate && sessionExpirationDate < new Date().getTime();
    this.sessionData = isExpired
      ? defaultSessionData
      : _defaultsDeep(persistedData.session, defaultSessionData);
  }

  save(): void {
    const persistedData: Partial<PersistedData> = {
      user: this.userData,
      session: this.config.shouldPersistSession ? this.sessionData : undefined,
    };
    localStorage.setItem(this.config.storageKey, JSON.stringify(persistedData));
  }

  private newSessionData(): Session {
    return {
      id: uuidV4(),
      data: {},
      state: [],
      isNew: true,
      updatedAt: new Date(),
    };
  }
}
