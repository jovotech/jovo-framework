import {
  App,
  DbPluginStoredElementsConfig,
  EntityMap,
  HandleRequest,
  Jovo,
  JovoPersistableData,
} from '@jovotech/framework';
import { GoogleAssistantDevice } from './GoogleAssistantDevice';
import { GoogleAssistantPlatform } from './GoogleAssistantPlatform';
import { GoogleAssistantRequest } from './GoogleAssistantRequest';
import { GoogleAssistantResponse } from './GoogleAssistantResponse';
import { GoogleAssistantUser } from './GoogleAssistantUser';
import { GoogleAssistantEntity } from './interfaces';

export class GoogleAssistant extends Jovo<
  GoogleAssistantRequest,
  GoogleAssistantResponse,
  GoogleAssistant,
  GoogleAssistantUser,
  GoogleAssistantDevice,
  GoogleAssistantPlatform
> {
  $entities!: EntityMap<GoogleAssistantEntity>;

  constructor($app: App, $handleRequest: HandleRequest, $platform: GoogleAssistantPlatform) {
    super($app, $handleRequest, $platform);
    if (this.$request.session?.params?._GOOGLE_ASSISTANT_REPROMPTS_) {
      this.$session._GOOGLE_ASSISTANT_REPROMPTS_ =
        this.$request.session.params._GOOGLE_ASSISTANT_REPROMPTS_;
    }
  }

  getPersistableData(): JovoPersistableData {
    const persistableData = super.getPersistableData();
    if (persistableData.session) {
      persistableData.session._GOOGLE_ASSISTANT_REPROMPTS_ =
        this.$session._GOOGLE_ASSISTANT_REPROMPTS_;
    }
    return persistableData;
  }

  setPersistableData(data: JovoPersistableData, config?: DbPluginStoredElementsConfig): void {
    super.setPersistableData(data, config);
    if ((typeof config?.session === 'object' && config.session.enabled) || config?.session) {
      if (data.session?._GOOGLE_ASSISTANT_REPROMPTS_) {
        this.$session._GOOGLE_ASSISTANT_REPROMPTS_ = data.session?._GOOGLE_ASSISTANT_REPROMPTS_;
      }
    }
  }
}
