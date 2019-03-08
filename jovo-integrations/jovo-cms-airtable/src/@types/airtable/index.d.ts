declare module 'airtable' {
    export = Airtable;
}
declare class Airtable {
    constructor(opt: object);
    Base: Base;
    Table: Table;
    base(baseId: string): Base["baseFn"];
}

declare class Base {
    constructor(airtable: Airtable, baseId: string);
    baseFn(table: string): Table
    table(tableName: string): Table;
}

declare class Table {
    constructor(base: Base, tableId: string, tableName: string);
    select(param: object): Query;
}

declare class Query {
    constructor(table: Table, params: object); 
    eachPage(pageCallback: (records: object[], fetchNextPage: () => void) => void, done: (err: Error) => void): void;
}
