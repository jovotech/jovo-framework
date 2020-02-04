import { Handler } from 'jovo-core';
import { SapCaiSkill } from './core/SapCaiSkill';
import { Button, CardContent } from './response';
import { Config } from './SapCai';

declare module 'jovo-core/dist/src/core/Jovo' {
  export interface Jovo {
    $caiSkill?: SapCaiSkill;

    caiSkill(): SapCaiSkill;

    isCaiSkill(): boolean;
  }
}

declare module './core/SapCaiSkill' {
  interface SapCaiSkill {
    showStandardCard(title: string, subtitle: string, imageUrl: string, buttons: Button[]): this;

    showQuickReplyCard(title: string, buttons: Button[]): this;

    showButtonsCard(title: string, buttons: Button[]): this;

    showCarouselCard(items: CardContent[]): this;

    showListCard(elements: CardContent[], buttons: Button[]): this;

    showPictureCard(pictureUrl: string): this;

    // Not supported at the moment
    //showVideo(videoUrl: string): this;
  }
}

declare module 'jovo-core/dist/src/core/BaseApp' {
  export interface BaseApp {
    setCaiHandler(...handler: Handler[]): this;
  }
}

export const NEW_SESSION_KEY = '__JOVO_NEW_SESSION__';

export { SapCai, Config } from './SapCai';
export * from './core/Interfaces';
export { SapCaiSkill } from './core/SapCaiSkill';
export * from './core/SapCaiRequest';
export * from './core/SapCaiResponse';
export { SapCaiRequestBuilder } from './core/SapCaiRequestBuilder';
export { SapCaiResponseBuilder } from './core/SapCaiResponseBuilder';
export { SapCaiSpeechBuilder } from './core/SapCaiSpeechBuilder';
export { SapCaiUser } from './core/SapCaiUser';

export { SapCaiCore } from './modules/SapCaiCore';
export { SapCaiNlu } from './modules/SapCaiNlu';
export { Cards } from './modules/Cards';

export * from './response';

interface AppSapCaiConfig {
  SapCai?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
  export interface AppPlatformConfig extends AppSapCaiConfig {}
  export interface ExtensiblePluginConfigs extends AppSapCaiConfig {}
}
