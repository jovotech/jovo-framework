# Google Transactions

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-googleassistant/transactions

Learn how to sell digital and physical goods in your Google Actions by using Google Transactions.

* [Introduction](#introduction)
* [Digital Goods](#digital-goods)
   * [Digital Goods Configuration](#digital-goods-configuration)
   * [Digital Goods Implementation](#digital-goods-implementation)
* [Physical Goods](#physical-goods)
   * [Physical Goods Configuration](#physical-goods-configuration)
   * [Physical Goods Implementation](#physical-goods-implementation)

## Introduction

> Official Google Docs: [Transactions](https://developers.google.com/actions/transactions/)

Transactions for Google Actions allow you to sell both digital and physical goods in your app. The Jovo implementation of Google Transactions can be accessed like this:

```js
// @language=javascript

this.$googleAction.$transaction

// @language=typescript

this.$googleAction!.$transaction
```

The two types (digital and physical goods) differ in functionality and configuration, this is why they are addressed as distinct features in this document.

Learn more below:

* [Digital Goods](#digital-goods)
* [Physical Goods](#physical-goods)

## Digital Goods

> Official Google Docs: [Build digital transactions](https://developers.google.com/assistant/transactions/digital/dev-guide-digital-non-consumables).

Digital transactions allow you to sell in-app product in the Google Play store.

* [Digital Goods Configuration](#digital-goods-configuration)
* [Digital Goods Implementation](#digital-goods-implementation)

### Digital Goods Configuration

Learn more about configurations in the [official Google Docs](https://developers.google.com/assistant/transactions/digital/dev-guide-digital-non-consumables).

Here are some of the steps that need to be taken:
* Create a Google Developer account
* Create an app project
* Download Android Studio
* Add `<uses-permission android:name="com.android.vending.BILLING" />` to the `AndroidManifest.xml` file
* Generate Signed APK from the `Build` menu
* Upload APK into Google Playstore

To use transactions for digital goods, you need to install the `googleapis` npm package:

```sh
$ npm install --save googleapis
```

Next, head to Google Cloud API Console to enable the Actions API:
1. Visit Google Cloud Console -> [APIs & Services](https://console.cloud.google.com/apis/api/)
2. Search "Actions API"
3. Select "Enable"

Then in `src/app.js` add the Android App package name you created earlier:

```
app.use(
    new GoogleAssistant({
        transactions: {
            androidPackageName: 'com.example.app',
            keyFile: require('./keyfile.json')
        }
    }),
    new JovoDebugger(),
);
```

You can generate the `./keyfile.json` file by following the instructions:
* [Jovo Forum](https://community.jovo.tech/t/keyfile-google-assistant-transactions/992)
* [Official Google Docs](https://developers.google.com/assistant/transactions/digital/dev-guide-digital-non-consumables#create_a_digital_goods_api_key)


### Digital Goods Implementation

To implement the transaction of digital goods in your Jovo project, there are few things you need to do (in line with the [transaction flow](https://developers.google.com/assistant/transactions/digital/dev-guide-digital-non-consumables#build_your_purchase_flow) described in the Google docs):

* [Gather Information](#gather-information)
* [Build the Order](#build-the-order)
* [Complete the Purchase](#complete-the-purchase)
* [Purchase Status](#purchase-status)


#### Gather Information

There are two types of digital goods that can be sold:

* [`SKU_TYPE_IN_APP`](https://developers.google.com/assistant/transactions/digital/dev-guide-digital-non-consumables): One-time in-app purchases
* [`SKU_TYPE_SUBSCRIPTION`](https://developers.google.com/assistant/transactions/digital/dev-guide-digital-subscriptions): Automatically charge users on a recurring schedule

Depending on which type you want to use, you can use the following methods to query the Play store with a list of product IDs (SKUs):

```js
// @language=javascript

// Consumables (in-app purchases)
this.$googleAction.$transaction.getConsumables(skus)

// Subscriptions
this.$googleAction.$transaction.getSubscriptions(skus)

// @language=typescript

// Consumables (in-app purchases)
this.$googleAction!.$transaction.getConsumables(skus: string[])

// Subscriptions
this.$googleAction!.$transaction.getSubscriptions(skus: string[])
```

Check the user has met all requirements for Digital Purchase:

```js
this.$googleAction.$transaction.checkDigitalPurchaseRequirements();
```

The next request will then go into the `DIGITAL_PURCHASE_CHECK()` inside the `ON_TRANSACTION` object in your handler:

```js
// @language=javascript

// src/app.js

app.setHandler({

   // ...

   ON_TRANSACTION: {
      DIGITAL_PURCHASE_CHECK(){
          // Check Requirements Check status
          this.tell("Digital Purchase Check");
      },

      ON_COMPLETE_PURCHASE() {
         // Check purchase status
      }
   }
});
```

#### Build the Order

This part of the flow prompts the user to select an item. [Learn in the official docs by Google](https://developers.google.com/assistant/transactions/digital/dev-guide-digital-non-consumables#3) how to create a rich response that describes the available items to the user.


#### Complete Purchase

You can use the following method to complete the purchase:

```js
// @language=javascript

this.$googleAction.$transaction.completePurchase(skuId)

// @language=typescript

this.$googleAction!.$transaction.completePurchase(skuId: string)
```

The next request will then go into the `ON_COMPLETE_PURCHASE()` inside the `ON_TRANSACTION` object in your handler:

```js
// @language=javascript

// src/app.js

app.setHandler({

   // ...

   ON_TRANSACTION: {
      DIGITAL_PURCHASE_CHECK(){
          // Check Requirements Check status
          this.tell("Digital Purchase Check");
      },

      ON_COMPLETE_PURCHASE() {
         // Check purchase status
      }
   }
});

// @language=typescript

// src/app.ts

app.setHandler({

   // ...

   ON_TRANSACTION: {
      COMPLETE_PURCHASE() {
         // Check purchase status
      }
   }
});
```


#### Purchase Status

Inside the `COMPLETE_PURCHASE()` handler, you can check the purchase status:

```js
// @language=javascript

this.$googleAction.$transaction.getPurchaseStatus()

// @language=typescript

this.$googleAction!.$transaction.getPurchaseStatus()
```

The following can be returned:

* PURCHASE_STATUS_OK
* PURCHASE_STATUS_ITEM_CHANGE_REQUESTED
* PURCHASE_STATUS_USER_CANCELLED
* PURCHASE_STATUS_ERROR
* PURCHASE_STATUS_UNSPECIFIED






## Physical Goods

Physical transactions allow you to sell physical items (e.g. books, clothes) in your Google Action. You can either choose to do the transaction with Google Pay, or do merchant-managed payments (e.g. by using Stripe).

More below:

* [Physical Goods Configuration](#physical-goods-configuration)
* [Physical Goods Implementation](#physical-goods-implementation)


### Physical Goods Configuration

* [Build Physical Transactions with Google Pay](#build-physical-transactions-with-google-pay)
* [Build Physical Transactions with Merchant-Managed Payments](#build-physical-transactions-with-merchant-managed-payments)
* [Physical Goods Implementation](#physical-goods-implementation)

#### Build Physical Transactions with Google Pay

Learn more about configurations for Google Pay in the [official Google Docs](https://developers.google.com/actions/transactions/physical/dev-guide-physical-gpay).

#### Build Physical Transactions with Merchant-Managed Payments

Learn more about configurations for merchant-managed payments in the [official Google Docs](https://developers.google.com/actions/transactions/physical/dev-guide-physical-custom).

### Physical Goods Implementation

> [You can find an example project on GitHub](https://github.com/jovotech/jovo-framework/tree/master/examples/javascript/02_googleassistant/transactions/src).

There are several steps that need to be taken to create an order with your physical goods transaction:

* [Check Requirements](#check-requirements)
* [ON_TRANSACTION](#on_transaction)
   * [TRANSACTION_REQUIREMENTS_CHECK](#transaction_requirements_check)
   * [DELIVERY_ADDRESS](#delivery_address)
   * [TRANSACTION_DECISION](#transaction_decision)
* [Order Update](#order-update)

#### Check Requirements

```js
// @language=javascript

this.$googleAction.$transaction.checkRequirements(orderOptions, paymentOptions)

// @language=typescript

this.$googleAction!.$transaction.checkRequirements(orderOptions: OrderOptions, paymentOptions: PaymentOptions)
```

The `paymentOptions` either need to include `googleProvidedOptions` or `actionProvidedOptions`.


#### ON_TRANSACTION

To handle transaction events, add the `ON_TRANSACTION` element to your handler:

```js
// @language=javascript

// src/app.js

app.setHandler({

    // ...

    ON_TRANSACTION: {

    }
});

// @language=typescript

// src/app.js

app.setHandler({

    // ...

    ON_TRANSACTION: {

    }
});
```

`ON_TRANSACTION` needs to include the following three elements:

* `TRANSACTION_REQUIREMENTS_CHECK()`
* `DELIVERY_ADDRESS()`
* `TRANSACTION_DECISION()`

After `checkRequirements`, the next request will go into the `TRANSACTION_REQUIREMENTS_CHECK()` handler.

##### TRANSACTION_REQUIREMENTS_CHECK

There are two helper methods that you can use to query for the requirements in the `TRANSACTION_REQUIREMENTS_CHECK()` handler:

* `this.$googleAction.$transaction.isRequirementsCheckOk()`
* `this.$googleAction.$transaction.isRequirementsCheckUserActionRequired()`

When `isRequirementsCheckOk` is `true`, you can ask for the delivery address:

```js
// @language=javascript

this.$googleAction.$transaction.askForDeliveryAddress(prompt)

// @language=typescript

this.$googleAction!.$transaction.askForDeliveryAddress(prompt: string)
```

The next request will go into the `DELIVERY_ADDRESS()` handler.


##### DELIVERY_ADDRESS

After the user accepted the delivery address (`this.$googleAction.$transaction.isDeliveryAddressAccepted()`), you can as them to make a transaction decision:


```js
// @language=javascript

this.$googleAction.$transaction.transactionDecision(orderOptions, paymentOptions, proposedOrder)

// @language=typescript

this.$googleAction!.$transaction.transactionDecision(orderOptions: OrderOptions, paymentOptions: PaymentOptions, proposedOrder: any)
```

The next request will go into the `TRANSACTION_DECISION()` handler.

##### TRANSACTION_DECISION

If the order is accepted by the user (`this.$googleAction.$transaction.isOrderAccepted()`), you can create the order:

```js
// @language=javascript

this.$googleAction.$transaction.createOrder(speech, orderUpdate)

// @language=typescript

this.$googleAction!.$transaction.createOrder(speech: string, orderUpdate: OrderUpdate)
```

#### Order Update

> [Find an example file on GitHub: order-update.js](https://github.com/jovotech/jovo-framework/blob/master/examples/javascript/02_googleassistant/transactions/src/order-update.js).

You can also update orders, which is not related to the Jovo Framework, but mostly happens somewhere else outside your Google Action.

The [example file](https://github.com/jovotech/jovo-framework/blob/master/examples/javascript/02_googleassistant/transactions/src/order-update.js) shows how this could look like, and uses the `googleapis`, which you need to install like this:

```sh
$ npm install --save googleapis
```