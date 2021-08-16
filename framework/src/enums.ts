export enum BuiltInHandler {
  Launch = 'LAUNCH',
  Start = 'START',
  End = 'END',
  Unhandled = 'UNHANDLED',
}

export enum RequestType {
  Launch = 'LAUNCH',
  End = 'END',
  Unhandled = 'UNHANDLED',
}

export type RequestTypeLike = RequestType | `${RequestType}` | string;
