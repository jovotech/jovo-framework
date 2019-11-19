export class ValidationError extends Error {
  constructor(public validator: string, public message = '') {
    super(message);
  }
}
