export {AmazonPollyTts} from './AmazonPollyTts';
export * from './Interfaces';

declare module 'jovo-core/dist/src/Interfaces' {
    interface TellOutput {
        speechText?: string;
    }

    interface AskOutput {
        speechText?: string;
        repromptText?: string;
    }
}
