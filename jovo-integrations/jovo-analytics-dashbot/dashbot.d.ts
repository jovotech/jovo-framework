declare module 'dashbot' {
  export interface Platform {
    logIncoming(request: object): void;
    logOutgoing(request: object, response: object): void;
  }

  export interface AmazonAlexa extends Platform {}

  export interface Google extends Platform {}

  export interface Universal extends Platform {
    logOutgoing(response: object): void;
  }

  export default function(key: string): {
    alexa: AmazonAlexa,
    google: Google,
    universal: Universal 
  };
}
