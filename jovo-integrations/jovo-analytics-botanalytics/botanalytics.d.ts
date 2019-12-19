declare module 'botanalytics' {
  export interface Platform {
    log(request: object, response: object): void;
  }

  export interface AmazonAlexa extends Platform {}

  export interface GoogleAssistant extends Platform {}

  export function GoogleAssistant(key: string): GoogleAssistant;

  export function AmazonAlexa(key: string): AmazonAlexa;
}
