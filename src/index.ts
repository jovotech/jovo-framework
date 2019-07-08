//export {GoogleAnalyticsSender} from './GoogleAnalyticsSender';
export {GoogleAnalyticsAlexa} from './GoogleAnalyticsAlexa';
export {GoogleAnalyticsAssistant} from './GoogleAnalyticsAssistant';
export {DeveloperTrackingMethods} from './DeveloperTrackingMethods';

//custom exports
export {VoiceGiftGAnalyticsAlexa} from './VoiceGiftGAnalyticsAlexa';
export {VoiceGiftGAnalyticsAssistant} from './VoiceGiftGAnalyticsAssistant';

//import {GoogleAnalyticsSender} from './GoogleAnalyticsSender';
import { DeveloperTrackingMethods } from './DeveloperTrackingMethods';


declare module 'jovo-core/dist/src/Jovo' {
    export interface Jovo {
        $googleAnalytics? : DeveloperTrackingMethods;
    }
}
