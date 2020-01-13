import { CorePlatformApp } from './core/CorePlatformApp';
import { Action } from './Interfaces';
import { AdaptiveCardOptions } from './response/visuals/AdaptiveCard';

export { CorePlatform } from './CorePlatform';

declare module 'jovo-core/dist/src/core/Jovo' {
  export interface Jovo {
    $corePlatformApp?: CorePlatformApp;

    corePlatformApp(): CorePlatformApp;

    isCorePlatformApp(): boolean;

    action(key: string, value?: any): Jovo;
  }
}

declare module './core/CorePlatformApp' {
  interface CorePlatformApp {
    showAdaptiveCard(options: AdaptiveCardOptions): this;

    showSuggestionChips(chips: string[]): this;
  }
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface Output {
    actions?: Action[];
    text?: {
      speech: string;
      reprompt: string;
    };
    CorePlatform?: {
      SuggestionChips?: string[];
    };
  }
}

export * from './Interfaces';
export { CorePlatformApp } from './core/CorePlatformApp';
export { CorePlatformRequest, CorePlatformInput } from './core/CorePlatformRequest';
export { CorePlatformRequestBuilder } from './core/CorePlatformRequestBuilder';
export { CorePlatformResponse } from './core/CorePlatformResponse';
export { CorePlatformResponseBuilder } from './core/CorePlatformResponseBuilder';
export { CorePlatformSpeechBuilder } from './core/CorePlatformSpeechBuilder';
export { CorePlatformUser } from './core/CorePlatformUser';

export { CorePlatformCore } from './modules/CorePlatformCore';
export { Cards } from './modules/Cards';

export { AdaptiveCard, AdaptiveCardOptions } from './response/visuals/AdaptiveCard';
