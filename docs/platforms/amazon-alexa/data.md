# Data

Learn more about how to get access to user information.

- [Introduction](#introduction)
- [Location](#location)
  - [Geolocation](#geolocation)
    - [Geolocation Permission](#geolocation-permission)
    - [Geolocation Interface](#geolocation-interface)
    - [Geolocation Object](#geolocation-object)
- [Contact Information](#contact-information)
- [Account Linking](#account-linking)

## Introduction

User information is mainly used to offer a more personalized expierence, but you can't access it right away. First you have to ask for permission.

## Location

You can use the user's address data to provide location specific features, but you have to obtain their permission first.
`permission card` will do the job:

```javascript
// @language=javascript

// Country and Postal Code
this.$alexaSkill.showAskForCountryAndPostalCodeCard();

// Device Address
this.$alexaSkill.showAskForAddressCard();

// @language=typescript

// Country and Postal Code
this.$alexaSkill!.showAskForCountryAndPostalCodeCard();

// Device Address
this.$alexaSkill!.showAskForAddressCard();
```

Get the country and postal code:

```javascript
// @language=javascript

await this.$alexaSkill.$user.getCountryAndPostalCode();

// Example
async GetCountryAndPostalCodeIntent() {
    try {
        const countryAndPostalCode = await this.$alexaSkill.$user.getCountryAndPostalCode();

        this.tell(`${countryAndPostalCode.postalCode} in ${countryAndPostalCode.countryCode}`);

    } catch(error) {
        if (error.code === 'NO_USER_PERMISSION') {
            this.$alexaSkill.showAskForCountryAndPostalCodeCard()
                .tell(`Please grant access to your address in the Alexa app.`);
        } else {
            // Do something
        }
    }
},

// @language=typescript

await this.$alexaSkill!.$user.getCountryAndPostalCode();

// Example
async GetCountryAndPostalCodeIntent() {
    try {
        const countryAndPostalCode = await this.$alexaSkill!.$user.getCountryAndPostalCode();

        this.tell(`${countryAndPostalCode.postalCode} in ${countryAndPostalCode.countryCode}`);

    } catch(error: Error) {
        if (error.code === 'NO_USER_PERMISSION') {
            this.$alexaSkill!.showAskForCountryAndPostalCodeCard()
                .tell(`Please grant access to your address in the Alexa app.`);
        } else {
            // Do something
        }
    }
},
```

Get the address:

```javascript
// @language=javascript

await this.$alexaSkill.$user.getDeviceAddress()

// Example
async GetFullAddressIntent() {
    try {
        const address = await this.$alexaSkill.$user.getDeviceAddress();

        console.log(address);

    } catch(error) {
        if (error.code === 'NO_USER_PERMISSION') {
            this.$alexaSkill.showAskForAddressCard()
                .tell(`Please grant access to your address in the Alexa app.`);
        }
    }
},

// @language=typescript

await this.$alexaSkill!.$user.getDeviceAddress()

// Example
async GetFullAddressIntent() {
    try {
        const address = await this.$alexaSkill!.$user.getDeviceAddress();

        console.log(address);

    } catch(error: Error) {
        if (error.code === 'NO_USER_PERMISSION') {
            this.$alexaSkill!.showAskForAddressCard()
                .tell(`Please grant access to your address in the Alexa app.`);
        }
    }
},
```

Learn more in the [official documentation by Amazon](https://developer.amazon.com/docs/custom-skills/device-address-api.html).

### Geolocation

The geolocation allows you to access your user's real time location, which the system gets from the alexa enabled mobile device, e.g. their phone.

#### Geolocation Permission

To access the user's geolocation, you have to first add it to your skill's permission. You can do that in your `project.js` file:

```javascript
// project.js

module.exports = {
  alexaSkill: {
    nlu: 'alexa',
    manifest: {
      permissions: [
        {
          name: 'alexa::devices:all:geolocation:read'
        }
      ]
    }
  }

  // ...
};
```

After you've added it to your skill's permissions, your users can grant or deny you permission to access their geolocation data at any time. You can check the current status the following ways:

```javascript
// @language=javascript

this.$alexaSkill.getGeoLocationPermissionStatus(); // Either `GRANTED` or `DENIED`

this.$alexaSkill.isGeoLocationPermissionGranted(); // true or false

this.$alexaSkill.isGeoLocationPermissionDenied(); // true or false

// @language=typescript

this.$alexaSkill!.getGeoLocationPermissionStatus(); // Either `GRANTED` or `DENIED`

this.$alexaSkill!.isGeoLocationPermissionGranted(); // true or false

this.$alexaSkill!.isGeoLocationPermissionDenied(); // true or false
```

If the permission was denied you can send your user a permission card to ask them to turn it back on:

```javascript
// @language=javascript

this.$alexaSkill.showAskForGeoLocationCard();

// @language=typescript

this.$alexaSkill!.showAskForGeoLocationCard();
```

#### Geolocation Interface

After your user has given their consent the incoming requests may contain a `Geolocation` object, as it depends on the device and its settings.

To see whether a device supports the geolocation interface or not, you can use the following method:

```javascript
// @language=javascript

this.$alexaSkill.hasGeoLocationInterface() // true or false

// @language=typescript

this.$alexaSkill!.hasGeoLocationInterface() // true or false
```

#### Geolocation Object

The incoming `Geolocation` object has the following structure:

```javascript
"Geolocation":{
    "locationServices": {
        "access": "ENABLED",
        "status": "RUNNING",
    },
    "timestamp": "2018-03-25T00:00:00Z+00:00",
    "coordinate": {
        "latitudeInDegrees": 38.2,
        "longitudeInDegrees": 28.3,
        "accuracyInMeters": 12.1
    },
    "altitude": {
        "altitudeInMeters": 120.1,
        "accuracyInMeters": 30.1
    },
    "heading": {
        "directionInDegrees": 180.0,
        "accuracyInDegrees": 5.0
    },
    "speed": {
        "speedInMetersPerSecond": 10.0,
        "accuracyInMetresPerSecond": 1.1
    }
}
```

| Name                              | Description                                                        | Value                                   | Optional                   |
| :-------------------------------- | :----------------------------------------------------------------- | :-------------------------------------- | :------------------------- |
| `locationServices`                | Contains information whether location sharing is turned on          | `object`                                | Yes                        |
| `locationServices.access`         | Specifies whether location sharing is enabled or disabled           | `enum` - either `ENABLED` or `DISABLED` | No                         |
| `locationServices.status`         | Specifies whether location sharing is running or not                | `enum` - either `RUNNING` or `STOPPED`  | No                         |
| `timestamp`                       | Timestamp specifying when the location data was retrieved          | `string` - ISO 8601                     | No                         |
| `coordinate`                      | Contains information about the coordinates                         | `object`                                | No                         |
| `coordinate.latitudeInDegrees`    | Specifies the latitude in degrees                                  | `number` - [-90.0, 90.0]                | No                         |
| `coordinate.longitudeInDegrees`   | Specifies the longitude in degrees                                 | `number` - [-180.0, 180]                | No                         |
| `coordinate.accuracyInMeters`     | Specifies the uncertainty in the latitude and longitude in meters  | `number` - [0, MAX_INTEGER]             | No                         |
| `altitude`                        | Contains information about the altitude                            | `object`                                | Yes                        |
| `altitude.altitudeInMeters`       | Specifies the altitude in meters                                   | `number` - [-6350, 18000]               | Yes                        |
| `altitude.accuracyInMeters`       | The uncertainty in the altitude in meters                          | `number` - [0, MAX_INTEGER]             | Yes                        |
| `heading`                         | Contains information about the direction the device is heading     | `object`                                | Yes                        |
| `heading.directionInDegrees`      | The degrees from true north                                        | `number` - (0.0, 360.0]                 | Yes                        |
| `heading.accuracyInDegrees`       | The accuracy of the direction                                      | `number` - [0, MAX_INTEGER]             | Yes                        |
| `speed`                           | Contains information about the speed at which the device is moving | `object`                                | Yes                        |
| `speed.speedInMetersPerSecond`    | The meters per second within GPS limits                            | `number` - [0, 1900]                    | Yes, except for automotive |
| `speed.accuracyInMetersPerSecond` | The accuracy of the speed                                          | `number` - [0, MAX_INTEGER]             | Yes                        |

Each of these values can be `undefined`, but either the `locationServices` or `coordinate` object will be defined at all times.

You can access them the following way:

```javascript
// @language=javascript

// geolocation
this.$alexaSkill.getGeoLocationObject() // whole geolocation object

// locationServices
this.$alexaSkill.getLocationServicesObject() // whole object
this.$alexaSkill.getLocationServicesAccess()
this.$alexaSkill.getLocationServicesStatus()

// timestamp
this.$alexaSkill.getGeoLocationTimestamp()

// coordinate
this.$alexaSkill.getCoordinateObject() // whole object
this.$alexaSkill.getCoordinateLatitude()
this.$alexaSkill.getCoordinateLongitude()
this.$alexaSkill.getCoordinateAccuracy()

// altitude
this.$alexaSkill.getAltitudeObject() // whole object
this.$alexaSkill.getAltitude()
this.$alexaSkill.getAltitudeAccuracy()

// heading
this.$alexaSkill.getHeadingObject() // whole object
this.$alexaSkill.getHeadingDirection()
this.$alexaSkill.getHeadingAccuracy()

// speed
this.$alexaSkill.getSpeedObject() // whole object
this.$alexaSkill.getSpeed()
this.$alexaSkill.getSpeedAccuracy()

// @language=typescript

// geolocation
this.$alexaSkill!.getGeoLocationObject() // whole geolocation object

// locationServices
this.$alexaSkill!.getLocationServicesObject() // whole object
this.$alexaSkill!.getLocationServicesAccess()
this.$alexaSkill!.getLocationServicesStatus()

// timestamp
this.$alexaSkill!.getGeoLocationTimestamp()

// coordinate
this.$alexaSkill!.getCoordinateObject() // whole object
this.$alexaSkill!.getCoordinateLatitude()
this.$alexaSkill!.getCoordinateLongitude()
this.$alexaSkill!.getCoordinateAccuracy()

// altitude
this.$alexaSkill!.getAltitudeObject() // whole object
this.$alexaSkill!.getAltitude()
this.$alexaSkill!.getAltitudeAccuracy()

// heading
this.$alexaSkill!.getHeadingObject() // whole object
this.$alexaSkill!.getHeadingDirection()
this.$alexaSkill!.getHeadingAccuracy()

// speed
this.$alexaSkill!.getSpeedObject() // whole object
this.$alexaSkill!.getSpeed()
this.$alexaSkill!.getSpeedAccuracy()
```

## Contact Information

You can use contact information (name, email address, mobile number) to provide more personalized experiences for the user. To get access to the contact information, ask for permissions first. You can do this by using the `contact permission card`.

```javascript
// @language=javascript

// Full name
this.$alexaSkill.showAskForContactPermissionCard('name');

// Given name
this.$alexaSkill.showAskForContactPermissionCard('given-name');

// E-Mail
this.$alexaSkill.showAskForContactPermissionCard('email');

// Mobile number
this.$alexaSkill.showAskForContactPermissionCard('mobile_number');

// @language=typescript

// Full name
this.$alexaSkill!.showAskForContactPermissionCard('name');

// Given name
this.$alexaSkill!.showAskForContactPermissionCard('given-name');

// E-Mail
this.$alexaSkill!.showAskForContactPermissionCard('email');

// Mobile number
this.$alexaSkill!.showAskForContactPermissionCard('mobile_number');
```

Get the full name:

```javascript
// @language=javascript

await this.$alexaSkill.$user.getName()

// Example
async GetFullNameIntent() {
    try {
        const name = await this.$alexaSkill.$user.getName();
        this.tell(`Hello ${name}.`);

    } catch(error) {
        if (error.code === 'NO_USER_PERMISSION') {
            this.$alexaSkill.showAskForContactPermissionCard('name')
                .tell(`Please grant access to your full name.`);
        }
    }
},

// @language=typescript

await this.$alexaSkill!.$user.getName()

// Example
async GetFullNameIntent() {
    try {
        const name = await this.$alexaSkill!.$user.getName();
        this.tell(`Hello ${name}.`);

    } catch(error: Error) {
        if (error.code === 'NO_USER_PERMISSION') {
            this.$alexaSkill!.showAskForContactPermissionCard('name')
                .tell(`Please grant access to your full name.`);
        }
    }
},
```

Get the given name:

```javascript
// @language=javascript

await this.$alexaSkill.$user.getGivenName()

// Example
async GetGivenNameIntent() {
    try {
        const givenName = await this.$alexaSkill.$user.getGivenName();
        this.tell(`Hello ${givenName}.`);

    } catch(error) {
        if (error.code === 'NO_USER_PERMISSION') {
            this.$alexaSkill.showAskForContactPermissionCard('given_name')
                .tell(`Please grant access to your given name.`);
        }
    }
},

// @language=typescript

await this.$alexaSkill!.$user.getGivenName()

// Example
async GetGivenNameIntent() {
    try {
        const givenName = await this.$alexaSkill!.$user.getGivenName();
        this.tell(`Hello ${givenName}.`);

    } catch(error: Error) {
        if (error.code === 'NO_USER_PERMISSION') {
            this.$alexaSkill!.showAskForContactPermissionCard('given_name')
                .tell(`Please grant access to your given name.`);
        }
    }
},
```

Get the email address:

```javascript
// @language=javascript

await this.$alexaSkill.$user.getEmail()

// Example
async GetEmailIntent() {
    try {
        const email = await this.$alexaSkill.$user.getEmail();
        this.tell(`Your email address is ${email}`);

    } catch(error) {
        if (error.code === 'NO_USER_PERMISSION') {
            this.$alexaSkill.showAskForContactPermissionCard('email')
                .tell(`Please grant access to your email address.`);
        }
    }
},

// @language=typescript

await this.$alexaSkill!.$user.getEmail()

// Example
async GetEmailIntent() {
    try {
        const email = await this.$alexaSkill!.$user.getEmail();
        this.tell(`Your email address is ${email}`);

    } catch(error: Error) {
        if (error.code === 'NO_USER_PERMISSION') {
            this.$alexaSkill!.showAskForContactPermissionCard('email')
                .tell(`Please grant access to your email address.`);
        }
    }
},
```

Get the mobile number:

```javascript
// @language=javascript

await this.$alexaSkill.$user.getMobileNumber()

// Example
async getMobileNumberIntent() {
    try {
        const mobileNumber = await this.$alexaSkill.$user.getMobileNumber();
        this.tell(`Your number is ${mobileNumber.countryCode} ${mobileNumber.phoneNumber}`);

    } catch(error) {
        if (error.code === 'NO_USER_PERMISSION') {
            this.$alexaSkill.showAskForContactPermissionCard('mobile_number')
                .tell(`Please grant access to your mobile number.`);
        }
    }
},

// @language=typescript

await this.$alexaSkill!.$user.getMobileNumber()

// Example
async getMobileNumberIntent() {
    try {
        const mobileNumber = await this.$alexaSkill!.$user.getMobileNumber();
        this.tell(`Your number is ${mobileNumber.countryCode} ${mobileNumber.phoneNumber}`);

    } catch(error: Error) {
        if (error.code === 'NO_USER_PERMISSION') {
            this.$alexaSkill!.showAskForContactPermissionCard('mobile_number')
                .tell(`Please grant access to your mobile number.`);
        }
    }
},
```

## Account Linking

You can find the documentation about Account Linking here: [App Logic > Data](../../basic-concepts/data/README.md#account-linking, '../data#account-linking')

<!--[metadata]: {"description": "Learn how to get user specific data from your Alexa Skill users with the Jovo Framework",
"route": "amazon-alexa/data" }-->
