# Facebook Messenger

Learn more about the Facebook Messenger Platform and it's platform-specific features that can be used with the Jovo Framework.

## Installation

```sh
npm install jovo-platform-facebookmessenger --save
```

```javascript
// @language=javascript

// src/app.js
const { FacebookMessenger } = require('jovo-platform-facebookmessenger');

const fbMessenger = new FacebookMessenger({
	pageAccessToken: 'yourPageAccessToken',
	verifyToken: 'yourVerifyToken',
	locale: 'yourLocale'
});

app.use(fbMessenger);

// @language=typescript

// src/app.ts
import { FacebookMessenger } from 'jovo-platform-facebookmessenger';

const fbMessenger = new FacebookMessenger({
	pageAccessToken: 'yourPageAccessToken',
	verifyToken: 'yourVerifyToken',
	locale: 'yourLocale'
});

app.use(fbMessenger);
```

### Automatically set greeting-text

```javascript
// @language=javascript
new FacebookMessenger({
	greeting: {
		updateOnSetup: true,
		data: [
			{ locale: 'en-US', text: 'Get Started' },
			{ locale: 'de-DE', text: 'Loslegen' }
		]
	}
});

// @language=typescript
new FacebookMessenger({
	greeting: {
		updateOnSetup: true,
		data: [
			{ locale: 'en-US', text: 'Get Started' },
			{ locale: 'de-DE', text: 'Loslegen' }
		]
	}
});
```

### Automatically set launch-payload

```javascript
// @language=javascript
new FacebookMessenger({
	launch: {
		updateOnSetup: true,
		data: 'someLaunchPayload'
	}
});

// @language=typescript
new FacebookMessenger({
	launch: {
		updateOnSetup: true,
		data: 'someLaunchPayload'
	}
});
```

## Introduction to Facebook Messenger Specific Features

You can access the `messengerBot` object like this:

```javascript
// @language=javascript
this.$messengerBot

// @language=typescript
this.$messengerBot!
```

The returned object will be an instance of `MessengerBot` if the current request comes from Facebook Messenger. Otherwise `undefined` will be returned.

## Output

These sections provide an overview of Facebook Messenger specific features for output. \
For the basic concept, take a look here: [Basic Concepts > Output](../../basic-concepts/output './output').

### No Reprompts

Facebook Messenger does not support reprompts. Any reprompt passed to `ask` will be ignored.

### Multiple Messages

Facebook Messenger allows sending multiple messages.
Read more about sending messages [here](https://developers.facebook.com/docs/messenger-platform/send-messages).

### Overwrite default-output

The speech of `tell` and `ask` can be overwritten:

```javascript
// @language=javascript
if (this.$messengerBot) this.$messengerBot.overwriteText('someNewText');

// @language=typescript
this.$messengerBot?.overwriteText('someNewText');
```

Additionally, quick-replies can be overwritten:

```javascript
// @language=javascript
if (this.$messengerBot)
	this.$messengerBot.overwriteQuickReplies([
		new TextQuickReply('someQuickReplyText')
	]);

// @language=typescript
this.$messengerBot?.overwriteQuickReplies([
	new TextQuickReply('someQuickReplyText')
]);
```

### Sending Text

The following example shows how to send a text-message:

```javascript
// @language=javascript
if (this.$messengerBot) this.$messengerBot.text({ text: 'text' });

// @language=typescript
this.$messengerBot?.text({ text: 'text' });
```

> **INFO**: The text-message that was created by calling `tell` or `ask` will always be the first message to be displayed. Even if the `text`-method was called first.

#### Options

When calling the `text`-method an object with the following properties can be passed:

| property     | type           | description                                                              |
| ------------ | -------------- | ------------------------------------------------------------------------ |
| text         | `string`       | _Required_. The text that will be displayed                              |
| quickReplies | `QuickReply[]` | _Optional_. Quick-Replies that will be shown below the text.             |
| messageType  | `MessageType`  | _Optional_. The type of the message. Defaults to `MessageType.Response`. |

### Sending Quick Replies

Quick-replies can be sent by passing the `quickReplies` property to the options of the `text`- or `attachment`-method:

```javascript
// @language=javascript
this.$messengerBot.text({
	text: 'someText',
	quickReplies: [
		{ content_type: QuickReplyContentType.Text, title: 'someTitle' }
	]
});

// @language=typescript
this.$messengerBot?.text({
	text: 'someText',
	quickReplies: [
		{ content_type: QuickReplyContentType.Text, title: 'someTitle' }
	]
});
```

Read more about quick-replies [here](https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies).

In addition to manually creating a `QuickReply`-object, the helper classes `TextQuickReply` and `BuiltInQuickReply` can be used.

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
	this.$messengerBot.attachment({
		type: AttachmentType.File,
		data: someBufferVar
	});

// @language=typescript
this.$messengerBot?.attachment({
	type: AttachmentType.File,
	data: someBufferVar
});
```

Read more about sending attachments [here](https://developers.facebook.com/docs/messenger-platform/send-messages#sending_attachments).

#### Options

| property     | type                                            | description                                                        |
| ------------ | ----------------------------------------------- | ------------------------------------------------------------------ |
| type         | `AttachmentType`                                | _Required_. The type of the attachment.                            |
| data         | <code>Buffer &#124; string &#124; number</code> | _Required_. The data to be sent with the attachment.               |
| quickReplies | `QuickReply[]`                                  | _Optional_. Quick-Replies that will be shown below the attachment. |
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
if (this.$messengerBot) this.$messengerBot.action(SenderActionType.TypingOn);

// @language=typescript
this.$messengerBot?.action(SenderActionType.TypingOn);
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
	this.$messengerBot.genericTemplate({
		elements: [
			{
				title: 'someTitle'
			}
		]
	});

// @language=typescript
this.$messengerBot?.genericTemplate({
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
	this.$messengerBot.buttonTemplate({
		text: 'someText',
		buttons: [new PostbackButton('someTitle', 'somePayload')]
	});

// @language=typescript
this.$messengerBot?.buttonTemplate({
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
	this.$messengerBot.mediaTemplate({
		elements: [
			{
				media_type: MediaType.Image,
				url: 'someUrl',
				buttons: []
			}
		]
	});

// @language=typescript
this.$messengerBot.mediaTemplate({
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
	this.$messengerBot.receiptTemplate({
		recipient_name: 'someName',
		order_number: 'someId',
		currency: 'EUR',
		payment_method: 'Visa',
		summary: {
			total_cost: 14.99
		}
	});

// @language=typescript
this.$messengerBot?.receiptTemplate({
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
	this.$messengerBot.airlineTemplate({
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
this.$messengerBot?.airlineTemplate({
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
