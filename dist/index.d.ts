export { GoogleAnalyticsSender } from './GoogleAnalyticsSender';
export { HappyMealGAnalyticsSender } from './HappyMealGAnalyticsSender';
import { GoogleAnalyticsSender } from './GoogleAnalyticsSender';
declare module 'jovo-core/dist/src/Jovo' {
    interface Jovo {
        $analytics?: GoogleAnalyticsSender;
    }
}
