# Google Assistant Account Linking

Learn how to use account linking with Google Conversational Actions and Jovo.
- [Introduction](#introduction)
- [Google Sign-In](#google-sign-in)
  - [Configure Account Linking Scenes](#configure-account-linking-scenes)
  - [Trigger Account Linking Flow](#trigger-account-linking-flow)
  - [Access the Google Account Profile](#access-the-google-account-profile)

## Introduction

Account linking enables you to connect your Google Action to other systems. In the conversational experience, users can sign in to an external account and grant the Action the permission to access profile information. You can also learn more in the [official Google documentation on account linking](https://developers.google.com/assistant/identity).

There are several types of account linking that are supported for Google Conversational Actions:

* [Google sign-in](#google-sign-in) to get access to the user's Google profile
* oAuth account linking to connect the user to a external system


## Google Sign-In

Google sign-in offers a streamlined process to connect a user's Google profile to their Google Action. This can even be done via voice. Learn more about Google sign-in [in the official Google docs](https://developers.google.com/assistant/identity/google-sign-in)

To implement Google sign-in, you need to [configure account linking scenes](#configure-account-linking-scenes) and then [trigger account linking from the conversational experience](#trigger-account-linking-flow). After successful linking, you can [access the Google profile](#access-the-google-account-profile). 

### Configure Account Linking Scenes

You can use the Google Assistant concept of [scenes](./scenes.md) to implement an account linking flow. [The official Google documentation](https://developers.google.com/assistant/identity/google-sign-in) also includes a step by step guide to set up scenes for account linking.

There are multiple ways of setting up these scenes. We recommend creating them inside your [model](./model.md) to deploy them directly to the Google Conversational Actions Console.

Below are two example scenes called `AccountLinkingScene` and `AccountLinkingScene_AccountLinking`:

```javascript
"googleAssistant": {
  "custom": {
    "scenes": {
      "AccountLinkingScene": {
        "conditionalEvents": [
          {
            "condition": "user.verificationStatus != \"VERIFIED\"",
            "handler": {
              "webhookHandler": "Jovo"
            }
          },
          {
            "condition": "user.verificationStatus == \"VERIFIED\"",
            "transitionToScene": "AccountLinkingScene_AccountLinking"
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
      "AccountLinkingScene_AccountLinking": {
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

`AccountLinkingScene` propagates the request to `AccountLinkingScene_AccountLinking`, depending on whether the user is verified or not, which in turn sends the result from the account linking process to your webhook handler.

### Trigger Account Linking Flow

You can use the following helper methods in your handlers to check if account linking has already been done:

```typescript
// Is the account linked?
this.$googleAssistant.$user.isAccountLinked()

// Account linking is only possible for verified users, not for guests
this.$googleAssistant.$user.isVerified()
```

To trigger account linking, you can instruct your Google Action to handle the next conversation step with the specified scene in the output:

```typescript
{
  // ...
  platforms: {
    googleAssistant: {
      nativeResponse: {
        scene: {
          next: {
            name: 'AccountLinkingScene',
          }
        }
      }
    }
  }
}
```

After the user has responded to your account linking request, you will receive a request to notify you about the result.

// TODO: `ON_SIGN_IN`


### Access the Google Account Profile

After the user has successfully linked their account using Google sign-in, you can access their profile information using the `getGoogleProfile` method:

```typescript
await this.$googleAssistant.$user.getGoogleProfile()

// Example
async someHandler() {

    try {
      const googleProfile = await this.$googleAssistant.$user.getGoogleProfile();

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
