# Data

In this section, you will learn how to deal with entities and slot values provided by your users, and also store and retrieve user specific data with the User class.

* [Introduction to Data](#introduction-to-data)
   * [Data Types](#data-types)
   * [Request Data](#request-data)
   * [Session Data](#request-data)
   * [User Data](#persisting-data)
* [App Data](#app-data)
* [Account Linking](#account-linking)

## Introduction to Data

> If you're new to voice applications, you can learn more about general principles like slots and entities here: [Getting Started > Voice App Basics](../../01_getting-started/voice-app-basics.md './voice-app-basics').

We call user input any additional information your user provides besides an `intent`. On Amazon Alexa, input is usually called a `slot`, on Google Assistant/Dialogflow an `entity` or `parameter`.

## Request Data

## Session Data

## User Data

> Learn more about Sessions here: [App Logic > Routing > Introduction to User Sessions](../01_routing/#introduction-to-user-sessions './routing#introduction-to-user-sessions').

If you want to store user input to use later, there is an important distinction to be made: Should the information only be available during a session, or be persisted for use in later sessions?

## App Data

## Account Linking

To implement Account Linking in your voice application, you need two core methods.

The first allows you to prompt the user to link their account, by adding an `AccountLinkingCard` to your response, which will be shown respective companion app:

```javascript
this.showAccountLinkingCard();
```

The other method returns you the access token, which will be added to every request your skill gets, after the user linked their account:

```javascript
this.$request.getAccessToken();
```

On Google Action, after the user has responded to your account linking request, you will receive a request to notify you about the result, which will be mapped to the Jovo built-in `ON_SIGN_IN` intent. Using the `getSignInStatus()` method you can get the result:

```javascript
ON_SIGN_IN() {
  if (this.$googleAction.getSignInStatus() === 'CANCELLED') {
    this.tell('Please sign in.');
  } else if (this.$googleAction.getSignInStatus() === 'OK') {
    this.tell('You are signed in now.');
  } else if (this.$googleAction.getSignInStatus() === 'ERROR') {
    this.tell('There was an error');
  }
},
```

For more information on Account Linking, check out our blogposts:
* [Alexa Skill Account Linking](https://www.jovo.tech/blog/alexa-account-linking-auth0/)
* [Google Actions Account Linking](https://www.jovo.tech/blog/google-action-account-linking-auth0/)

<!--[metadata]: {"description": "Learn how to deal with data when using the Jovo Framework.",
		            "route": "data"}-->
