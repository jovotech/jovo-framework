# Data

Learn more about how to get access to user information.

* [Introduction](#introduction)
* [ON_PERMISSION](#onpermission)
* [Name](#name)
* [Location](#location)
* [Date and Time](#date-and-time)
* [Account Linking](#account-linking)

## Introduction

User information is mainly used to offer a more personalized experience, but you can't access it right away. First you have to ask for permission.

## ON_PERMISSION

After the user has answered your request, they will be redirected to the `ON_PERMISSION` intent, if availabe, where you can access and store the data.

```javascript
ON_PERMISSION() {
  
}
```

## Name

You can get access to the user's [`given name`, `family name` and `display name`](https://developers.google.com/actions/reference/v1/conversation#UserProfile). 

```javascript
// Ask for permission
this.$googleAction.askForName(speech);
```
```javascript
ON_PERMISSION() {
  if (this.$googleAction.isPermissionGranted()) {
    let user = this.$googleAction.$user.getProfile();

    // Check, if you have the necessary permission
    if (user.permissions.indexOf('NAME') > -1) {
      /* 
        user.profile.givenName
        user.profile.familyName
        user.profile.displayName
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
this.$googleAction.askForPreciseLocation(speech);

this.$googleAction.askForZipCodeAndCity(speech);
```
```javascript
ON_PERMISSION() {
  if (this.$googleAction.isPermissionGranted()) {
    let user = this.$googleAction.$request.getUser();

    if (user.permissions.indexOf('DEVICE_COARSE_LOCATION') > -1) {
      let device = this.$googleAction.getDevice();
      /*
        device.location.city
        device.location.zipCode
      */
    }
    if (user.permissions.indexOf('DEVICE_PRECISE_LOCATION') > -1) {
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
```
[Official Documentation](https://developers.google.com/actions/assistant/helpers#user_information)

[Example](https://github.com/jovotech/jovo-framework/tree/master/examples/02_googleassistant/ask-for-x)

### Place and Location

You can also prompt the user for their current location using the `askForPlace()` helper:

```javascript
this.$googleAction.askForPlace('Where would you like to be picked up?', 'To find a place to pick you up');
```

The user's response will be mapped to the `ON_PLACE` intent, where you can access the user's input using the `getPlace()` method:

```javascript
ON_PLACE() {
  const place = this.$googleAction.getPlace();
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
this.$googleAction.askForDateTime({
    requestTimeText: 'What time?',
    requestDateText: 'What day was that?',
    requestDatetimeText: 'When would you like to schedule the appointment?',
});
```

The user's response will be mapped to the `ON_DATETIME` intent, where you can access their response object using `this.$googleAction.getDateTime()`:

```javascript
ON_DATETIME() {
    const dateTime =  this.$googleAction.getDateTime();
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

You can find the documentation about Account Linking here: [App Logic > Data](../../basic-concepts/data/README.md#account-linking, './data#account-linking')

<!--[metadata]: {"description": "Learn more about how to use data with the Google Assistant",
"route": "google-assistant/data" }-->
