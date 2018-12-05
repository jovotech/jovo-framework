declare module 'botanalytics' {
    export interface Platform {
        log(request: object, response: object): void;
    }

    // export interface AmazonAlexa extends Platform {
    // }

    export interface Google extends Platform {
    }

    interface AmazonAlexa {
        log(request: object, response: object): void;
    }

    // export default function (key: string): { AmazonAlexa: AmazonAlexa, google: Google };
}
