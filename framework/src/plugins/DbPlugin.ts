import { AnyObject } from '@jovotech/common';
import { HandleRequest, InvalidParentError } from '..';
import { ExtensibleInitConfig } from '../Extensible';
import {
  DbPluginConfig,
  JovoAnyFunction,
  StoredElement,
  StoredElementHistory,
} from '../interfaces';
import { Jovo, JovoPersistableData } from '../Jovo';
import { JovoHistoryItem, PersistableHistoryData } from '../JovoHistory';
import { PersistableSessionData } from '../JovoSession';
import { PersistableUserData } from '../JovoUser';
import { Plugin, PluginConfig } from '../Plugin';

export const DEFAULT_SESSION_EXPIRES_AFTER_SECONDS = 900;

export interface DbItem extends AnyObject {
  id?: string;

  user?: PersistableUserData;
  session?: PersistableSessionData;
  history?: PersistableHistoryData;
  createdAt?: string;
  updatedAt?: string;
}

export abstract class DbPlugin<
  CONFIG extends DbPluginConfig = DbPluginConfig,
> extends Plugin<CONFIG> {
  constructor(config?: ExtensibleInitConfig<CONFIG>) {
    super(config);

    for (const prop in this.config.storedElements) {
      if (this.config.storedElements.hasOwnProperty(prop)) {
        if (
          this.config.storedElements[prop] &&
          typeof this.config.storedElements[prop] === 'boolean'
        ) {
          this.config.storedElements[prop] = {
            enabled: this.config.storedElements[prop],
          };
        }
        if (
          this.config.storedElements[prop] &&
          typeof this.config.storedElements[prop] === 'object' &&
          typeof (this.config.storedElements[prop] as PluginConfig).enabled === 'undefined'
        ) {
          (this.config.storedElements[prop] as StoredElement).enabled = true;
        }
      }
    }
  }

  getDefaultConfig(): CONFIG {
    return {
      enabled: true,
      storedElements: {
        user: {
          enabled: true,
        },
        session: {
          enabled: false,
          expiresAfterSeconds: DEFAULT_SESSION_EXPIRES_AFTER_SECONDS,
        },
        history: {
          size: 3,
          enabled: false,
          output: true,
          nlu: true,
          asr: false,
          state: false,
          request: false,
          response: false,
        },
        createdAt: true,
        updatedAt: true,
      },
    } as DbPluginConfig as CONFIG;
  }

  mount(parent: HandleRequest): void {
    if (!(parent instanceof HandleRequest)) {
      throw new InvalidParentError(this.name, HandleRequest);
    }

    parent.middlewareCollection.use('request.end', (jovo) => {
      if (!jovo.$user.id) {
        return;
      }
      return this.loadData(jovo.$user.id, jovo);
    });
    parent.middlewareCollection.use('response.start', (jovo) => {
      if (!jovo.$user.id) {
        return;
      }
      return this.saveData(jovo.$user.id, jovo);
    });
  }

  abstract loadData(userId: string, jovo: Jovo): Promise<void>;
  abstract saveData(userId: string, jovo: Jovo): Promise<void>;

  async applyPersistableData(jovo: Jovo, item: DbItem): Promise<void> {
    const persistableData = jovo.getPersistableData();
    // iterate through persistable data and check for enabled properties
    for (const prop in persistableData) {
      if (
        persistableData.hasOwnProperty(prop) &&
        (this.config.storedElements?.[prop] === true ||
          (this.config.storedElements?.[prop] as StoredElement).enabled)
      ) {
        if (prop === 'history') {
          // different saving behavior for history elements
          const historyLastItem = jovo.getCurrentHistoryItem();

          const newHistoryItem: JovoHistoryItem = {};

          if (
            this.config.storedElements?.history &&
            typeof this.config.storedElements?.history === 'object'
          ) {
            // iterate through history properties, skip reserved properties
            for (const propHistory in this.config.storedElements?.history as StoredElementHistory) {
              const reservedPropertyNames = ['size', 'enabled'];

              if (this.config.storedElements?.history.hasOwnProperty(propHistory)) {
                if (reservedPropertyNames.includes(propHistory)) {
                  continue;
                }

                if (this.config.storedElements?.history[propHistory]) {
                  // check for custom stored history elements with access functions
                  if (typeof this.config.storedElements?.history[propHistory] === 'function') {
                    const func = this.config.storedElements?.history[
                      propHistory
                    ] as JovoAnyFunction;
                    newHistoryItem[propHistory] = await func(jovo);
                  } else {
                    // default history item like nlu, output etc
                    newHistoryItem[propHistory] = historyLastItem![propHistory];
                  }
                }
              }
            }
          }
          // put latest history item on first position in array
          item[prop] = {
            items: [newHistoryItem].concat(persistableData.history!.items),
          };

          // remove trailing history items
          item[prop]!.items = item[prop]!.items.slice(
            0,
            (this.config.storedElements?.history as StoredElementHistory).size,
          );
        } else {
          item[prop] = persistableData[prop as keyof JovoPersistableData];
        }
      }
    }
  }
}
