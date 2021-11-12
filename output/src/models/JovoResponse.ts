export abstract class JovoResponse {
  [key: string]: unknown;

  abstract hasSessionEnded(): boolean;
}
