import { PersistableUserData } from '../JovoUser';
import { PersistableSessionData } from '../JovoSession';
import {
  DbPluginConfig,
  JovoAnyFunction,
  JovoHistoryItem,
  StoredElement,
  StoredElementHistory,
} from '../interfaces';
import { Plugin } from '../Plugin';
import { Jovo, JovoPersistableData } from '../Jovo';

export interface DbItem {
  id: string;
  [key: string]: any;

  user?: PersistableUserData;
  session?: PersistableSessionData;
  createdAt?: string;
  updatedAt?: string;
}

export abstract class DbPlugin<
  CONFIG extends DbPluginConfig = DbPluginConfig,
> extends Plugin<CONFIG> {
  isEnabled(persistableProperty: string): boolean {
    for (const prop in this.config.storedElements) {
      if (this.config.storedElements.hasOwnProperty(prop) && prop === persistableProperty) {
        // allow boolean shortcut e.g. {history: true}
        if (
          this.config.storedElements[prop] &&
          typeof this.config.storedElements[prop] === 'boolean'
        ) {
          return !!this.config.storedElements[prop];
        } else if (
          // check property options e.g. {history: {enabled: true, propA:'val1'}
          this.config.storedElements[prop] &&
          typeof this.config.storedElements[prop] === 'object'
        ) {
          return (
            // options implicitly set enabled to true
            !!(this.config.storedElements[prop] as StoredElement) ||
            (this.config.storedElements[prop] as StoredElement).enabled
          );
        }
      }
    }
    return false;
  }

  async applyPersistableData(jovo: Jovo, item: DbItem) {
    const persistableData = jovo.getPersistableData();

    // iterate through persistable data and check for enabled properties
    for (const prop in persistableData) {
      if (persistableData.hasOwnProperty(prop) && this.isEnabled(prop)) {
        if (prop === 'history') {
          // different saving behavior for history elements
          const historyLastItem = jovo.getPersistableHistory();

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
                    newHistoryItem[propHistory] = historyLastItem[propHistory];
                  }
                }
              }
            }
          }
          item[prop] = [newHistoryItem, ...persistableData.history];

          // put latest history item on first position in array
          item[prop] = item[prop].slice(
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
