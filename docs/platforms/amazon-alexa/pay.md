# Amazon Pay

* [Introduction](#introduction)
* [Permissions](#permissions)
* [Send the Directive](#send-the-directive)

## Introduction

The Amazon Pay integration allows you to sell physical goods and services through Alexa with the whole purchase flow being handled inside the voice experience.

The following documentation will only contain Jovo specific features like helper functions or `project.js` modifications. Please use the official Amazon documentation for the JSON interfaces, guidelines, etc. You can find them [here](https://developer.amazon.com/docs/amazon-pay/amazon-pay-overview.html)

## Permissions

To use Amazon Pay you have to add it to the permissions your skill needs. For that add the following to your `project.js` file:

```javascript
module.exports = {
   alexaSkill: {
      nlu: 'alexa',
      manifest: {
         permissions: [
            {
               name: 'payments:autopay_consent'
            }
         ]
      },
   }
   // ...
};
```

After that build and deploy the files:

```sh
# Build platform specific files for Alexa
$ jovo build --platform alexaSkill

# Deploy only the Skill information for Alexa
$ jovo deploy --platform alexaSkill --target info

# Alternative: Shortcut for both commands
$ jovo build -p alexaSkill --deploy --target info
```

To check whether the user granted you the permission you can use the following helper methods:

```javascript
// @language=javascript

this.$alexaSkill.getAmazonPayPermissionStatus() // returns either "GRANTED" or "DENIED"

this.$alexaSkill.isAmazonPayPermissionGranted() // returns true if the permission was granted

this.$alexaSkill.isAmazonPayPermissionDenied() // returns true if the permission was denied

// @language=typescript

this.$alexaSkill!.getAmazonPayPermissionStatus() // returns either "GRANTED" or "DENIED"

this.$alexaSkill!.isAmazonPayPermissionGranted() // returns true if the permission was granted

this.$alexaSkill!.isAmazonPayPermissionDenied() // returns true if the permission was denied
```

If the user didn't provide the permission you can prompt them to grant the permission by showing them a card in the Alexa app:

```javascript
// @language=javascript

this.$alexaSkill.showAskForAmazonPayPermissionCard();

// @language=typescript

this.$alexaSkill!.showAskForAmazonPayPermissionCard();
```

## Send the Directive

Both the `Setup` and `Charge` directive are simply JS objects which you can add to the response using the `addDirective()` method:

```javascript
// @language=javascript

const setupDirective = {
    "type": "Connections.SendRequest",
    "name": "Setup",
    "payload": {
        "@type": "SetupAmazonPayRequest",
        "@version": "2",
        "sellerId": "AEMGQXXXKD154",
        "countryOfEstablishment": "US",
        "ledgerCurrency": "USD",
        "checkoutLanguage": "en_US",
        "billingAgreementAttributes": {
            "@type": "BillingAgreementAttributes ",
            "@version": "2",
            "sellerNote": "Billing Agreement Seller Note",
            "sellerBillingAgreementAttributes": {
                "@type": "SellerBillingAgreementAttributes ",
                "@version": "2",
                "sellerBillingAgreementId": "BA12345",
                "storeName": "Test store name",
                "customInformation": "Test custom information"
            }
        },
        "needAmazonShippingAddress": false
    },
    "token": "correlationToken"
};

this.$alexaSkill.addDirective(setupDirective);

// @language=typescript

const setupDirective = {
    "type": "Connections.SendRequest",
    "name": "Setup",
    "payload": {
        "@type": "SetupAmazonPayRequest",
        "@version": "2",
        "sellerId": "AEMGQXXXKD154",
        "countryOfEstablishment": "US",
        "ledgerCurrency": "USD",
        "checkoutLanguage": "en_US",
        "billingAgreementAttributes": {
            "@type": "BillingAgreementAttributes ",
            "@version": "2",
            "sellerNote": "Billing Agreement Seller Note",
            "sellerBillingAgreementAttributes": {
                "@type": "SellerBillingAgreementAttributes ",
                "@version": "2",
                "sellerBillingAgreementId": "BA12345",
                "storeName": "Test store name",
                "customInformation": "Test custom information"
            }
        },
        "needAmazonShippingAddress": false
    },
    "token": "correlationToken"
};

this.$alexaSkill!.addDirective(setupDirective);
```

The request you will receive as the response to the directive, `Connections.Response` will be mapped to the Jovo built-in `ON_PURCHASE` intent:

```javascript
ON_PURCHASE() {
    const request = this.$request.toJSON(); // Access the request object
}
```

For the reference for both the `Setup` and `Charge` directive, please use the official Amazon documentation which you can find [here](https://developer.amazon.com/docs/amazon-pay/amazon-pay-apis-for-alexa.html).

<!--[metadata]: {"description": "Learn how to use the Amazon Pay feature with Jovo",
"route": "amazon-alexa/pay" }-->
