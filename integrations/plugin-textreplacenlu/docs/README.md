---
title: 'Text Replace NLU Plugin'
excerpt: 'Replace input text for all matches of a search value (string or RegExp) based on rules as an NLU preprocessor.'
url: 'https://www.jovo.tech/marketplace/plugin-textreplacenlu'
---

# Text Replace NLU Plugin

Replace input text for all matches of a search value (string or RegExp) based on rules as an NLU preprocessor.

## Introduction

This plugin is a preprocessor for your [NLU integration](https://www.jovo.tech/docs/nlu) that replaces text in the input string. This can be used to:

- Correct input misunderstandings from your [ASR integration](https://www.jovo.tech/docs/asr)
- Preprocess text before another NLU plugin executes
- To simplify some scenarios when used before [Keyword NLU Plugin](https://www.jovo.tech/marketplace/plugin-keywordnlu)

The plugin uses a `replaceRule` array that looks like this:

```typescript
[
  {
    locales: ['en'],
    searchValue: 'world',
    replaceValue: 'jovo',
  },
  {
    locales: ['en'],
    searchValue: 'WORLD',
    replaceValue: 'jovo',
    isRegex: true,
    regexFlags: 'gi',
  },
  {
    locales: ['en'],
    searchValue: '(\\d+)(LBS)', // escape the regex value
    replaceValue: '$1 pounds', // special replace pattern
    isRegex: true,
    regexFlags: 'g',
  },
];
```

If the input contains `text` that matches the `searchValue` for one or more rules in the replace rule array, all matches are replaced with the `replaceValue`. The `searchValue` can be a string or RegExp and the `replaceValue` can be a regular string or a string that includes [special replacement patterns](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_the_replacement). 

Text Replace NLU modifies the `$input.text` value. 

Here's an example:

```typescript
// Before Text Replace NLU
{
  type: 'TEXT',
  text: 'hello world',
}

// After Text Replace NLU
{
  type: 'TEXT',
  text: 'hello jovo',
}
```

The Text Replace NLU plugin hooks into the `before.interpretation.nlu` [RIDR middleware](https://www.jovo.tech/docs/middlewares#ridr-middlewares), which means it happens one step before other [NLU integrations](https://www.jovo.tech/docs/nlu). If more than one plugin hooks into `before.interpretation.nlu`, they are processed in the order listed in the `plugins` array.

You can find the code here: [`TextReplaceNluPlugin`](https://github.com/jovotech/jovo-framework/blob/v4/latest/integrations/plugin-textreplacenlu/src/TextReplaceNluPlugin.ts).

Learn more in the following sections:

- [Installation](#installation)
- [Configuration](#configuration)

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/plugin-textreplacenlu
```

Add it as a plugin to your [app configuration](https://www.jovo.tech/docs/app-config), e.g. `app.ts`:

```typescript
import { App, Jovo } from '@jovotech/framework';
import { TextReplaceNluPlugin } from '@jovotech/plugin-textreplacenlu';
// ...

const app = new App({
  plugins: [
    new TextReplaceNluPlugin({
      onGetReplaceRules: (jovo: Jovo) => {
        return [
          {
            locales: ['en'],
            searchValue: 'world',
            replaceValue: 'jovo',
          },
          {
            locales: ['en'],
            searchValue: 'WORLD',
            replaceValue: 'jovo',
            isRegex: true,
            regexFlags: 'gi',
          },
          {
            locales: ['en'],
            searchValue: '(\\d+)(LBS)',
            replaceValue: '$1 pounds',
            isRegex: true,
            regexFlags: 'g',
          },
        ];
      },
    }),
    // ...
  ],
});
```

Learn more about config options in the [configuration](#configuration) section.

## Configuration

The following configuration can be added to the Text Replace NLU plugin:

```typescript
new TextReplaceNluPlugin({
  onGetReplaceRules: (jovo: Jovo) => { return [] },
  onReplaceAll: (jovo: Jovo, locale: string, replaceRules: ReplaceRule[], text: string) => { return text },
  fallbackLocale: 'en',
}),
```

- `onGetReplaceRules`: A function that returns an array of `ReplaceRule` entries. If you don't set this function, an empty array will be returned. The simple case is returning an array of rules. This is a function to allow for dynamic loading of the replace rules.

  A rule is made of the following properties:

  ```typescript
  export interface ReplaceRule {
    locales: string[];
    searchValue: string;
    replaceValue: string;
    isRegex?: boolean;
    regexFlags?: string;
  }
  ```
  
  - `locales` (required) - an array of locales (ex: `['en', 'en-US']`). The replace rule is only executed if the request locale matches one value in the list.
  
  - `searchValue` (required) - if `isRegex` is `false`, a string to check if it is found in `this.$input.text`; otherwise a regex string (not literal) to pass to the RegExp constructor to make a regular expression. Make sure to properly escape regex string values.

  - `replaceValue` (required) - the string value to replace all matched `searchValue` items found. If `searchValue` is a RegExp, the string can contain [special replacement patterns](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_the_replacement). 

  - `isRegex` (optional) - Default is `false`. Determines if `searchValue` is a string or RegExp.

  - `regexFlags` (optional) - Default is `g`. Possible [RegExp flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags) include `g` and `i`. If you set this value, it must include at least `g`.

- `onReplaceAll`: An optional function to iterate through the replace rules and modify the input text. There is a default implementation or you can override with your own logic.
- `fallbackLocale`: The locale to be used if the request does not contain one. Default: `en`.
