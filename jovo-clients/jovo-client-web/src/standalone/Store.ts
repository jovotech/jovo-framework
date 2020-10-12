import _defaults from 'lodash.defaults';
import uuidV4 from 'uuid/v4'; //tslint:disable-line
import { DeepPartial } from '../types';

export type Data = Record<string, any>;

export interface SessionData {
  id: string;
  data: Data;
  new: boolean;
  lastUpdatedAt: number;
}

export interface UserData {
  id: string;
  data: Data;
}

export interface PersistedData {
  user: UserData;
  session?: SessionData;
}

export interface StoreConfig {
  storageKey: string;
  shouldPersistSession: boolean;
  sessionExpirationInSeconds: number;
}

// TODO Could be improved/changed
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
  sessionData!: SessionData;
  userData!: UserData;

  constructor(config?: DeepPartial<StoreConfig>) {
    const defaultConfig = Store.getDefaultConfig();
    this.config = config ? _defaults(config, defaultConfig) : defaultConfig;
    this.load();
  }

  resetSession() {
    this.sessionData = this.newSessionData();
  }

  load() {
    const rawPersistedData = localStorage.getItem(this.config.storageKey) || '{}';
    const persistedData: Partial<PersistedData> = JSON.parse(rawPersistedData);

    const defaultUserData: UserData = {
      id: uuidV4(),
      data: {},
    };
    this.userData = _defaults(persistedData.user, defaultUserData);

    const defaultSessionData: SessionData = this.newSessionData();
    const sessionExpirationDate = persistedData.session?.lastUpdatedAt
      ? this.config.sessionExpirationInSeconds * 1000 + persistedData.session.lastUpdatedAt
      : undefined;
    const isExpired = sessionExpirationDate && sessionExpirationDate < new Date().getTime();
    this.sessionData = isExpired
      ? defaultSessionData
      : _defaults(persistedData.session, defaultSessionData);
  }

  save() {
    const persistedData: Partial<PersistedData> = {
      user: this.userData,
      session: this.config.shouldPersistSession ? this.sessionData : undefined,
    };
    localStorage.setItem(this.config.storageKey, JSON.stringify(persistedData));
  }

  private newSessionData(): SessionData {
    return {
      id: uuidV4(),
      data: {},
      new: true,
      lastUpdatedAt: new Date().getTime(),
    };
  }
}
