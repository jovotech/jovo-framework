# Push Notifications

> To view this page on the Jovo website, visit https://www.jovo.tech/marketplace/jovo-platform-googleassistantconv/interfaces/notifications

Learn more about how to send push notifications to your Google Action users.

* [Introduction](#introduction)
* [Configuration](#configuration)
  * [Service Account](#service-account)
	* [Scenes](#scenes)
	* [ON_PERMISSION](#on-permission)
* [Sending the Notification](#send-the-notification)

## Introduction

The Push Notifications feature allows you to send user's notifications, which, if tapped, triggers a predefined intent of your Google Action. To send a push notification, you need to setup the Actions API and configure [scenes](https://www.jovo.tech/marketplace/jovo-platform-googleassistantconv/concepts/scenes) to handle the individual steps of configuring push notifications.

## Configuration

### Service Account

Push Notifications will be sent over the Actions API, which you'll need to setup for your Google Cloud project linked to your Conversational Action.

First, go to the [Google API Console](https://console.developers.google.com/apis/api/actions.googleapis.com/overview) and select your project. Make sure the project's ID is the same as your Conversational Action's ID. After you selected your project, enable the Actions API.

Next, you'll create a service account with respective credentials, that you'll use to send the notifications to your users.

After you gave your account an appropriate name, choose the Role `Project > Owner`, to give your account all necessary permissions. When you're done, go to the Service Account details and add a new key certificate in JSON format, which you can then download and store in your project's directory.

### Scenes

To implement Push Notifications in your voice application, we recommend using [scenes](https://www.jovo.tech/marketplace/jovo-platform-googleassistantconv/concepts/scenes) to handle the setup.

There are multiple ways of setting up the scenes necessary, we recommend creating them inside your model file to deploy them directly to the Google Conversational Actions Console.

```javascript
"googleAssistant": {
  "custom": {
    "scenes": {
      "PushNotificationsScene": {
        "intentEvents": [
          {
            "intent":"PushNotificationsIntent",
            "transitionToScene":"PushNotificationsScene_Notifications"
          }
        ]
      },
      "PushNotificationsScene_Notifications": {
        "conditionalEvents": [
          {
            "condition":"scene.slots.status == \"FINAL\" && (session.params.NotificationsSlot_PushNotificationsClickedIntent.permissionStatus == \"PERMISSION_GRANTED\" || session.params.NotificationsSlot_PushNotificationsClickedIntent.permissionStatus == \"ALREADY_GRANTED\")",
            "handler":{
              "webhookHandler":"Jovo"
            }
          },
          {
            "condition":"scene.slots.status == \"FINAL\" && session.params.NotificationsSlot_PushNotificationsClickedIntent.permissionStatus != \"PERMISSION_GRANTED\" && session.params.NotificationsSlot_PushNotificationsClickedIntent.permissionStatus != \"ALREADY_GRANTED\"",
            "handler":{
              "webhookHandler":"Jovo"
            }
          }
        ],
        "slots": [
          {
            "commitBehavior": {
              "writeSessionParam":"NotificationsSlot_PushNotificationsClickedIntent"
            },
            "config": {
              "intent": {
                "intentName":"PushNotificationsClickedIntent"
              }
            },
            "defaultValue": {
              "sessionParam":"NotificationsSlot_PushNotificationsClickedIntent"
            },
            "name":"NotificationsSlot_PushNotificationsClickedIntent",
            "required":true,
            "type": {
              "name":"actions.type.Notifications"
            }
          }
        ]
      }
    }
  }
}
```

These two scenes, located inside your Jovo model, determine how to set-up Push Notifications.

`PushNotificationsScene` propagates the request to `PushNotificationsScene_Notifications`, if the intent `PushNotificationsIntent` has been triggered by the user, where the user will be asked whether to opt in or out of push notifications.

In order for your action to listen for `PushNotificationsIntent`, you need to instruct your Google Action to handle the next conversation step with the specified scene:

```javascript
// @language=javascript
this.$googleAction.setNextScene('PushNotificationsScene');
this.ask('If you want me to send you notifications, just say "notify me".');

// @language=typescript
this.$googleAction!.setNextScene('PushNotificationsScene');
this.ask('If you want me to send you notifications, just say "notify me".');
```

### ON_PERMISSION

After the user has responded to your request, you will receive a request to notify you about the result, which will be mapped to the Jovo built-in `ON_PERMISSION` intent:

```javascript
// @language=javascript
async ON_PERMISSION() {
	if (
		this.$googleAction.isPermissionGranted() ||
		this.$googleAction.isPermissionAlreadyGranted()
	) {
		this.tell('Great!');
	} else {
		this.tell('Hm, ok.');
	}
}

// @language=typescript

```

## Sending the Notification

Using the class `PushNotificationsApi` and your credentials, you can now send a push notification:

```javascript
const { PushNotificationsApi } = require('jovo-platform-googleassistantconv');

// Import the credentials that you saved earlier.
const credentials = require('../credentials.json');

const reminderUserId = this.$googleAction.getNotificationsUserId();

const api = new PushNotificationsApi(credentials);

await api.sendPushNotification({
	userId: reminderUserId,
	intent: 'PushNotificationsClickedIntent',
	title: 'Click me!',
	locale: 'en',
});
```

[Example Javascript](https://github.com/jovotech/jovo-framework/blob/master/examples/javascript/02_googleassistantconv/push-notifications/) | [Example Typescript](https://github.com/jovotech/jovo-framework/blob/master/examples/typescript/02_googleassistantconv/push-notifications/)
