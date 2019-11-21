declare module 'airtable' {
  class Airtable {
    constructor(options?: Airtable.AirtableOptions);
    base(baseId: string): Airtable.Base;
  }
  namespace Airtable {
    interface AirtableOptions {
      apiKey?: string;
      endpointUrl?: string;
      apiVersion?: string;
      allowUnauthorizedSsl?: boolean;
      noRetryIfRateLimited?: boolean;
      requestTimeout?: number;
    }

    interface Base {
      (tableName: string): Table;
    }

    interface Table {
      select(param: object): Query;
    }

    interface Query {
      eachPage(
        pageCallback: (records: object[], fetchNextPage: () => void) => void,
        done: (err: Error) => void,
      ): void;
    }
  }
  export = Airtable;
}
