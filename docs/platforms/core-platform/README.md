# Jovo Core Platform

Learn more about the Jovo Core Platform, which can be used to deploy a voice experiences to custom devices and hardware, including the web, mobile apps, and Raspberry Pi.

## Installation

Install the integration into your project directory.
```sh
npm install jovo-platform-core --save
```

Import the installed module, initialize and add it to the `app` object. 
```javascript
// @language=javascript

// src/app.js
const { CorePlatform } = require('jovo-platform-core');

const corePlatform = new CorePlatform();

app.use(corePlatform);

// @language=typescript

// src/app.ts
import { CorePlatform } from 'jovo-platform-core';

const corePlatform = new CorePlatform();

app.use(corePlatform);
```

## Introduction to Core Platform Specific Features

You can access the `corePlatformApp` object like this:

```javascript
// @language=javascript
this.$corePlatformApp

// @language=typescript
this.$corePlatformApp!
```

The returned object will be an instance of `CorePlatformApp` if the current request is compatible with the Core Platform. Otherwise `undefined` will be returned.

## Output

These sections provide an overview of Core Platform specific features for output. \
For the basic concept, take a look here: [Basic Concepts > Output](../../basic-concepts/output './output').

### Actions and the ActionBuilder

The output of the Core Platform is divided into Actions.
These Actions are sent back with the response and then handled by the client.

#### Action Types

Currently, the following Actions are supported:

##### SpeechAction

The SpeechAction can be used to display text and synthesize text.

##### AudioAction

The AudioAction can be used to play an audio file.

##### VisualAction

The VisualAction can be used for visual output like cards.

##### ProcessingAction

The ProcessingAction can be used to display processing information.

##### CustomAction

The CustomAction can be used to send a custom payload that can be handled by the client.

##### SequenceContainerAction

The SequenceContainer can be used to nest actions. All actions inside this container will be processed after another.

##### ParallelContainerAction

The ParallelContainer can be used to nest actions. All actions inside this container will be processed simultaneously.

##### QuickReplyAction

The QuickReplyAction can be used to display interactive quick-reply buttons.

#### ActionBuilder

`CorePlatformApp` has the properties `$actions` and `$repromptActions`, which are instances of `ActionBuilder`.
The `ActionBuilder` is the recommended way of filling the output for the Core Platform.

Example Usage:

```javascript
// @language=javascript
if (this.$corePlatformApp)
	this.$corePlatformApp.$actions.addSpeech({
		plain: 'text',
		ssml: '<s>text</s>'
	});

// @language=typescript
this.$corePlatformApp?.$actions.addSpeech({
	plain: 'text',
	ssml: '<s>text</s>'
});
```

#### Adding Actions

```javascript
// @language=javascript
if (this.$corePlatformApp)
	this.$corePlatformApp.addActions({
		type: ActionType.Speech,
		plain: 'plainText'
	});

// @language=typescript
this.$corePlatformApp?.addActions({
	type: ActionType.Speech,
	plain: 'plainText'
});
```

#### Setting Actions

```javascript
// @language=javascript
if (this.$corePlatformApp)
	this.$corePlatformApp.setActions(
		this.$actions.addSpeech({ plain: 'text' }).build()
	);

// @language=typescript
this.$corePlatformApp?.setActions(
	this.$actions.addSpeech({ plain: 'text' }).build()
);
```

#### Adding RepromptActions

```javascript
// @language=javascript
if (this.$corePlatformApp)
	this.$corePlatformApp.addRepromptActions({
		type: ActionType.Speech,
		plain: 'plainText'
	});

// @language=typescript
this.$corePlatformApp?.addRepromptActions({
	type: ActionType.Speech,
	plain: 'plainText'
});
```

#### Setting RepromptActions

```javascript
// @language=javascript
if (this.$corePlatformApp)
	this.$corePlatformApp.setRepromptActions(
		this.$repromptActions.addSpeech({ plain: 'text' }).build()
	);

// @language=typescript
this.$corePlatformApp?.setRepromptActions(
	this.$repromptActions.addSpeech({ plain: 'text' }).build()
);
```
