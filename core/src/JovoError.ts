export class JovoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JovoError';
  }
}
