# Data

> To view this page on the Jovo website, visit https://v3.jovo.tech/docs/data

Learn more about different data types that can be used in a Jovo project.

- [Introduction](#introduction)
- [Request Data](#request-data)
- [Session Data](#session-data)
- [User Data](#user-data)
- [App Data](#app-data)
- [Account Linking](#account-linking)

## Introduction

> [Learn more about sessions and the request & response lifecycle here](../requests-responses.md './requests-responses').

The Jovo Framework uses different concepts of data:

- [Request Data](#request-data): Only stored for this specific request.
- [Session Data](#request-data): Only stored for this session, across requests.
- [User Data](#persisting-data): Stored in a database, across sessions.
- [App Data](#app-data): Stored as long as the code is running.

## Request Data

Request data is written into the Jovo object (`this`) and only stored for a specific request. This can be helpful if data is used across different methods (e.g. if [Intent Redirects](../routing#intent-redirects './routing#intent-redirects') are used).

We recommend the following practice to store data in the Jovo object:

```javascript
this.$data.key = value;
```

## Session Data

Session data (also called session attributes) stores data in the JSON response back to the platform, which can then be accessed in the next request (as long as the session stays active).

You can store elements into the session data like this:

```javascript
this.$session.$data.key = value;
```

[States](../routing/states.md './routing/states') are also stored as session data/attributes.

## User Data

The [Jovo User](./user.md './data/user') object uses [database integrations](../../integrations/databases './databases') to persist user specific data across sessions.

The data can be stored like this:

```javascript
this.$user.$data.key = value;
```

> [Learn more about the Jovo User object here](./user.md './data/user').

## App Data

App data is a special data type that stores data into the `app` object, which exists as long as the server is running:

```javascript
this.$app.$data.key = value;
```

For example, this can be used for non-user-specific information that needs an API call that is not necessary to be executed at every request. By saving data into the `app` object, the API call only needs to be done once while the server is running or the function is warm.

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

For more information on Account Linking, check out our blogposts:

- [Alexa Skill Account Linking](https://v3.jovo.tech/tutorials/alexa-account-linking-auth0/)
- [Google Actions Account Linking](https://v3.jovo.tech/tutorials/google-action-account-linking-auth0/)

<!--[metadata]: {"description": "Learn more about different data types that can be used in a Jovo project.", "route": "data"}-->
