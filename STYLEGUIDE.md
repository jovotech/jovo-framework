

# Conventions

## Jovo specifics

### Naming


#### Project names
To make sure that there are no collisions with naming rules by other platforms we recommend avoiding blanks and special characters in project names.

#### Components
Components can be named as you like. However, we recommend using a comprehensible name with the `Component` suffix.
A component handling `yes` or `no` questions would be named `YesNoComponent`.

#### Handler names in components
In addition to the built-in  handler method names like `LAUNCH`, `START` or `END` the developers can use their own names.

Handling `yes` after a `Do you like Pizza?` question could look like this:

```typescript
@Intents('YesIntent')
lovesPizza() {
  return this.$send({ message: 'Yes! I love pizza, too.' });
}
```

#### Output
As for components, output classes should have a self-explanatory name with an `Output` suffix. 

#### Intents
Intent names defined in `models` files should also end with `intent`. For example `YesIntent`, `NoIntent`

#### Integrations
Class names of integrations are always capital case and come with the specific suffix. A platform class name ends with `Platform` a analytics integration with `Analytics` etc.

Here's a list of the current integration types:

| Integration type      | Example |
| ----------- | ----------- |
| Platform      | AlexaPlatform       |
| Db   | DynamoDb        |
| Analytics   | DashbotAnalytics        |
| Cms   | AirtableCms        |
| Nlu   | DialogflowNlu        |
| Cms   | AirtableCms        |

NPM packages of integrations provided and maintained by the Jovo team have this form: `@jovotech/platform-alexa`. Custom, third party packages should look like this: `@acmeorg/jovo-platform-acme` or `jovo-platform-acme`.

### Tools

Every Jovo repository uses the opinionated code formatter [prettier](https://prettier.io/) and [ESLint](https://eslint.org/) as the default code linter.

#### Prettier rules

```javascript
module.exports = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'consistent',
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
};
```

#### ESLint rules

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  ignorePatterns: ['**/bin/**/*'],
  rules: {
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off',
    ' @typescript-eslint/no-inferrable-types': 'off',
    'no-console': 'warn',
  },
};
```


### Comments
Rather too much than too little! It's not necessary to add a JSDoc for every method.
Any method, variable or line of could that could need cognitive load of anybody who reads the code should be commented.
However, comments should not replace well named variables, methods etc.

* Comments should begin with a capital letter and be written in senential form.
* Please do not push TODO, FIXME tags

### Commit messages

At Jovo we use  [gitmoji](https://gitmoji.dev) to categorize commit messages.

* Use imperative mood
* Keep it short, use description for longer messages (only when necessary)
* Capitalize the subject line

Example:

```shell
git commit -m ':bug: Fix parameter name'
```



