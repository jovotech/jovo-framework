export { GoogleAnalyticsAlexa } from './GoogleAnalyticsAlexa';
export { GoogleAnalyticsAssistant } from './GoogleAnalyticsAssistant';
export { DeveloperTrackingMethods } from './DeveloperTrackingMethods';
export { VoiceGiftGAnalyticsAlexa } from './VoiceGiftGAnalyticsAlexa';
export { VoiceGiftGAnalyticsAssistant } from './VoiceGiftGAnalyticsAssistant';
import { DeveloperTrackingMethods } from './DeveloperTrackingMethods';
declare module 'jovo-core/dist/src/Jovo' {
    interface Jovo {
        $googleAnalytics?: DeveloperTrackingMethods;
    }
}
