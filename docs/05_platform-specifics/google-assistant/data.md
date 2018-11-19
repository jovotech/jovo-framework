# [Platform Specific Features](../) > [Google Assistant](./README.md) > Data

Learn more about how to get access to user information.

* [Introduction](#introduction)
* [ON_PERMISSION](#on_permission)
* [Name](#name)
* [Location](#location)
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
    let user = this.$googleAction.getRequest().getUser();

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
    let user = this.$googleAction.getRequest().getUser();

    if (user.permissions.indexOf('DEVICE_COARSE_LOCATION') > -1) {
      let device = this.$googleAction.getRequest().getDevice();
      /*
        device.location.city
        device.location.zipCode
      */
    }
    if (user.permissions.indexOf('DEVICE_PRECISE_LOCATION') > -1) {
      let device = this.$googleAction.getRequest().getDevice();
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
[Official Documentation](https://developers.google.com/actions/assistant/helpers#place_and_location)

[Example](https://github.com/jovotech/jovo-framework-nodejs/blob/master/examples/google_action_specific/appAskForPermission.js)

## Account Linking

You can find the documentation about Account Linking here: [App Logic > Data](../../04_app-logic/02_data/README.md#account-linking, './data#account-linking')


<!--[metadata]: {"title": "Google Assistant Data", "description": "Learn more about how to use data with the Google Assistant", "activeSections": ["platforms", "assistant", "assistant_data"], "expandedSections": "platforms", "inSections": "platforms", "breadCrumbs": {"Docs": "docs/", "Platforms": "docs/platforms", "Google Assistant": "" }, "commentsID": "framework/docs/google-assistant/data",
"route": "docs/google-assistant/data" }-->
