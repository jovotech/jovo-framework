# [App Logic](./) > [Data](README.md) > User

* [Introduction](#introduction)
* [User Data](#user-data)
  * [Data Persistence](#data-persistence)
  * [Metadata](#meta-data)
  * [User ID](#user-id)


## Introduction

The `User` object offers helpful features to build contextual, user specific experiences into your voice applications.

You can access the user object like this:

```javascript
let user = app.user();
```

## User Data

The User object contains the possibility to store and retrieve user specific data, including [meta data](#meta-data).

### Data Persistence

With our [database integrations](https://github.com/jovotech/jovo-framework-nodejs/tree/master/docs/06_integrations/databases), you can store user specific data easily.

Just specify a key and a value, and you're good to go: 

```javascript
app.user().data.key = value;

// Example
app.user().data.score = 300;
```


### Meta Data

The user object metadata is the first step towards building more contextual experiences with the Jovo Framework. Right now, the following data is automatically stored (by default on the FilePersistence db.json, or DynamoDB if you enable it):

* createdAt: When the user first used your app
* lastUsedAt: When was the last time your user interacted with your app
* sessionsCount: How often did your user engage with your app

```javascript
let userCreatedAt = app.user().metaData.createdAt; 
let userlastUsedAt = app.user().metaData.lastUsedAt; 
let userSessionsCount = app.user().metaData.sessionsCount;
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
