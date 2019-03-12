# Google Transactions

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
this.$googleAction.$transaction
```

The two types (digital and physical goods) differ in functionality and configuration, this is why they are addressed as distinct features in this document.

Learn more below:

* [Digital Goods](#digital-goods)
* [Physical Goods](#physical-goods)

## Digital Goods

> Official Google Docs: [Build digital transactions](https://developers.google.com/actions/transactions/digital/dev-guide-digital)

Digital transactions allow you to sell in-app product in the Google Play store.

* [Digital Goods Configuration](#digital-goods-configuration)
* [Digital Goods Implementation](#digital-goods-implementation)

### Digital Goods Configuration

Learn more about configurations in the [official Google Docs](https://developers.google.com/actions/transactions/digital/dev-guide-digital).

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


### Digital Goods Implementation

To implement the transaction of digital goods in your Jovo project, there are few things you need to do (in line with the [transaction flow](https://developers.google.com/actions/transactions/digital/dev-guide-digital#types_of_digital_goods#transaction_flow) described in the Google docs):

* [Gather Information](#gather-information)
* [Build the Order](#build-the-order)
* [Complete the Purchase](#complete-the-purchase)
* [Purchase Status](#purchase-status)


#### Gather Information

There are two types of digital goods that can be sold ([take a look at the official Google docs for more information](https://developers.google.com/actions/transactions/digital/dev-guide-digital#types_of_digital_goods)):

* `SKU_TYPE_IN_APP`: One-time in-app purchases
* `SKU_TYPE_SUBSCRIPTION`: Auomatically charge users on a recurring schedule

Depending on which type you want to use, you can use the following methods to query the Play store with a list of product IDs (SKUs):

```js
// Consumables (in-app purchases)
this.$googleAction.$transaction.getConsumables(skus)

// Subscriptions
this.$googleAction.$transaction.getSubscriptions(skus)
```

#### Build the Order

This part of the flow prompts the user to select an item. [Learn in the official docs by Google](https://developers.google.com/actions/transactions/digital/dev-guide-digital#types_of_digital_goods#build_fulfillment) how to create a rich response that describes the available items to the user.


#### Complete Purchase

You can use the following method to complete the purchase:

```js
this.$googleAction.$transaction.completePurchase(skuId)
```

The next request will then go into the `COMPLETE_PURCHASE()` inside the `ON_TRANSACTION` object in your handler:

```js
app.setHandler({

   // Other intents

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
this.$googleAction.$transaction.getPurchaseStatus()
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

> [You can find an example project on GitHub](https://github.com/jovotech/jovo-framework/tree/master/examples/02_googleassistant/transactions/src).

There are several steps that need to be taken to create an order with your physical goods transaction:

* [Check Requirements](#check-requirements)
* [ON_TRANSACTION](#on_transaction)
   * [TRANSACTION_REQUIREMENTS_CHECK](#transaction_requirements_check)
   * [DELIVERY_ADDRESS](#delivery_address)
   * [TRANSACTION_DECISION](#transaction_decision)
* [Order Update](#order-update)

#### Check Requirements

```js
this.$googleAction.$transaction.checkRequirements(orderOptions, paymentOptions)
```

The `paymentOptions` either need to include `googleProvidedOptions` or `actionProvidedOptions`.

#### ON_TRANSACTION

To handle transaction events, add the `ON_TRANSACTION` element to your handler:

```js
// src/app.js

app.setHandler({

    // Other intents

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
this.$googleAction.$transaction.askForDeliveryAddress(prompt)
```

The next request will go into the `DELIVERY_ADDRESS()` handler.

##### DELIVERY_ADDRESS

After the user acceppted the delivery address (`this.$googleAction.$transaction.isDeliveryAddressAccepted()`), you can as them to make a transaction decision:


```js
this.$googleAction.$transaction.transactionDecision(orderOptions, paymentOptions, order)
```

The next request will go into the `TRANSACTION_DECISION()` handler.

##### TRANSACTION_DECISION

If the order is accepted by the user (`this.$googleAction.$transaction.isOrderAccepted()`), you can create the order:

```js
this.$googleAction.$transaction.createOrder(speech, orderUpdate)
```

#### Order Update

> [Find an example file on GitHub: order-update.js](https://github.com/jovotech/jovo-framework/blob/master/examples/02_googleassistant/transactions/src/order-update.js).

You can also update orders, which is not related to the Jovo Framework, but mostly happens somewhere else outside your Google Action.

The [example file](https://github.com/jovotech/jovo-framework/blob/master/examples/02_googleassistant/transactions/src/order-update.js) shows how this could look like, and uses the `googleapis`, which you need to install like this:

```sh
$ npm install --save googleapis
```

<!--[metadata]: {"description": "Learn how to sell digital and physical goods in your Google Actions by using Google Transactions and the Jovo Framework.",
"route": "google-assistant/transactions" }-->
