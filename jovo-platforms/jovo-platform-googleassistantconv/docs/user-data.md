# User Data

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-googleassistantconv/user-data

Learn more about how to get access to Google Action user information.

* [Introduction](#introduction)
* [User ID](#user-id)
* [Google Profile](#google-profile)
* [Account Linking](#account-linking)

## Introduction

User information is mainly used to offer a more personalized experience, but you can't access it right away. First you have to ask for permission.

## User ID

With Jovo, a Google Action `userId` is created by generating a random id using `uuidv4`, and then saving it to the user storage object.

Note: User Storage only works for Google Assistant users who are verified. For users that are not verified, the data will expire at the end of the conversation. [Learn more in the official Google Docs](https://developers.google.com/assistant/conversational/storage-user#expiration_of_user_storage_data).

## Google Profile

Since Google does not provide a way to get user information such as email and name yet, you need to use the Google profile to access their data.

```javascript
await this.$googleAction!.$user.getGoogleProfile();
```

This will return an object containing user information in the following format:

```javascript
{
  email: '',
  email_verified: true;
  name: '';
  picture: '';
  given_name: '';
  family_name: '';
}
```

In order to get access to the user profile, you'll need the user to link their account to access their information, if the user is not already linked. 

## Account Linking

To implement Account Linking in your voice application, we recommend using [scenes](https://v3.jovo.tech/marketplace/jovo-platform-googleassistantconv/concepts/scenes) to handle the individual steps of account linking.

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

To trigger Account Linking, you can instruct your Google Action to handle the next conversation step with the specified scene:

```javascript
// @language=javascript
this.$googleAction.setNextScene('AccountLinkingScene');
this.ask('Great!');

// @language=typescript
this.$googleAction!.setNextScene('AccountLinkingScene');
this.ask('Great!');
```

After the user has responded to your account linking request, you will receive a request to notify you about the result, which will be mapped to the Jovo built-in `ON_SIGN_IN` intent:

```javascript
// @language=javascript
async ON_SIGN_IN() {
	if (this.$googleAction.isAccountLinkingLinked()) {
		const profile = await this.$googleAction.$user.getGoogleProfile();
		this.tell(`Hi ${profile.given_name}`);
	} else if (this.$googleAction.isAccountLinkingRejected()) {
		this.tell('Too bad. Good bye');
	} else {
  	this.tell('Something went wrong');
	}
}

// @language=typescript
async ON_SIGN_IN() {
	if (this.$googleAction!.isAccountLinkingLinked()) {
		const profile: GoogleAccountProfile = await this.$googleAction!.$user.getGoogleProfile();
		this.tell(`Hi ${profile.given_name}`);
	} else if (this.$googleAction!.isAccountLinkingRejected()) {
		this.tell('Too bad. Good bye');
	} else {
		this.tell('Something went wrong');
	}
}
```

[Example Javascript](https://github.com/jovotech/jovo-framework/blob/master/examples/javascript/02_googleassistantconv/account-linking/) | [Example Typescript](https://github.com/jovotech/jovo-framework/blob/master/examples/typescript/02_googleassistantconv/account-linking/)
