# Amazon Pay

> To view this page on the Jovo website, visit https://www.jovo.tech/marketplace/jovo-platform-alexa/monetization/amazon-pay

Learn how to sell physical goods and services in your Alexa Skills using Amazon Pay and Jovo.

* [Introduction](#introduction)
* [Permissions](#permissions)
* [Buyer Id](#buyer-id)
* [Buyer Address](#buyer-address)
  * [Default Buyer Address](#default-buyer-address)
* [Send the Directive](#send-the-directive)
  * [Payload Builder](#payload-builder)
    * [Setup Payload Builder](#setup-payload-builder)
    * [Charge Payload Builder](#charge-payload-builder)

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
$ jovo3 build --platform alexaSkill

# Deploy only the Skill information for Alexa
$ jovo3 deploy --platform alexaSkill --target info

# Alternative: Shortcut for both commands
$ jovo3 build -p alexaSkill --deploy --target info
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

## Buyer Id

To get the user's buyer id, you can use the `getBuyerId()` helper method.

You have to parse the method an options object with the following properties:

Name | Description | Value | Required
:--- | :--- | :--- | :---
`host` | Depending on the user's region, you have to send the api request to different hosts. For **NA** it's `pay-api.amazon.com`, for **EU & UK** it's `pay-api.amazon.eu` and for **JP** it's `pay-api.amazon.jp` | `String` | Yes

```js
// @language=javascript

const options = {
    host: 'pay-api.amazon.com'
}
const response = await this.$alexaSkill.$user.getBuyerId(options);

// @language=typescript

const options: AmazonPayApiRequestOptions = {
    host: 'pay-api.amazon.com'
}
const response = await this.$alexaSkill.$user.getBuyerId(options);
```

If your request was successful, you will receive a response object with the following structure:

Name | Description | Value
:--- | :--- | :---
`buyerId` | The user's buyer id | `String`

## Buyer Address

To access the user's buyer address, you can use the `getBuyerAddress()` helper method.

You have to parse the method an options object with the following properties:

Name | Description | Value | Required
:--- | :--- | :--- | :---
`host` | Depending on the user's region, you have to send the api request to different hosts. For **NA** it's `pay-api.amazon.com`, for **EU & UK** it's `pay-api.amazon.eu` and for **JP** it's `pay-api.amazon.jp` | `String` | Yes
`sellerId` | Your seller id | `String` | Yes
`sandbox` | A boolean to specify wether you want to use the sandbox mode or not. The default value is `false` | `Boolean` | No
`sandboxEmail` | The email address for the sandbox user account. Is only required, if `sandbox` is set to `true` | `String` | No

```js
// @language=javascript

const options = {
    host: 'pay-api.amazon.com',
    sellerId: 'xyz'
};
const response = await this.$alexaSkill.$user.getBuyerAddress(options);

// @language=typescript

const options: AmazonPayApiRequestOptions = {
    host: 'pay-api.amazon.com',
    sellerId: 'xyz'
};
const response = await this.$alexaSkill.$user.getBuyerAddress(options);
```

If your request was successful, you will receive a response object with an array containing all of the user's addresses:

Name | Description | Value
:--- | :--- | :---
`addresses` | Array of `address` objects | `Object[]`
`addresses[].address` | address object | `Object`
`addresses[].address.addressLine1` | | `String`
`addresses[].address.city` | | `String`
`addresses[].address.countryCode` | | `String`
`addresses[].address.name` | | `String`
`addresses[].address.phone` | | `String`
`addresses[].address.postalCode` | | `String`
`addresses[].address.stateOrRegion` | | `String`
`addresses[].addressType` | | `String`

### Default Buyer Address

To get the buyer's default shipping address directly, use `getDefaultBuyerAddress()`.

The function expects the same object as a parameter as [`getBuyerAddress()`](#buyer-address). As a response you get the default shipping addresses' object.

```js
// @language=javascript

const options = {
    host: 'pay-api.amazon.com',
    sellerId: 'xyz'
};
const defaultAddress = await this.$alexaSkill.$user.getDefaultBuyerAddress(options);

// @language=typescript

const options: AmazonPayApiRequestOptions = {
    host: 'pay-api.amazon.com',
    sellerId: 'xyz'
};
const defaultAddress = await this.$alexaSkill.$user.getDefaultBuyerAddress(options);
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

### Payload Builder

For both the `Setup` and `Charge` we offer a payload builder. It takes care of all the default values of the payload.

After building the payload using the respective helper methods, you call the `build()` method, which will return you the final object. 

#### Setup Payload Builder

```js
// @language=javascript

const payload = this.$alexaSkill.$pay.createSetupPayload()
    .setSellerId('YOUR SELLER ID')
    .setCountryOfEstablishment('DE')
    .setLedgerCurrency('EUR')
    .setCheckoutLanguage('en_US')
    .setSellerBillingAgreementId('id')
    .setBillingAgreementType('CustomerInitiatedTransaction')
    .setSubscriptionAmount('19.99')
    .setSubscriptionCurrencyCode('EUR')
    .setStoreName('Test name')
    .setCustomInformation('custom info')
    .setNeedAmazonShippingAddress(true)
    .setSandboxMode(true)
    .setSandboxEmail('test@jovo.tech')
    .build();

// @language=typescript

const payload = this.$alexaSkill.$pay.createSetupPayload()
    .setSellerId('YOUR SELLER ID')
    .setCountryOfEstablishment('DE')
    .setLedgerCurrency('EUR')
    .setCheckoutLanguage('en_US')
    .setSellerBillingAgreementId('id')
    .setBillingAgreementType('CustomerInitiatedTransaction')
    .setSubscriptionAmount('19.99')
    .setSubscriptionCurrencyCode('EUR')
    .setStoreName('Test name')
    .setCustomInformation('custom info')
    .setNeedAmazonShippingAddress(true)
    .setSandboxMode(true)
    .setSandboxEmail('test@jovo.tech')
    .build();
```

Name | Param
:--- | :---
`setSellerId()` | String
`setCountryOfEstablishment()` | Enum - `DE`, `ES`, `US`, `UK`, etc.
`setLedgerCurrency()` | Enum - `USD`, `EUR`, `GBP`, or `JPY`
`setCheckoutLanguage()` | Enum - `de_DE`, `en_GB`, `en_US`, `es_ES`, `fr_FR`, `it_IT`, `ja_JP`
`setSellerBillingAgreementId()` | String
`setBillingAgreementType()` | Enum - `CustomerInitiatedTransaction` or `MerchantInitiatedTransaction`
`setSubscriptionAmount()` | String
`setSubscriptionCurrencyCode()` | Enum - `USD`, `EUR`, `GBP`, or `JPY`
`setStoreName()` | String
`setCustomInformation()` | String
`setNeedAmazonShippingAddress()` | Boolean
`setSandboxMode()` | Boolean
`setSandboxEmail()` | String

#### Charge Payload Builder

```js
// @language=javascript

const payload = this.$alexaSkill.$pay.createChargePayload()
    .setSellerId('YOUR SELLER ID')
    .setBillingAgreementId('billing id')
    .setPaymentAction('AuthorizeAndCapture')
    .setAuthorizationReferenceId('reference id')
    .setAuthorizationAmount('19.99')
    .setAuthorizationCurrencyCode('EUR')
    .setSoftDescriptor('description')
    .setTransactionTimeout('0')
    .setSellerAuthorizationNote('note')
    .setStoreName('name')
    .setCustomInformation('custom info')
    .setSellerNote('sellerNote')
    .setSellerOrderId('order id')
    .build();

// @language=typescript

const payload = this.$alexaSkill.$pay.createChargePayload()
    .setSellerId('YOUR SELLER ID')
    .setBillingAgreementId('billing id')
    .setPaymentAction('AuthorizeAndCapture')
    .setAuthorizationReferenceId('reference id')
    .setAuthorizationAmount('19.99')
    .setAuthorizationCurrencyCode('EUR')
    .setSoftDescriptor('description')
    .setTransactionTimeout('0')
    .setSellerAuthorizationNote('note')
    .setStoreName('name')
    .setCustomInformation('custom info')
    .setSellerNote('sellerNote')
    .setSellerOrderId('order id')
    .build();
```

Name | Param
:--- | :---
`setSellerId()` | String
`setBillingAgreementId()` | String
`setPaymentAction()` | Enum - `Authorize` or `AuthorizeAndCapture`
`setAuthorizationReferenceId()` | String
`setAuthorizationAmount()` | String
`setAuthorizationCurrencyCode()` | Enum - `USD`, `EUR`, `GBP`, or `JPY`
`setSoftDescriptor()` | String
`setTransactionTimeout()` | String
`setSellerAuthorizationNote()` | String
`setStoreName()` | String
`setCustomInformation()` | String
`setSellerNote()` | String
`setSellerOrderId()` | String