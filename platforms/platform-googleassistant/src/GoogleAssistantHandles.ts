import { HandleOptions, InputType, Jovo } from '@jovotech/framework';
import { GoogleAssistantRequest } from './GoogleAssistantRequest';

export class GoogleAssistantHandles {
  static onScene(sceneName: string): HandleOptions {
    return {
      types: [InputType.Intent],
      platforms: ['googleAssistant'],
      if: (jovo: Jovo) => (jovo.$request as GoogleAssistantRequest).scene?.name === sceneName,
    };
  }
}
