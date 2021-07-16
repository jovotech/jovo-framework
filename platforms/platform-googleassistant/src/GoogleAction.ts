import {
  App,
  DbPluginStoredElementsConfig,
  HandleRequest,
  Jovo,
  JovoPersistableData,
  Platform,
} from '@jovotech/framework';
import { GoogleAssistantResponse } from '@jovotech/output-googleassistant';
import { GoogleAssistantRequest } from './GoogleAssistantRequest';

export class GoogleAction extends Jovo<GoogleAssistantRequest, GoogleAssistantResponse> {
  constructor(
    $app: App,
    $handleRequest: HandleRequest,
    $platform: Platform<GoogleAssistantRequest, GoogleAssistantResponse, any, any>,
  ) {
    super($app, $handleRequest, $platform);
    if (this.$request.session?.params?._GA_REPROMPTS_) {
      this.$session._GA_REPROMPTS_ = this.$request.session.params._GA_REPROMPTS_;
    }
  }

  getPersistableData(): JovoPersistableData {
    const persistableData = super.getPersistableData();
    if (persistableData.session) {
      persistableData.session._GA_REPROMPTS_ = this.$session._GA_REPROMPTS_;
    }
    return persistableData;
  }

  setPersistableData(data: JovoPersistableData, config?: DbPluginStoredElementsConfig) {
    super.setPersistableData(data, config);
    if ((typeof config?.session === 'object' && config.session.enabled) || config?.session) {
      if (data.session?._GA_REPROMPTS_) {
        this.$session._GA_REPROMPTS_ = data.session?._GA_REPROMPTS_;
      }
    }
  }
}
