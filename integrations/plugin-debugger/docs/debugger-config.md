---
title: 'Debugger Configuration - jovo.debugger.js'
excerpt: 'Learn how you can customize the Jovo Debugger.'
---

# Debugger Configuration

Learn how you can customize the Jovo Debugger using the `jovo.debugger.js` config file.

## Introduction

The Jovo Debugger is a tool that lets you test and review your Jovo app in the browser. Learn more about how you can [connect your Jovo app to the Jovo Debugger here](https://v4.jovo.tech/docs/debugger).

The Debugger configuration can be found in a file called `jovo.debugger.js`. It makes it possible to customize things such as languages and buttons and is passed to the Debugger when the [`run` command](https://v4.jovo.tech/docs/run-command) is executed.

Here is an example:

```js
const { DebuggerConfig } = require('@jovotech/plugin-debugger');

// ...

const debugger = new DebuggerConfig({
  locales: [ 'en' ],
  buttons: [
		{
			label: 'LAUNCH',
			input: {
				type: 'LAUNCH'
			}
		},
		{
			label: 'yes',
			input: {
				intent: 'YesIntent'
			}
		},
    // ...
  ]
});
```

It includes the following properties:

- [`locales`](#locales): An array of strings with supported locales. Default: `en`.
- [`buttons`](#buttons): An array of objects that defines the buttons that can be used in the Debugger.


## locales

The `locales` property defines which locales can be selected in the Debugger:

```js
const debugger = new DebuggerConfig({
  locales: [ 'en', 'de' ],
  // ...
});
```

This configuration only specifies which locales can be selected in the Debugger frontend. It might be possible that you need to update your app configuration to handle additional languages. Take a look at the [Debugger plugin docs](https://v4.jovo.tech/docs/debugger#nlu) to learn more.

## buttons

The `buttons` array defines which input buttons should be displayed in the Debugger.

It's possible to either use `input` or a raw `request`:

```js
const debugger = new DebuggerConfig({
  buttons: [

    // Button with Input
    {
      label: 'yes',
      input: {
        intent: 'YesIntent'
      }
    },

    // Button with Request
    {
      label: 'APL: select item',
      request: require('./requests/apl-select-item')
    },

  ]
  // ...
});
```

The `input` works the same as the [Jovo $input property](https://v4.jovo.tech/docs/input) and can include a `type` with additional elements like `intent` and `entities` (depending on the input type):

```js
{
	label: 'max',
	input: {
		intent: 'MyNameIsIntent',
		entities: {
			name: {
				value: 'max'
			}
		}
	}
},
```

### Sequences

You can run a sequence of interactions by turning either `input` or `request` into an array of objects:

```js
{
	label: 'Welcome Sequence',
	input: [
		{
			type: 'LAUNCH'
		},
		{
			intent: 'YesIntent'
		}
	]
},
```

If you want to mix both `input` and `request` in a sequence, you can use the `sequence` array:

```js
{
	label: 'Welcome Sequence',
	sequence: [
		{
			input: {
				type: 'LAUNCH'
			},
		},
		{
			request: require('./requests/apl-select-item'),
		},
	]
},
```