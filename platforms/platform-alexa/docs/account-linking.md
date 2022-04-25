---
title: 'Alexa Account Linking'
excerpt: 'Learn how to use account linking with Alexa and Jovo.'
---

# Alexa Account Linking

Learn how to use account linking with Alexa and Jovo.

## Introduction

Account linking enables you to connect your Alexa Skill users to other systems. In the Alexa Skill, users can sign in to an external account and grant the Skill the permission to access profile information. You can also learn more in the [official Alexa documentation on account linking](https://developer.amazon.com/docs/alexa/account-linking/account-linking-for-custom-skills.html).

## Account Linking Card

To prompt your Alexa Skill users to link their accounts, you can send a `LinkAccountCard` to their mobile Alexa app. Learn more in the [official Alexa docs](https://developer.amazon.com/docs/alexa/account-linking/account-linking-for-custom-skills.html#start-from-card).

To show the card, you can use the [`LinkAccountCardOutput`](https://github.com/jovotech/jovo-framework/blob/v4/latest/platforms/platform-alexa/src/output/templates/LinkAccountCardOutput.ts):

```typescript
import { LinkAccountCardOutput } from '@jovotech/platform-alexa';
// ...

someHandler() {
  // ...

  return this.$send(LinkAccountCardOutput, {
    message: 'Please link your account in the Alexa app.',
  });
}
```

Under the hood, the [`LinkAccountCardOutput`](https://github.com/jovotech/jovo-framework/blob/v4/latest/platforms/platform-alexa/src/output/templates/LinkAccountCardOutput.ts) looks like this:

```typescript
{
  message: this.options.message,
  listen: false,
  platforms: {
    alexa: {
      nativeResponse: {
        response: {
          card: {
            type: 'LinkAccount'
          }
        }
      }
    }
  }
}
```

## Access Token

After the user successfully linked their account, you can access the access token like this:

```typescript
this.$alexa.$user.accessToken;
```

This access token can then be used to make API calls to your system and retrieve user specific information.
