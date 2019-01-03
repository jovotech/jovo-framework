# Data

Learn more about how to get access to user information.

* [Introduction](#introduction)
* [Location](#location)
* [Contact Information](#contact-information)
* [Account Linking](#account-linking)


## Introduction

User information is mainly used to offer a more personalized expierence, but you can't access it right away. First you have to ask for permission.

## Location

You can use the user's address data to provide location specific features, but you have to obtain their permission first.
`permission card` will do the job:

```javascript
// Country and Postal Code
this.$alexaSkill.showAskForCountryAndPostalCodeCard();

// Device Address
this.$alexaSkill.showAskForAddressCard();
```

Get the country and postal code:

```javascript
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
```

Get the address:

```javascript
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
```

Learn more in the [official documentation by Amazon](https://developer.amazon.com/docs/custom-skills/device-address-api.html).


## Contact Information

You can use contact information (name, email address, mobile number) to provide more personalized experiences for the user. To get access to the contact information, ask for permissions first. You can do this by using the `contact permission card`.

```javascript
// Full name
this.$alexaSkill.showAskForContactPermissionCard('name');

// Given name
this.$alexaSkill.showAskForContactPermissionCard('given-name');

// E-Mail
this.$alexaSkill.showAskForContactPermissionCard('email');

// Mobile number
this.$alexaSkill.showAskForContactPermissionCard('mobile_number');
```

Get the full name:

```javascript
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
```

Get the given name:

```javascript
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
```

Get the email address:

```javascript
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
```

Get the mobile number:

```javascript
await this.$alexaSkill.$user.getMobileNumber()

// Example
async getMobileNumberIntent() {
    try {
        const number = await this.$alexaSkill.$user.getMobileNumber();
        this.tell(`Your number is ${mobileNumber.countryCode} ${mobileNumber.phoneNumber}`);

    } catch(error) {
        if (error.code === 'NO_USER_PERMISSION') {
            this.$alexaSkill.showAskForContactPermissionCard('mobile_number')
                .tell(`Please grant access to your mobile number.`);
        }
    }
},
```

```javascript
this.$alexaSkill.$user.getMobileNumber();

// Example
this.$alexaSkill.$user.getMobileNumber()
    .then((mobileNumber) => {
        this.tell(`Your number is ${mobileNumber.countryCode} ${mobileNumber.phoneNumber}`);
    }).catch((error) => {
        if (error.code === 'NO_USER_PERMISSION') {
            this.$alexaSkill.showAskForContactPermissionCard('mobile_number')
                .tell(`Please grant access to your mobile number.`);
        }
    });

```

## Account Linking

You can find the documentation about Account Linking here: [App Logic > Data](../../basic-concepts/data/README.md#account-linking, '../data#account-linking')

<!--[metadata]: {"description": "Learn how to get user specific data from your Alexa Skill users with the Jovo Framework",
"route": "amazon-alexa/data" }-->
