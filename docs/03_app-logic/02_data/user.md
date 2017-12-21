# [App Logic](../) > [Data](./README.md) > User

In this section, you will learn how to use the Jovo User class to persist user specific data and create contextual experiences for your voice apps.

* [Introduction](#introduction-to-the-user-class)
* [User Data](#user-data)
  * [Data Persistence](#data-persistence)
  * [Meta Data](#meta-data)
  * [User ID](#user-id)
  * [Account Linking](#account-linking)


## Introduction to the User Class

The `User` object offers helpful features to build contextual, user specific experiences into your voice applications.

You can access the user object like this:

```javascript
let user = app.user();
```

## User Data

The User object contains the possibility to store and retrieve user specific data, including [meta data](#meta-data).

Data is stored using our [database integrations](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/06_integrations/databases), with a file-based `db.json` structure enabled by default.

Just specify a key and a value, and you're good to go:

```javascript
app.setConfig({
    userDataCol: 'yourUserDataColName',
    // Other configurations
});
```


### Data Persistence

With our Jovo Persistence Layer, you can store user specific data easily to either a database or a local JSON file.

Just specify a key and a value, and you're good to go: 

```javascript
app.user().data.key = value;

// Example
app.user().data.score = 300;
```

For more information on data persistence, take a look here: [Integrations > Databases](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/06_integrations/databases).


### Meta Data

The user object meta data is the first step towards building more contextual experiences with the Jovo Framework. Right now, the following data is automatically stored (by default on the FilePersistence `db.json`, or DynamoDB if you enable it):

* `createdAt`: When the user first used your app
* `lastUsedAt`: When was the last time your user interacted with your app
* `sessionsCount`': How often did your user engage with your app

```javascript
let userCreatedAt = app.user().metaData.createdAt; 
let userlastUsedAt = app.user().metaData.lastUsedAt; 
let userSessionsCount = app.user().metaData.sessionsCount;
```

You can change the type of meta data to store with the `setConfig` method. This is the default configuration for it:

```javascript
app.setConfig({
    userMetaData: {
        lastUsedAt: true,
        sessionsCount: true,
        createdAt: true,
        requestHistorySize: 0,
        devices: false,
    }
    // Other configurations
});

```

### User ID

Returns user ID on the particular platform, either Alexa Skill User ID or Google Actions User ID:

```javascript
app.user().getId();

// Alternatively, you can also use this
app.getUserId();
```

This is going to return an ID that looks like this:

```
// For Amazon Alexa
amzn1.ask.account.AGJCMQPNU2XQWLNJXU2K23R3RWVTWCA6OX7YK7W57E7HVZJSLH4F5U2JOLYELR4PSDSFGSDSD32YHMRG36CUUAY3G5QI5QFNDZ44V5RG6SBN3GUCNTRHAVT5DSDSD334e34I37N3MP2GDCHO7LL2JL2LVN6UFJ6Q2GEVVKL5HNHOWBBD7ZQDQYWNHYR2BPPWJPTBPBXPIPBVFXA

// For Google Assistant
ARke43GoJIqbF8g1vfyDdqL_Sffh
```

### Account Linking

To implement Account Linking in your voice application you need two core methods.

The first allows you to prompt the user to link their account, by showing a card in the respective companion app:
```javascript
// Alexa Skill:
app.alexaSkill().showAccountLinkingCard();

// Google Actions:
app.googleAction().showAccountLinkingCard();
```

The other method returns you the access token, which will be added to every request your skill gets, after the user linked their account:
```javascript
app.getAccessToken();
```

For more information on Account Linking, check out our blogposts:
* [Alexa Skill Account Linking](https://www.jovo.tech/blog/alexa-account-linking-auth0/)
* [Google Actions Account Linking](https://www.jovo.tech/blog/google-action-account-linking-auth0/)