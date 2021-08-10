# Google Assistant Account Linking

Learn how to use account linking with Google Conversational Actions and Jovo.
- [Introduction](#introduction)
- [Configure Account Linking Scene](#configure-account-linking-scene)
- [Trigger Account Linking Flow](#trigger-account-linking-flow)

## Introduction

To implement Account Linking in your voice application, we recommend using [scenes](./scenes.md) to handle the individual steps of account linking.


## Configure Account Linking Scene

There are multiple ways of setting up the scenes necessary, we recommend creating them inside your model file to deploy them directly to the Google Conversational Actions Console.

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

These two scenes, located inside your Jovo model, determine how Account Linking is handled for your Conversational Action.

`AccountLinkingScene` propagates the request to `AccountLinkingScene_AccountLinking`, depending on whether the user is verified or not, which in turn sends the result from the Account Linking process to your webhook handler.

## Trigger Account Linking Flow

To trigger Account Linking, you can instruct your Google Action to handle the next conversation step with the specified scene in the output:

```typescript
{
  // ...
  platforms: {
    GoogleAssistant: {
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

// TODO

```typescript
this.$googleAssistant.$user.isAccountLinked()
```

```typescript
this.$googleAssistant.$user.isVerified()
```