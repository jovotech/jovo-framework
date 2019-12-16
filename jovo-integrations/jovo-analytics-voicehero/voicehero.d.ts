declare module 'voicehero-sdk' {
  export interface Platform {
    logIncoming(request: object): void;
    logOutgoing(request: object, response: object): void;
  }

  export interface AmazonAlexa extends Platform {}

  export default function(key: string): { alexa: AmazonAlexa };
}
