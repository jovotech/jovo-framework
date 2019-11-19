export class GoogleActionAPIError extends Error {
  static ERROR = 'ERROR';
  static PARSE_ERROR = 'PARSE_ERROR';

  code: string;
  constructor(message: string, code = GoogleActionAPIError.ERROR) {
    super(message);
    this.code = code;
  }
}
