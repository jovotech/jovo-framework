export abstract class JovoResponse {
  [key: string]: unknown;

  abstract hasSessionEnded(): boolean;

  getSpeech?(): string | undefined;
  setSpeech?(speech: string): void;
  getReprompt?(): string | undefined;
  setReprompt?(reprompt: string): void;
}
