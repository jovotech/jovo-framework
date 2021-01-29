import { App } from '../../App';
import { InternalIntent } from '../../enums';
import { HandleRequest } from '../../HandleRequest';
import { Jovo } from '../../Jovo';
import { Plugin, PluginConfig } from '../../Plugin';
import { HandlerMetadata } from '../handler/metadata/HandlerMetadata';
import { MetadataStorage } from '../handler/metadata/MetadataStorage';
import { DuplicateGlobalIntentsError } from '../../errors/DuplicateGlobalIntentsError';

export interface RouterPluginConfig extends PluginConfig {}

declare module '../../Extensible' {
  interface ExtensiblePluginConfig {
    RouterPlugin?: RouterPluginConfig;
  }

  interface ExtensiblePlugins {
    RouterPlugin?: RouterPlugin;
  }
}

export class RouterPlugin extends Plugin<RouterPluginConfig> {
  getDefaultConfig() {
    return {};
  }

  async initialize(app: App): Promise<void> {
    return this.checkForDuplicateGlobalHandlers();
  }

  mount(handleRequest: HandleRequest): Promise<void> | void {
    handleRequest.middlewareCollection.get('dialog.logic')?.use(this.handle);
    return;
  }

  private async checkForDuplicateGlobalHandlers(): Promise<void> {
    const handlerMetadata = MetadataStorage.getInstance().handlerMetadata;
    const globalIntentHandlerMap: Record<string, HandlerMetadata[]> = {};
    for (let i = 0, len = handlerMetadata.length; i < len; i++) {
      for (let j = 0, jLen = handlerMetadata[i].globalIntentNames.length; j < jLen; j++) {
        const globalIntentName = handlerMetadata[i].globalIntentNames[j];
        if (!globalIntentHandlerMap[globalIntentName]) {
          globalIntentHandlerMap[globalIntentName] = [];
        }
        globalIntentHandlerMap[globalIntentName].push(handlerMetadata[i]);
      }
    }
    const duplicateIntentEntries = Object.entries(globalIntentHandlerMap).filter(
      ([, handlers]) => handlers.length > 1,
    );
    if (duplicateIntentEntries.length) {
      throw new DuplicateGlobalIntentsError(duplicateIntentEntries);
    }
  }

  private async handle(handleRequest: HandleRequest, jovo: Jovo) {
    const handlerMetadata = MetadataStorage.getInstance().handlerMetadata;

    // TODO implement handling of jovo.$type

    const intentName = jovo.$request.getIntentName();
    if (!intentName) {
      // TODO determine what to do if no intent was passed (maybe UNHANDLED)
      // in the future other data can be passed and used by the handler, but for now just use the intent-name
      return;
    }

    if (!jovo.state) {
      let relatedGlobalHandler = handlerMetadata.find((metadata) =>
        metadata.globalIntentNames.includes(intentName),
      );
      if (!relatedGlobalHandler) {
        relatedGlobalHandler = handlerMetadata.find((metadata) =>
          metadata.globalIntentNames.includes(InternalIntent.Unhandled),
        );
      }
      if (!relatedGlobalHandler) {
        // TODO improve error
        throw new Error('No related handler was found');
      }

      console.log('setting route', relatedGlobalHandler);
    } else {
      console.log('state set', jovo.state);
    }
  }
}
