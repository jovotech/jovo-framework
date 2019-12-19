export class ApiError extends Error {
  static PARSE_ERROR = 'PARSE_ERROR';
  static ACCESS_NOT_REQUESTED = 'ACCESS_NOT_REQUESTED';
  static NO_USER_PERMISSION = 'NO_USER_PERMISSION';
  static NO_SKILL_PERMISSION = 'NO_SKILL_PERMISSION';
  static LIST_NOT_FOUND = 'LIST_NOT_FOUND';
  static ITEM_NOT_FOUND = 'ITEM_NOT_FOUND';
  static ERROR = 'ERROR';

  code: string;
  constructor(message: string, code = ApiError.ERROR) {
    super(message);
    this.code = code;
  }
}
