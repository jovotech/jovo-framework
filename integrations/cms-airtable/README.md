---
title: 'Airtable CMS Integration'
excerpt: 'The Airtable Jovo integration lets you manage your voice and chatbot content in Airtable.'
---

# Airtable CMS Integration

This [CMS integration](https://v4.jovo.tech/docs/cms) lets you manage your content in Airtable.

## Introduction

[Airtable](https://www.airtable.com/) is a popular spreadsheet-meets-database product that is used for all sorts of use cases.

With this Jovo CMS integration, you can manage all the content of your Jovo app in an Airtable base. This makes collaboration easier and enables you to update and add content faster.

Here is a screenshot of our [sample base](https://airtable.com/shrkniYL5az4MbrXh) that stores [translations](#translationstable) for the [Jovo v4 template](https://github.com/jovotech/jovo-v4-template):

![Airtable CMS for Voice Apps and Chatbots](./img/jovo-cms-sample-airtable.png)

Learn more about setting up Airtable with Jovo in the [installation](#installation) and [configuration](#configuration) sections.

It's possible to use pre-defined table types (like [translations](#TranslationsTable) in the example above) as well as defining your own ones. Learn more in the [table types](#table-types) section.

## Installation

As first step, create an Airtable base with at least one table. Most projects usually contain a [`translations` table](#translationstable) for [i18n](https://v4.jovo.tech/docs/i18n). You can get started by copying our [sample base](https://airtable.com/shrkniYL5az4MbrXh).

Install the plugin like this:

```sh
$ npm install @jovotech/cms-airtable
```

Add it as a plugin to your [app configuration](https://v4.jovo.tech/docs/app-config), for example `app.ts`:

```typescript
import { AirtableCms, TranslationsTable } from '@jovotech/cms-airtable';
// ...

const app = new App({
  plugins: [
    new AirtableCms({
      apiKey: '<YOUR-API-KEY>',
      baseId: '<YOUR-BASE-ID>',
      tables: {
        translations: new TranslationsTable(),
      },
      // ...
    }),
    // ...
  ],
});
```

You need the following for the integration to work:

- `apiKey`: Your Airtable API key. [You can retrieve it in your Airtable account overview](https://airtable.com/account).
- `baseId`: The ID of the Airtable base you are using. [You can retrieve it here](https://airtable.com/api).

All other configuration options can be found in the [configuration section](#configuration).

## Configuration

The following configurations can be added:

```typescript
new AirtableCms({
  apiKey: '<YOUR-API-KEY>',
  baseId: '<YOUR-BASE-ID>',
  caching: true,
  tables: { /* ... */ },
}),
```

- `apiKey`: Your Airtable API key. [You can retrieve it in your Airtable account overview](https://airtable.com/account).
- `baseId`: The ID of the Airtable base you are using. [You can retrieve it here](https://airtable.com/api).
- [`caching`](#caching): Determines whether to caches data for faster response times. `true` by default.
- [`tables`](#tables): Configurations for your different tables.

### caching

The content of all tables is cached by default, meaning that the data is fetched once and then stored for faster response times. However, for some use cases, it might make sense to refresh the data with every request by setting `caching` to `false`.

```typescript
new AirtableCms({
  caching: false,
});
```

### tables

Airtable offers flexible ways to structure your data. This is why the Jovo Airtable CMS integration provides several table types to handle your data, for example:

- [TranslationsTable](#translationstable)
- [KeyValueTable](#keyvaluetable)
- [KeyObjectTable](#keyobjecttable)
- [ObjectArrayTable](#objectarraytable)

You can learn more about those types in the [table types](#table-types) section.

For each table you want to use in your Jovo app, you need to add the table name (for example `translations` in the [sample base](https://airtable.com/shrkniYL5az4MbrXh)) with the corresponding table type and its configuration to the `table` element:

```typescript
import { AirtableCms, KeyObjectTable } from '@jovotech/cms-airtable';
// ...

new AirtableCms({
  tables: {
    yourTable: new KeyObjectTable({
      /* ... */
    }),
  },
});
```

You can access your data inside your handler by accessing `this.$cms`:

```typescript
this.$cms.yourTable;
```

Each table type accepts the following configuration:

```typescript
{
  caching: false,
  order: [],
  selectOptions: {
    // ...
  }
}
```

- `caching`: Determines whether to cache the data for this specific table. `true` by default. [Learn more above](#caching).
- `order`: To ensure that the values we retrieve from the Airtable API are in the correct order, you can specify an array of strings representing the order of columns.
- `selectOptions`: Allows you to specify how the data should be retrieved from your table. [Learn more below](#selectoptions).

#### selectOptions

`selectOptions` allows you to customize the way your data is retrieved from your table. You can specify the following options:

```typescript
{
  fields: [],
  filterByFormula: '',
  sort: [
    {
      field: '',
      direction: 'asc'
    }
  ],
}
```

- `fields`: Specify the fields (columns) that should be retrieved.
- `filterByFormula`: Allows you to apply an Airtable formula used to filter records. [Learn more here](https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference).
- `sort`: An array of objects that specifie how the records of a field will be ordered. Each sort object must have a field key specifying the name of the field to sort on, and an optional direction key that is either "asc" or "desc". The default direction is "asc".

## Table Types

The Jovo Airtable integration comes with a few default table types:

- [TranslationsTable](#TranslationsTable)
- [KeyValueTable](#KeyValueTable)
- [KeyObjectTable](#KeyObjectTable)
- [ObjectArrayTable](#ObjectArrayTable)

You can also learn more about creating your own [custom table types](#custom-table-types).

### TranslationsTable

This table type makes use of the Jovo [i18n](https://v4.jovo.tech/docs/i18n) and allows you to store translation strings in an Airtable table.

```typescript
import { AirtableCms, TranslationsTable } from '@jovotech/cms-airtable';
// ...

new AirtableCms({
  tables: {
    translations: new TranslationsTable({
      /* ... */
    }),
  },
});
```

If you define your table as `TranslationsTable`, the integration expects a table of at least two columns:

- keys, e.g. `welcome` or `bye`
- a locale, such as `en` or `en-US` (you can add as many locale columns as you like)

Here's an example table:

| key     | en           |
| :------ | :----------- |
| welcome | Hello World! |
| bye     | Goodbye!     |

By using this table type, you can access translation strings like this:

```typescript
this.$t('welcome');
```

You can also add [platform specific translations](https://v4.jovo.tech/docs/i18n#platform-specific-translations) by appending a `:` colon followed by the platform name (in camel case) to the locale:

| key     | en           | en:alexa          |
| :------ | :----------- | :---------------- |
| welcome | Hello World! | Hello Alexa user! |
| bye     | Goodbye!     |                   |

Jovo automatically returns the right string depending on the current platform. If a platform specific key is empty, the key from its locale (in the example `en`) is used as a fallback.

### KeyValueTable

`KeyValueTable` expects a table of at least two columns. The first one will be used as keys, the second one as values.

If you define more than two columns, the last one will override the prior ones. In that case we recommend to use [KeyObjectTable](#KeyObjectTable).

```typescript
import { AirtableCms, KeyValueTable } from '@jovotech/cms-airtable';
// ...

new AirtableCms({
  tables: {
    yourTable: new KeyValueTable({
      /* ... */
    }),
  },
});
```

Here's an example table:

| key   | taste |
| :---- | :---- |
| apple | sour  |
| peach | sweet |

And here's the data you will receive:

```typescript
{
  apple: 'sour',
  peach: 'sweet',
}
```

Access the data using:

```typescript
const taste: string = this.$cms.yourTable.apple;
```

### KeyObjectTable

`KeyObjectTable` is an extension of [`KeyValueTable`](#KeyValueTable), but instead of assigning a single value to each key, an object containing the values of all columns is assigned.

```typescript
import { AirtableCms, KeyObjectTable } from '@jovotech/cms-airtable';
// ...

new AirtableCms({
  tables: {
    yourTable: new KeyObjectTable({
      /* ... */
    }),
  },
});
```

Here's an example table:

| key   | taste | color |
| :---- | :---- | :---- |
| apple | sour  | green |
| peach | sweet | red   |

And here's the data you will receive:

```typescript
{
  apple: { taste: 'sour', color: 'green' },
  peach: { taste: 'sweet', color: 'red' },
}
```

Access the data using:

```typescript
const { taste, color } = this.$cms.yourTable.apple;

// Or
this.$cms.yourTable.apple.taste;
```

### ObjectArrayTable

If you define your table as `ObjectArrayTable`, you will receive an array of objects where each row is converted to an object with the first row specifying the keys.

```typescript
import { AirtableCms, ObjectArrayTable } from '@jovotech/cms-airtable';
// ...

new AirtableCms({
  tables: {
    yourTable: new ObjectArrayTable({
      /* ... */
    }),
  },
});
```

Here's an example table:

| key   | taste | color |
| :---- | :---- | :---- |
| apple | sour  | green |
| peach | sweet | red   |

And here's the data you will receive:

```typescript
[
  {
    key: 'apple',
    taste: 'sour',
    color: 'green',
  },
  {
    key: 'peach',
    taste: 'sweet',
    color: 'red',
  },
];
```

Access the data using:

```typescript
const { taste, color } = this.$cms.yourTable[0];

// Or
this.$cms.yourTable[0].taste;
```

### Custom Table Types

If you want to customize how the Airtable CMS integration handles your data, you can build your own table type and use it inside your app configuration.

```typescript
// src/tables/OwnTableType.ts

import { AirtableCmsTable, AirtableCmsTableConfig } from '@jovotech/cms-airtable';

export class OwnTableType extends AirtableCmsTable {
  getDefaultConfig(): AirtableCmsTableConfig {
    return {};
  }

  parse(values: unknown[][]): unknown {
    // Act upon values
    return {
      /* ... */
    };
  }
}
```

You can then integrate your own table type into the Airtable CMS integration:

```typescript
// src/app.ts

new AirtableCms({
  tables: {
    yourTable: new OwnTableType({
      /* ... */
    }),
  },
});
```

The plugin consists of two functions:

- `getDefaultConfig()`: Returns an initial config with default values, which will be merged with the config you pass into the constructor.
- `parse()`: Accepts a two-dimensional array of values, which represents your rows with the respective cells, and can return any data you'd like, which you can then access in your handler with `this.$cms`.

You can also extend the table config:

```typescript
// src/tables/OwnTableType.ts

export interface OwnTableTypeConfig extends AirtableCmsTableConfig {
  configKey: string;
}

export class OwnTableType extends AirtableCmsTable<OwnTableTypeConfig> {
  getDefaultConfig(): OwnTableTypeConfig {
    // ...
  }

  parse(values: unknown[][]): unknown {
    // ...
  }
}
```
