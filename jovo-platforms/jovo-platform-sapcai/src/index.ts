import { Handler } from 'jovo-core';
import { SapCaiSkill } from './core/SapCaiSkill';
import { Button, CardContent } from './response';

declare module 'jovo-core/dist/src/Jovo' {
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

declare module 'jovo-core/dist/src/BaseApp' {
  export interface BaseApp {
    setCaiHandler(...handler: Handler[]): this;
  }
}

export const NEW_SESSION_KEY = '__JOVO_NEW_SESSION__';

export { SapCai } from './SapCai';
export * from './core/Interfaces';
export { SapCaiSkill } from './core/SapCaiSkill';
export * from './core/SapCaiRequest';
export * from './core/SapCaiResponse';
export { SapCaiRequestBuilder } from './core/SapCaiRequestBuilder';
export { SapCaiResponseBuilder } from './core/SapCaiResponseBuilder';
export { SapCaiSpeechBuilder } from './core/SapCaiSpeechBuilder';
export { SapCaiUser } from './core/SapCaiUser';

export { SapCaiCore } from './modules/SapCaiCore';
export { SapCaiNLU } from './modules/SapCaiNLU';
export { Cards } from './modules/Cards';

export * from './response';
