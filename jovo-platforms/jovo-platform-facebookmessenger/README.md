# Facebook Messenger Platform Integration

> To view this page on the Jovo website, visit https://www.jovo.tech/marketplace/jovo-platform-facebookmessenger

Learn more about the Facebook Messenger Platform and its platform-specific features that can be used with the Jovo Framework.

* [Installation](#installation)
* [Configurations](#configurations)
   * [Automatically set greeting-text](#automatically-set-greeting-text)
   * [Automatically set launch-payload](#automatically-set-launch-payload)
* [Introduction to Messenger specific features](#introduction-to-messenger-specific-features)
* [Output](#output)
   * [No Reprompts](#no-reprompts)
   * [Multiple Messages](#multiple-messages)
   * [Overwrite default-output](#overwrite-default-output)
   * [Sending Text](#sending-text)
   * [Sending Quick Replies](#sending-quick-replies)
   * [Sending Attachments](#sending-attachments)
   

## Installation

Install the module:

```sh
npm install jovo-platform-facebookmessenger --save
```

Import the installed module, initialize and add it to the `app` object:

```javascript
// @language=javascript

// src/app.js
const { FacebookMessenger } = require('jovo-platform-facebookmessenger');

app.use(new FacebookMessenger());

// @language=typescript

// src/app.ts
import { FacebookMessenger } from 'jovo-platform-facebookmessenger';

app.use(new FacebookMessenger());
```

Configure the module:

```javascript
// @language=javascript

// src/app.js
module.exports = {
	platform: {
		FacebookMessenger: {
			pageAccessToken: 'yourPageAccessToken',
			verifyToken: 'yourVerifyToken',
			locale: 'yourLocale'
		}
	}
};

// @language=typescript

// src/app.ts
export = {
	platform: {
		FacebookMessenger: {
			pageAccessToken: 'yourPageAccessToken',
			verifyToken: 'yourVerifyToken',
			locale: 'yourLocale'
		}
	}
};
```

## Configurations

### Automatically set greeting-text

To set the greeting-text on startup you have to set the following configuration:

```javascript
// @language=javascript

// src/config.js

module.exports = {
	platform: {
		FacebookMessenger: {
			greeting: {
				updateOnSetup: true,
				data: [
					{ locale: 'en-US', text: 'Get Started' },
					{ locale: 'de-DE', text: 'Loslegen' }
				]
			}
		}
	}
};

// @language=typescript

// src/config.ts

export = {
	platform: {
		FacebookMessenger: {
			greeting: {
				updateOnSetup: true,
				data: [
					{ locale: 'en-US', text: 'Get Started' },
					{ locale: 'de-DE', text: 'Loslegen' }
				]
			}
		}
	}
};
```

### Automatically set launch-payload

To set the launch-payload on startup you have to set the following configuration:

```javascript
// @language=javascript

// src/config.js

module.exports = {
	platform: {
		FacebookMessenger: {
			launch: {
        		updateOnSetup: true,
        		data: 'someLaunchPayload'
        	}
		}
	}
};

// @language=typescript

// src/config.ts

export = {
	platform: {
		FacebookMessenger: {
			launch: {
				updateOnSetup: true,
            	data: 'someLaunchPayload'
			}
		}
	}
};
```

### Automatically set persistent menu

To set the persistent menu payload on startup you have to set the following configuration:

```javascript
// @language=javascript

// src/config.js

module.exports = {
	platform: {
		FacebookMessenger: {
			persistentMenu: {
        		updateOnSetup: true,
        		data: [{
					locale:"default",
					composer_input_disabled:false,
					call_to_actions: [{
						type:"postback",
						title:"HelloWorld",
						payload:"HelloWorldIntent"
					}]
				}]
        	}
		}
	}
};

// @language=typescript

// src/config.ts

export = {
	platform: {
		FacebookMessenger: {
			persistentMenu: {
				updateOnSetup: true,
            	data: [{
					locale:"default",
					composer_input_disabled:false,
					call_to_actions: [{
						type: PersistentMenuItemType.Postback,
						title:"HelloWorld",
						payload:"HelloWorldIntent"
					}]
				}]
			}
		}
	}
};
```

### Disable synchronous response
By default, `tell` and `ask` generate a message that will be sent shortly before responding to the initial request.
As a consequence, this message will **always** be the **last** message sent.

If you do not like this behavior, you can disable it by setting the `shouldIgnoreSynchronousResponse`-property to `true` in the configuration: 

```javascript
// @language=javascript

// src/config.js

module.exports = {
	platform: {
		FacebookMessenger: {
			shouldIgnoreSynchronousResponse: true
		}
	}
};

// @language=typescript

// src/config.ts

export = {
	platform: {
		FacebookMessenger: {
			shouldIgnoreSynchronousResponse: true
		}
	}
};
```

## Introduction to Messenger Specific Features

You can access the `messengerBot` object like this:

```javascript
// @language=javascript

this.$messengerBot

// @language=typescript

this.$messengerBot!
```

The returned object will be an instance of `MessengerBot` if the current request comes from Facebook Messenger. Otherwise `undefined` will be returned.

## Output

These sections provide an overview of Facebook Messenger specific features for output.
For the basic concept, take a look here: [Docs: Basic Concepts > Output](https://www.jovo.tech/docs/output).

### No Reprompts

Facebook Messenger does not support reprompts. Any reprompt passed to `ask` will be ignored.

### Asynchronous Responses

Facebook Messenger allows sending multiple messages asynchronously. 

All asynchronous methods for sending messages return a `AxiosResponse`. It is recommended to wrap these call in a `try-catch`-block to catch possible errors thrown by the API. 

> **INFO**: The message that results from calling `tell` or `ask` will be the last message sent! This behavior can be disabled, read more [here](#Disable-synchronous-response).

You can read more about sending messages [here](https://developers.facebook.com/docs/messenger-platform/send-messages).

### Overwrite default-output

The speech of `tell` and `ask` can be overwritten:

```javascript
// @language=javascript

if (this.$messengerBot) this.$messengerBot.setText('someNewText');

// @language=typescript

this.$messengerBot?.setText('someNewText');
```

Additionally, quick-replies can be overwritten and added:

```javascript
// @language=javascript

if (this.$messengerBot) {
	this.$messengerBot.setQuickReplies([
		new TextQuickReply('someQuickReplyText')
	]);
	this.$messengerBot.addQuickReply('test');
}

// @language=typescript

this.$messengerBot
	?.setQuickReplies([new TextQuickReply('someQuickReplyText')])
	.addQuickReply('test');
```

### Sending Text

The following example shows how to send a text-message:

```javascript
// @language=javascript
if (this.$messengerBot) await this.$messengerBot.showText({ text: 'text' });

// @language=typescript
await this.$messengerBot?.showText({ text: 'text' });
```

> **INFO**: The message that was created by calling `tell` or `ask` will **always** be the **last** message to be displayed. Even if the `showText`-method was called after. Read more about disabling that behavior [here](#Disable-synchronous-response).

#### Text Message Options

When calling the `text`-method an object with the following properties can be passed:

| property     | type                                  | description                                                              |
| ------------ | ------------------------------------- | ------------------------------------------------------------------------ |
| text         | `string`                              | _Required_. The text that will be displayed                              |
| quickReplies | <code>Array<QuickReply &#124; string></code> | _Optional_. Quick-Replies that will be shown below the text.             |
| messageType  | `MessageType`                         | _Optional_. The type of the message. Defaults to `MessageType.Response`. |

### Sending Quick Replies

Quick-replies can be sent by passing the `quickReplies` property to the options of the `showText`- or `showAttachment`-method:

```javascript
// @language=javascript
await this.$messengerBot.showText({
	text: 'someText',
	quickReplies: [
		{ content_type: QuickReplyContentType.Text, title: 'someTitle' },
		'Text-only-QuickReply'
	]
});

// @language=typescript
await this.$messengerBot?.showText({
	text: 'someText',
	quickReplies: [
		{ content_type: QuickReplyContentType.Text, title: 'someTitle' },
		'Text-only-QuickReply'
	]
});
```

Read more about quick-replies [here](https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies).

In addition to manually creating a `QuickReply`-object, the helper classes `TextQuickReply` and `BuiltInQuickReply` can be used.

> **INFO**: When passing a string, a TextQuickReply will be created from that string.

#### TextQuickReply

`TextQuickReply` can be used to create a `QuickReply`-object that displays text.

```javascript
// @language=javascript
new TextQuickReply('someTitle', 'somePayload', 'someImageUrl');

// @language=typescript
new TextQuickReply('someTitle', 'somePayload', 'someImageUrl');
```

#### BuiltInQuickReply

`BuiltInQuickReply` can be used to create `QuickReply`-object that either displays the user's email or phone number and provides an easy to way for the user to reply with this information.

```javascript
// @language=javascript
new BuiltInQuickReply(QuickReplyContentType.Email);

// @language=typescript
new BuiltInQuickReply(QuickReplyContentType.Email);
```

Read more about built-in quick-replies [here](https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies#phone) and [here](https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies#email).

### Sending Attachments

Facebook Messenger allows sending attachments, which includes audio, videos, images and files.

```javascript
// @language=javascript
if (this.$messengerBot)
	await this.$messengerBot.showAttachment({
		type: AttachmentType.File,
		data: {
			fileName: 'displayFileName',
			path: 'localPathToFile'
		}
	});

// @language=typescript
await this.$messengerBot?.showAttachment({
	type: AttachmentType.File,
	data: {
		fileName: 'displayFileName',
		path: 'localPathToFile'
	}
});
```

Read more about sending attachments [here](https://developers.facebook.com/docs/messenger-platform/send-messages#sending_attachments).

#### Attachment Options

| property     | type                                            | description                                                        |
| ------------ | ----------------------------------------------- | ------------------------------------------------------------------ |
| type         | `AttachmentType`                                | _Required_. The type of the attachment.                            |
| data         | <code>Buffer &#124; string &#124; number</code> | _Required_. The data to be sent with the attachment.               |
| quickReplies | <code>Array<QuickReply &#124; string></code>                                  | _Optional_. Quick-Replies that will be shown below the attachment. |
| isReusable   | `boolean`                                       | _Optional_. Determines whether the resource is reusable.           |

### Sending an Action

Actions allow controlling indicators for typing and read receipts.

#### SenderActionType

The following actions are supported:

- MarkSeen = 'mark_seen'
- TypingOn = 'typing_on'
- TypingOff = 'typing_off'

```javascript
// @language=javascript
if (this.$messengerBot)
	await this.$messengerBot.showAction(SenderActionType.TypingOn);

// @language=typescript
await this.$messengerBot?.showAction(SenderActionType.TypingOn);
```

There is also a helper method that sends the TypingOn and TypingOff action with a delay.

```javascript
// @language=javascript
if (this.$messengerBot)
	await this.$messengerBot.showTyping(5000); // Show typing bubble for 5 seconds.

// @language=typescript
await this.$messengerBot?.showTyping(SenderActionType.TypingOn); // Show typing bubble for 5 seconds.
```

Read more [here](https://developers.facebook.com/docs/messenger-platform/send-messages/sender-actions).

### Sending Templates

Facebook Messenger allows sending templates.

Read more [here](https://developers.facebook.com/docs/messenger-platform/send-messages/templates).

#### GenericTemplate

The following example shows how to send a generic template:

```javascript
// @language=javascript
if (this.$messengerBot)
	await this.$messengerBot.showGenericTemplate({
		elements: [
			{
				title: 'someTitle'
			}
		]
	});

// @language=typescript
await this.$messengerBot?.showGenericTemplate({
	elements: [
		{
			title: 'someTitle'
		}
	]
});
```

Read more [here](https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic).

#### ButtonTemplate

The following example shows how to send a button template:

```javascript
// @language=javascript
if (this.$messengerBot)
	await this.$messengerBot.showButtonTemplate({
		text: 'someText',
		buttons: [new PostbackButton('someTitle', 'somePayload')]
	});

// @language=typescript
await this.$messengerBot?.showButtonTemplate({
	text: 'someText',
	buttons: [new PostbackButton('someTitle', 'somePayload')]
});
```

Read more [here](https://developers.facebook.com/docs/messenger-platform/send-messages/template/button).

#### MediaTemplate

The following example shows how to send a media template:

```javascript
// @language=javascript
if (this.$messengerBot)
	await this.$messengerBot.showMediaTemplate({
		elements: [
			{
				media_type: MediaType.Image,
				url: 'someUrl',
				buttons: []
			}
		]
	});

// @language=typescript
await this.$messengerBot.showMediaTemplate({
	elements: [
		{
			media_type: MediaType.Image,
			url: 'someUrl',
			buttons: []
		}
	]
});
```

Read more [here](https://developers.facebook.com/docs/messenger-platform/send-messages/template/media).

#### ReceiptTemplate

The following example shows how to send a receipt template:

```javascript
// @language=javascript
if (this.$messengerBot)
	await this.$messengerBot.showReceiptTemplate({
		recipient_name: 'someName',
		order_number: 'someId',
		currency: 'EUR',
		payment_method: 'Visa',
		summary: {
			total_cost: 14.99
		}
	});

// @language=typescript
await this.$messengerBot?.showReceiptTemplate({
	recipient_name: 'someName',
	order_number: 'someId',
	currency: 'EUR',
	payment_method: 'Visa',
	summary: {
		total_cost: 14.99
	}
});
```

Read more [here](https://developers.facebook.com/docs/messenger-platform/send-messages/template/receipt).

#### AirlineTemplate

The following example shows how to send an airline template:

```javascript
// @language=javascript
if (this.$messengerBot)
	await this.$messengerBot.showAirlineTemplate({
		intro_message: 'someMessage',
		locale: 'someLocale',
		boarding_pass: [
			{
				passenger_name: 'someName',
				pnr_number: 'somePassengerNumber',
				logo_image_url: 'someUrl',
				flight_info: {
					flight_number: 'someFlightNumber',
					departure_airport: {
						terminal: 'someTerminal',
						gate: 'someGate',
						airport_code: 'someAirportCode',
						city: 'someCity'
					},
					arrival_airport: {
						airport_code: 'someAirportCode',
						city: 'anotherCity'
					},
					flight_schedule: {
						departure_time: 'someISOTimestamp'
					}
				}
			}
		]
	});

// @language=typescript
await this.$messengerBot?.showAirlineTemplate({
	intro_message: 'someMessage',
	locale: 'someLocale',
	boarding_pass: [
		{
			passenger_name: 'someName',
			pnr_number: 'somePassengerNumber',
			logo_image_url: 'someUrl',
			flight_info: {
				flight_number: 'someFlightNumber',
				departure_airport: {
					terminal: 'someTerminal',
					gate: 'someGate',
					airport_code: 'someAirportCode',
					city: 'someCity'
				},
				arrival_airport: {
					airport_code: 'someAirportCode',
					city: 'anotherCity'
				},
				flight_schedule: {
					departure_time: 'someISOTimestamp'
				}
			}
		}
	]
});
```

Read more [here](https://developers.facebook.com/docs/messenger-platform/send-messages/template/airline).
