# [Platform Specific Features](../) > [Amazon Alexa](./README.md) > Data

Learn more about how to get access to user information.

* [Introduction](#introduction)
* [Location](#location)
* [Contact information](#contact-information)
* [Account Linking](#account-linking)


## Introduction

User information is mainly used to offer a more personalized expierence, but you can't access it right away. First you have to ask for permission.

## Location

You can use the user's address data to provide location specific features, but you have to obtain their permission first.
`permission card` will do the job:

```javascript
// Country and Postal Code
this.alexaSkill().showAskForCountryAndPostalCodeCard();

// Device Address
this.alexaSkill().showAskForAddressCard();
```

Get the country and postal code:

```javascript
this.alexaSkill().getCountryAndPostalCode();

// example
this.user().getCountryAndPostalCode()
    .then((data) => {
        this.tell('Your address is ' + data.postalCode + ' in ' + data.countryCode);
    }).catch((error) => {
        if (error.code === 'NO_USER_PERMISSION') {
            this.alexaSkill().showAskForCountryAndPostalCodeCard()
                .tell('Please grant access to your address');
        }
    });
```

Get the address:

```javascript
this.user().getDeviceAddress();

// example
this.user().getDeviceAddress()
    .then((data) => {
        this.tell('I got your address');
    }).catch((error) => {
        if (error.code === 'NO_USER_PERMISSION') {
            this.alexaSkill().showAskForAddressCard()
                .tell('Please grant access to your address');
        }
    });
```
[Official Documentation](https://developer.amazon.com/docs/custom-skills/device-address-api.html)

## Contact information

You can use contact information (name, email address, mobile number) to provide more personalized experiences for the user. To get access to the contact information, ask for permissions first. You can do this by using the `contact permission card`.

```javascript
// Full name
this.alexaSkill().showAskForContactPermissionCard('name');

// Given name
this.alexaSkill().showAskForContactPermissionCard('given-name');

// E-Mail
this.alexaSkill().showAskForContactPermissionCard('email');

// Mobile number
this.alexaSkill().showAskForContactPermissionCard('mobile_number');
```

Get the full name:

```javascript
this.user().getName();

// Example
this.user().getName()
    .then((name) => {
        this.tell(`Hello ${name}`);
    }).catch((error) => {
    if (error.code === 'NO_USER_PERMISSION') {
        this.alexaSkill().showAskForContactPermissionCard('name')
            .tell(`Please grant access to your full name.`);
        }
    });
```

Get the given name:

```javascript
this.user().getGivenName();

// Example
this.user().getGivenName()
    .then((givenName) => {
        this.tell(`Hello ${givenName}`);
    }).catch((error) => {
        if (error.code === 'NO_USER_PERMISSION') {
            this.alexaSkill().showAskForContactPermissionCard('given-name')
                .tell(`Please grant access to your given name.`);
        }
    });
```

Get the email address:

```javascript
this.user().getEmail();

// Example
this.user().getEmail()
    .then((email) => {
    this.tell(`Your email is ${email}`);
    }).catch((error) => {
        if (error.code === 'NO_USER_PERMISSION') {
            this.alexaSkill().showAskForContactPermissionCard('email')
                .tell(`Please grant access to your email address.`);
        }
    });
```

Get the mobile number:

```javascript
this.user().getMobileNumber();

// Example
this.user().getMobileNumber()
    .then((mobileNumber) => {
        this.tell(`Your number is ${mobileNumber.countryCode} ${mobileNumber.phoneNumber}`);
    }).catch((error) => {
        if (error.code === 'NO_USER_PERMISSION') {
            this.alexaSkill().showAskForContactPermissionCard('mobile_number')
                .tell(`Please grant access to your mobile number.`);
        }
    });

```

## Account Linking

The Account Linking card is used to prompt the user to connect their account by providing the authorization url you defined in the configuration of your Skill in the Amazon developer console.

```javascript
this.alexaSkill().showAccountLinkingCard();
// or
const {AlexaSkill} = require('jovo-framework');

this.alexaSkill().showCard(new AlexaSkill.LinkAccountCard());
```



<!--[metadata]: {"title": "Alexa Data", "description": "Learn how to get user specific data from your Alexa Skill users with the Jovo Framework", "activeSections": ["platforms", "alexa", "alexa_data"], "expandedSections": "platforms", "inSections": "platforms", "breadCrumbs": {"Docs": "docs/", "Platforms": "docs/platforms",
"Amazon Alexa": "docs/amazon-alexa", "Data": "" }, "commentsID": "framework/docs/amazon-alexa/data",
"route": "docs/amazon-alexa/data" }-->
