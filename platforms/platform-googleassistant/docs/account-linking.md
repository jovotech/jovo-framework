# Google Assistant Account Linking

Learn how to use account linking with Google Conversational Actions and Jovo.
- [Introduction](#introduction)
- [Google Sign-In](#google-sign-in)
  - [Configure Account Linking Scenes](#configure-account-linking-scenes)
  - [Enable Account Linking in the Actions Console](#enable-account-linking-in-the-actions-console)
  - [Trigger Account Linking Flow](#trigger-account-linking-flow)
  - [Access the Google Account Profile](#access-the-google-account-profile)

## Introduction

Account linking enables you to connect your Google Action to other systems. In the conversational experience, users can sign in to an external account and grant the Action the permission to access profile information. You can also learn more in the [official Google documentation on account linking](https://developers.google.com/assistant/identity).

There are several types of account linking that are supported for Google Conversational Actions:

* [Google Sign-In](#google-sign-in) to get access to the user's Google profile
* oAuth account linking to connect the user to a external system


## Google Sign-In

Google Sign-In offers a streamlined process to connect a user's Google profile to their Google Action user ID. This can even be done via voice. Learn more about Google Sign-In [in the official Google Assistant docs](https://developers.google.com/assistant/identity/google-sign-in).

To implement Google Sign-In, you need to [configure account linking scenes](#configure-account-linking-scenes), [enable account linking in the Actions Console](#enable-account-linking-in-the-actions-console), and then [trigger account linking from the conversational experience](#trigger-account-linking-flow). After successful linking, you can [access the Google profile](#access-the-google-account-profile). 

### Configure Account Linking Scenes

You can use the Google Assistant concept of [scenes](./scenes.md) to implement an account linking flow. [The official Google documentation](https://developers.google.com/assistant/identity/google-sign-in) also includes a step by step guide to set up scenes for account linking.

There are multiple ways of setting up these scenes. We recommend creating them inside your [model](./model.md) to deploy them directly to the Google Conversational Actions Console.

Below are two example scenes called `SignIn` and `SignIn_AccountLinking`. It doesn't matter how you name the first one, but it's important that the latter one is name `<SceneName>_AccountLinking`.

```javascript
"googleAssistant": {
  "custom": {
    "scenes": {
      "SignIn": {
        "conditionalEvents": [
          {
            "condition": "user.verificationStatus != \"VERIFIED\"",
            "handler": {
              "webhookHandler": "Jovo"
            }
          },
          {
            "condition": "user.verificationStatus == \"VERIFIED\"",
            "transitionToScene": "SignIn_AccountLinking"
          }
        ],
        "intentEvents": [
          {
            "handler": {
              "webhookHandler": "Jovo"
            },
            "intent": "YesIntent"
          }
        ]
      },
      "SignIn_AccountLinking": {
        "conditionalEvents": [
          {
            "condition": "session.params.AccountLinkingSlot == \"LINKED\"",
            "handler": {
              "webhookHandler": "Jovo"
            }
          },
          {
            "condition": "session.params.AccountLinkingSlot == \"ERROR\"",
            "handler": {
              "webhookHandler": "Jovo"
            }
          },
          {
            "condition": "session.params.AccountLinkingSlot == \"REJECTED\"",
            "handler": {
              "webhookHandler": "Jovo"
            }
          }
        ],
        "slots": [
          {
            "commitBehavior": {
              "writeSessionParam": "AccountLinkingSlot"
            },
            "config": {
              "@type": "type.googleapis.com/google.actions.conversation.v3.SignInSpec",
              "opt_context": ""
            },
            "defaultValue": {
              "sessionParam": "AccountLinkingSlot"
            },
            "name": "AccountLinkingSlot",
            "required": true,
            "type": {
              "name": "actions.type.AccountLinking"
            }
          }
        ]
      }
    }
  }
}
```

The `SignIn` scene transitions to the `SignIn_AccountLinking` scene if the user is verified (eligible to do account linking).

After adding the scenes, you can use the `build` and `deploy` commands to update the Action in the developer console. [Learn more about how to use the Google Assistant CLI integration](./project-config.md).

### Enable Account Linking in the Actions Console

In addition to setting up scenes, you need to enable account linking in the [Google Actions Console](https://console.actions.google.com/).

You can find account linking in the "Develop" section. Enable it and select the following:

* Account creation: Select `yes`
* Linking type: Select `Google Sign in`

### Trigger Account Linking Flow

You can use the following helper methods in your handlers to check if account linking has already been done:

```typescript
// Is the account linked?
this.$googleAssistant.$user.isAccountLinked()

// Account linking is only possible for verified users, not for guests
this.$googleAssistant.$user.isVerified()
```

To trigger account linking, you can instruct your Google Action to handle the next conversation step with the specified scene in the output ([see the docs for Google Assistant output](https://github.com/jovotech/jovo-output/blob/master/output-googleassistant/README.md)):

```typescript
{
  // ...
  platforms: {
    googleAssistant: {
      nativeResponse: {
        scene: {
          name: this.$googleAssistant!.$request.scene?.name || '', // Current scene
          slots: this.$googleAssistant!.$request.scene?.slots || {}, // Current slots
          next: {
            name: 'SignIn',
          }
        }
      }
    }
  }
}
```

After the user has gone through account linking, you receive a request of the type `ON_SIGN_IN` to notify you about the result. You can create a handler for this request by using the [`types` property](https://github.com/jovotech/jovo-framework/blob/v4dev/docs/handlers.md#types):

```typescript
@Types('ON_SIGN_IN')
userSignedIn() {

    // ...
}
```


### Access the Google Account Profile

After the user has successfully linked their account using Google Sign-In, you can access their profile information using the `getGoogleProfile` method:

```typescript
await this.$googleAssistant.$user.getGoogleProfile()

// Example
async userSignedIn() {

    try {
      const googleProfile = await this.$googleAssistant!.$user.getGoogleProfile();

      // ...

    } catch (error) {
      // ...
    }
}
```

The profile (of the type `GoogleAccountProfile`) includes the following properties:

* `email`: A string of their email address
* `email_verified`: A boolean that determines if the email is verified
* `picture`: A string with a URL to their profile picture
* `name`: A string with their full name
* `given_name`: A string with their given name
* `family_name`: A string with their family name
