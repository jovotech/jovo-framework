export class NluData {
  intent?: {
    name: string;
  };
  // tslint:disable-next-line:no-any
  inputs?: Record<string, any>;

  // tslint:disable-next-line:no-any
  [key: string]: any;
}
