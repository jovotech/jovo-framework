# Alexa Reminders

Learn how to use the Alexa Skill Reminders feature with Jovo.

- [Introduction](#introduction)
- [Permissions](#permissions)
  - [Add Reminder Permissions to the Skill Manifest](#add-reminder-permissions-to-the-skill-manifest)
  - [Ask Users for Permission](#ask-users-for-permission)
- [Add and Modify Reminders](#add-and-modify-reminders)
  - [Set Reminders](#set-reminders)
  - [Update Reminders](#update-reminders)
  - [Get Reminders](#get-reminders)
  - [Delete Reminders](#delete-reminders)

## Introduction

Alexa supports the ability for users to set reminders. [Learn more in the official Alexa documentation](https://developer.amazon.com/docs/alexa/smapi/alexa-reminders-overview.html).

Jovo offers methods to [add and modify reminders](#add-and-modify-reminders). For example, you can set a reminder like this in a [handler](https://v4.jovo.tech/docs/handlers):

```typescript
async someHandler() {
  const reminder = {
    // Your reminder
  };

  try {
    const result = await this.$alexa!.$user.setReminder(reminder);

    return this.$send({ message: 'Your reminder has been set.'});

  } catch(error: Error) {
    if (error.code === 'NO_USER_PERMISSION') {
      // ...
    }
  }
},
```

The `reminder` passed to the `setReminder` method above uses a structure that you can learn more about [in the official Alexa documentation](https://developer.amazon.com/docs/alexa/smapi/alexa-reminders-api-reference.html#reminder-object). There are relative (`RelativeReminder`) and absolute reminders (`AbsoluteReminder`).

Here is an example:

```typescript
import { RelativeReminder } from '@jovotech/platform-alexa';
// ...

async someHandler() {
  const reminder: RelativeReminder = {
    requestTime: '2021-07-22T19:04:00.672', // Valid ISO 8601 format - describes the time when event actually occurred
    trigger: {
      type: 'SCHEDULED_RELATIVE', // Indicates type of trigger
      offsetInSeconds: 60, // If reminder is set using relative time, use this field to specify the time after which reminder will ring (in seconds)
    },
    alertInfo: {
      spokenInfo: {
        content: [
          {
            locale: 'en-US', // Locale in which value is specified
            text: 'Hello World!', // Text that will be used for display and spoken purposes
          },
        ],
      },
    },
    pushNotification: {
      status: 'ENABLED', // If a push notification should be sent or not [default = ENABLED]
    },
  };

  // ...
}
```

You need to [ask the user for permission](#permissions) before you can [add and modify reminders](#add-and-modify-reminders).


## Permissions

You need to [add permissions to your skill manifest](#add-reminder-permissions-to-the-skill-manifest) as well as [ask the users for permission](#ask-users-for-permission) during the interaction.

### Add Reminder Permissions to the Skill Manifest

To be able to use reminders in your Alexa Skill, you need to add the permission to the Skill project.

While you can manually enable the permission in the Alexa developer console, we recommend to add it to the `skill.json` manifest directly using the [Jovo project config]([docs/](https://v4.jovo.tech/docs/)project-config):

```js
const project = new ProjectConfig({
  // ...
  plugins: [
    new AlexaCli({
      // ...
      files: {
        'skill-package/skill.json': {
          manifest: {
            permissions: [
              { name: 'alexa::alerts:reminders:skill:readwrite' }
            ]
          }
        },
      }
    })
  ],
});
```

Learn more about the [`permissions` field in the official Alexa documentation](https://developer.amazon.com/docs/alexa/smapi/skill-manifest.html#permissions).


### Ask Users for Permission

As you can see in the code example from the [introduction](#introduction), there is a potential `NO_USER_PERMISSION` error when trying to [add or modify reminders](#add-and-modify-reminders):

```typescript
async someHandler() {
  const reminder = {
    // Your reminder
  };

  try {
    const result = await this.$alexa!.$user.setReminder(reminder);

    return this.$send({ message: 'Your reminder has been set.'});

  } catch(error: Error) {
    if (error.code === 'NO_USER_PERMISSION') {
      // ...
    }
  }
},
```

If this error occurs, you need to first ask your user for the permission to read and write reminders into their profile. You can either use [voice permissions](#voice-permissions) or a [permission consent card](#permissions-consent-card) for this.

#### Voice Permissions

Voice permissions provide a frictionless way to ask users if they want to provide access to their reminders. [Learn more in the official Alexa docs](https://developer.amazon.com/docs/alexa/smapi/voice-permissions-for-reminders.html).

You can use the  `AskForRemindersPermissionOutput` for this:

```typescript
import { AskForRemindersPermissionOutput } from '@jovotech/platform-alexa';
// ...

someHandler() {
  // ...

  return this.$send(AskForRemindersPermissionOutput, {
    message: 'Please grant the permission to set reminders.',
  });
}
```

Under the hood, the `AskForRemindersPermissionOutput` extends the `AskForPermissionOutput` and like this:

```typescript
{
  message: this.options.message,
  platforms: {
    alexa: {
      nativeResponse: {
        response: {
          directives: [
            {
              type: 'Connections.SendRequest',
              name: 'AskFor',
              payload: {
                '@type': 'AskForPermissionsConsentRequest',
                '@version': '1',
                'permissionScope': 'alexa::alerts:reminders:skill:readwrite',
              },
              token: this.options.token || '',
            },
          ],
        },
      },
    },
  },
}
```

Once a permission is accepted, Alexa sends a request with the type `Connections.Response`. [Learn more in the official Alexa docs](https://developer.amazon.com/docs/alexa/smapi/voice-permissions-for-reminders.html#send-a-connectionssendrequest-directive).

You can use the `isRemindersPermissionAcceptedRequest` to look for requests like this in your handlers:

```typescript
import { Handle } from '@jovotech/framework';
import { isRemindersPermissionAcceptedRequest } from '@jovotech/platform-alexa';
// ...

@Handle({
  global: true,
  intents: [ 'Connections.Response' ],
  if: isRemindersPermissionAcceptedRequest
})
async remindersPermissionAccepted() {
  // ...
}
```

> **Note**: The request doesn't come with session data. This is why the accepting handler needs to be `global`.

Here are additional helper functions that you can use similar to `isRemindersPermissionAcceptedRequest`:

* `isRemindersPermissionRequest`
* `isRemindersPermissionDeniedRequest`
* `isRemindersPermissionNotAnsweredRequest`

#### Permissions Consent Card

You can also ask for permissions by sending a permissions consent card to the user's Alexa mobile app. [Learn more in the official Alexa docs](https://developer.amazon.com/docs/alexa/custom-skills/request-customer-contact-information-for-use-in-your-skill.html#permissions-card-for-requesting-customer-consent).


```typescript
import { AskForPermissionsConsentCardOutput } from '@jovotech/platform-alexa';
// ...

someHandler() {
  // ...

  return this.$send(AskForPermissionsConsentCardOutput, {
    message: 'Please grant the permission to set reminders.',
    permissions: [ 'alexa::alerts:reminders:skill:readwrite' ]
  });
}
```

Under the hood, the `AskForPermissionsConsentCardOutput` looks like this:

```typescript
{
  message: this.options.message,
  platforms: {
    alexa: {
      nativeResponse: {
        response: {
          card: {
            type: 'AskForPermissionsConsent',
            permissions: this.options.permissions,
          },
        },
      },
    },
  },
}
```


## Add and Modify Reminders

You can [set](#set-reminders), [update](#update-reminders), [delete](#delete-reminders), and [get](#get-reminders) reminders.

### Set Reminders

```typescript
await this.$alexa!.$user.setReminder(reminder: AbsoluteReminder | RelativeReminder);

// Example
async someHandler() {
  const reminder = {
    // Your reminder
  };

  try {
    const result = await this.$alexa!.$user.setReminder(reminder);

    return this.$send({ message: 'Your reminder has been set.'});

  } catch(error: Error) {
    if (error.code === 'NO_USER_PERMISSION') {
      // ...
    }
  }
},
```

### Update Reminders

```typescript
await this.$alexa!.$user.updateReminder(alertToken: string, updatedReminder: AbsoluteReminder | RelativeReminder);

// Example
async someHandler() {
  const alertToken = '<REMINDER TOKEN>';
  const updatedReminder = {
    // Your reminder
  };

  try {
    const result = await this.$alexa!.$user.updateReminder(alertToken, updatedAbsoluteReminder);

    return this.$send({ message: 'Your reminder has been updated.'});

  } catch(error: Error) {
    if (error.code === 'NO_USER_PERMISSION') {
      // ...
    }
  }
},
```


### Get Reminders

```typescript
await this.$alexa!.$user.getReminder(alertToken: string)

// Example
async someHandler() {
    const alertToken = '<REMINDER TOKEN>';

    try {
      const result = await this.$alexa!.$user.getReminder(alertToken);

      // ...

    } catch(error: Error) {
        console.error(error);
    }
},
```

There is also the possibility to get all your reminders at once:

```typescript
await this.$alexa!.$user.getAllReminders()

// Example
async someHandler() {
    try {
      const result = await this.$alexa!.$user.getReminder(alertToken);

      // ...

    } catch(error: Error) {
        console.error(error);
    }
},
```


### Delete Reminders

```typescript
await this.$alexa!.$user.deleteReminder(alertToken: string);

async someHandler() {
  const alertToken = '<REMINDER TOKEN>';

  try {
    const result = await this.$alexa!.$user.deleteReminder(alertToken);
    
    return this.$send({ message: 'Your reminder has been deleted.'});

  } catch(error: Error) {
    if (error.code === 'NO_USER_PERMISSION') {
      // ...
    }
  }
},
```
