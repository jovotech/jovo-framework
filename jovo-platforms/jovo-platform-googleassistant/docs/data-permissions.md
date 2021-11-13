# User Data & Permissions

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-googleassistant/data-permissions

Learn more about how to get access to Google Action user information.

* [Introduction](#introduction)
* [User ID](#user-id)
* [ON_PERMISSION](#onpermission)
* [Name](#name)
* [Location](#location)
* [Date and Time](#date-and-time)
* [Account Linking](#account-linking)

## Introduction

User information is mainly used to offer a more personalized experience, but you can't access it right away. First you have to ask for permission.

## User ID

In previous versions of Jovo, the `userId` for Google Actions was taken from the request's user ID. In 2018, Google [deprecated this element of the request JSON](https://developers.google.com/actions/identity/user-info) and recommended [webhook generated user IDs](https://developers.google.com/actions/identity/user-info#migrating_to_webhook-generated_ids) as an alternative way to store user data.

In Jovo, a Google Action `userId` is created in the following process:

- If there is a `userId` defined in the [userStorage](https://developers.google.com/actions/assistant/save-data), take this
- If not, use the `userId` from the request (if there is one) and then save it in `userStorage`
- If there is no `userId` in the request, generate one using `uuidv4`, and then save it to `userStorage`

Note: `userStorage` only works for Google Assistant users who have voice match enabled. [Learn more in the official Google Docs](https://developers.google.com/actions/assistant/save-data#user_storage_expiration).

## ON_PERMISSION

After the user has answered your request, they will be redirected to the `ON_PERMISSION` intent, if available, where you can access and store the data.

```javascript
ON_PERMISSION() {
  
}
```

## Name

You can get access to the user's [`given name`, `family name` and `display name`](https://developers.google.com/actions/reference/v1/conversation#UserProfile). 

```javascript
// @language=javascript

// Ask for permission
this.$googleAction.askForName(speech);

// @language=typescript

// Ask for permission
this.$googleAction!.askForName(speech: string);
```

```javascript
// @language=javascript

ON_PERMISSION() {
  if (this.$googleAction.isPermissionGranted()) {

    // Check, if you have the necessary permission
    if (this.$googleAction.$user.hasPermission('NAME')) {
      let profile = this.$googleAction.$user.getProfile();
      /* 
        profile.givenName
        profile.familyName
        profile.displayName
      */
    }
  }
}

// @language=typescript

ON_PERMISSION() {
  if (this.$googleAction!.isPermissionGranted()) {

    // Check, if you have the necessary permission
    if (this.$googleAction!.$user.hasPermission('NAME')) {
      let profile = this.$googleAction!.$user.getProfile();
      /* 
        profile.givenName
        profile.familyName
        profile.displayName
      */
    }
  }
}
```

## Location

Get access to the user's [location](https://developers.google.com/actions/reference/v1/conversation#Device).
Depending on the device the request comes from and the permission you have, you can get access to different data. 

If it's a phone, you can only access the `latitude` and `longitude` with the `DEVICE_PRECISE_LOCATION` permission.

On a voice-enabled speaker you can access all of the data, depending on the permission you have.

```javascript
// @language=javascript

this.$googleAction.askForPreciseLocation(speech);

this.$googleAction.askForZipCodeAndCity(speech);

// @language=typescript

this.$googleAction.askForPreciseLocation(speech: string);

this.$googleAction.askForZipCodeAndCity(speech: string);
```

```javascript
// @language=javascript

ON_PERMISSION() {
  if (this.$googleAction.isPermissionGranted()) {

    // Check, if you have the necessary permission
    if (this.$googleAction.$user.hasPermission('DEVICE_COARSE_LOCATION')) {
      let device = this.$googleAction.getDevice();
      /*
        device.location.city
        device.location.zipCode
      */
    }
    if (this.$googleAction.$user.hasPermission('DEVICE_PRECISE_LOCATION')) {
      let device = this.$googleAction.getDevice();
      /*
        device.location.coordinates.latitude
        device.location.coordinates.longitude
        device.location.formattedAddress
        device.location.city
        device.location.zipCode
      */
    }
  } else {
    this.tell('Alright, maybe next time');
  }
},

// @language=typescript

ON_PERMISSION() {
  if (this.$googleAction!.isPermissionGranted()) {

    // Check, if you have the necessary permission
    if (this.$googleAction!.$user.hasPermission('DEVICE_COARSE_LOCATION')) {
      let device = this.$googleAction!.getDevice();
      /*
        device.location.city
        device.location.zipCode
      */
    }
    if (this.$googleAction!.$user.hasPermission('DEVICE_PRECISE_LOCATION')) {
      let device = this.$googleAction!.getDevice();
      /*
        device.location.coordinates.latitude
        device.location.coordinates.longitude
        device.location.formattedAddress
        device.location.city
        device.location.zipCode
      */
    }
  } else {
    this.tell('Alright, maybe next time');
  }
},
```
[Official Documentation](https://developers.google.com/actions/assistant/helpers#user_information).

[Example](https://github.com/jovotech/jovo-framework/tree/master/examples/javascript/02_googleassistant/ask-for-x)


### Place and Location

You can also prompt the user for their current location using the `askForPlace()` helper:

```javascript
// @language=javascript

this.$googleAction.askForPlace('Where would you like to be picked up?', 'To find a place to pick you up');

// @language=typescript

this.$googleAction!.askForPlace('Where would you like to be picked up?', 'To find a place to pick you up');
```

The user's response will be mapped to the `ON_PLACE` intent, where you can access the user's input using the `getPlace()` method:

```javascript
// @language=javascript

ON_PLACE() {
  const place = this.$googleAction.getPlace();
}

// @language=typescript

ON_PLACE() {
  const place = this.$googleAction!.getPlace();
}
```

Here's an example for the place object you will receive:

```javascript
{
  "formattedAddress": "123 Main Street, Springfield, OR 97477-5319, USA",
  "coordinates": {
          "latitude": 44.0461033,
          "longitude": -123.024248
  },
  "name": "123 Main St"
},
```                                               

## Date and Time

You can request the user's date and time using the following helper method:

```javascript
// @language=javascript

this.$googleAction.askForDateTime({
    requestTimeText: 'What time?',
    requestDateText: 'What day was that?',
    requestDatetimeText: 'When would you like to schedule the appointment?',
});

// @language=typescript

this.$googleAction!.askForDateTime({
    requestTimeText: 'What time?',
    requestDateText: 'What day was that?',
    requestDatetimeText: 'When would you like to schedule the appointment?',
});
```

The user's response will be mapped to the `ON_DATETIME` intent, where you can access their response object using `this.$googleAction.getDateTime()`:

```javascript
// @language=javascript

ON_DATETIME() {
    const dateTime =  this.$googleAction.getDateTime();
}

// @language=typescript

ON_DATETIME() {
    const dateTime =  this.$googleAction!.getDateTime();
}
```

Here's an example how the `DATETIME` object you receive would look like:

```javascript
{
    "date": {
        "month": 5,
        "year": 2019,
        "day": 3
    },
    "time": {
        "hours": 11,
        "minutes": 30
    }
},
```

## Account Linking

To implement Account Linking in your voice application, you need two core methods.

The first allows you to prompt the user to link their account, using the `askForSignIn()` method. Optionally, you can parse a string to specify the purpose for which your app needs the user to sign in:

```javascript
// @language=typescript

this.askForSignIn('To track your record');

// @language=javascript

this.askForSignIn('To track your record');
```

After the user has responded to your account linking request, you will receive a request to notify you about the result, which will be mapped to the Jovo built-in `ON_SIGN_IN` intent. Using the `getSignInStatus()` method you can get the result:

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

If the user signed in successfully, an access token will be added to every request your skill receives. You can access it using the `getAccessToken()` method:

```javascript
// @language=typescript

this.$request!.getAccessToken();

// @language=javascript

this.$request.getAccessToken();
```

> For a complete walk-through, check out our tutorial: [Google Actions Account Linking](https://v3.jovo.tech/tutorials/google-action-account-linking-auth0/)