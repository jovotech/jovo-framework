# [Platform Specific Features](../) > [Google Assistant](./README.md) > Data

Learn more about how to get access to user information.

* [Introduction](#introduction)
* [Location](#location)
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

## Account Linking

The Account Linking card is used to prompt the user to connect their account by providing the authorization url you defined in the configuration of your Skill in the Amazon developer console.

```javascript
this.alexaSkill().showAccountLinkingCard();
// or
const {AlexaSkill} = require('jovo-framework');

this.alexaSkill().showCard(new AlexaSkill.LinkAccountCard());
```



<!--[metadata]: {"title": "Alexa Data", "description": "Learn how to use the Alexa Dialog Interface with the Jovo Framework", "activeSections": ["platforms", "alexa", "alexa_data"], "expandedSections": "platforms", "inSections": "platforms", "breadCrumbs": {"Docs": "docs/", "Platforms": "docs/platforms",
"Amazon Alexa": "docs/amazon-alexa", "Dialog Interface": "" }, "commentsID": "framework/docs/amazon-alexa/data",
"route": "docs/amazon-alexa/data" }-->
