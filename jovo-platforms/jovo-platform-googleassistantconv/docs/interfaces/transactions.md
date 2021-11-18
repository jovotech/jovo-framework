# Google Transactions

> To view this page on the Jovo website, visit https://v3.jovo.tech/marketplace/jovo-platform-googleassistantconv/interfaces/transactions

Learn how to sell digital and physical goods in your Google Actions by using Google Transactions.

* [Introduction](#introduction)
* [Digital Goods](#digital-goods)
   * [Digital Goods Configuration](#digital-goods-configuration)
   * [Digital Goods Implementation](#digital-goods-implementation)
* [Physical Goods](#physical-goods)
   * [Physical Goods Configuration](#physical-goods-configuration)
   * [Physical Goods Implementation](#physical-goods-implementation)

## Introduction

> Official Google Docs: [Transactions](https://developers.google.com/assistant/transactions)

Transactions for Google Conversational Actions allow you to sell both digital and physical goods in your app. The Jovo implementation of Google Transactions can be accessed like this:

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

Digital transactions allow you to sell in-app products in the Google Play store.

### Digital Goods Configuration

Learn more about the prerequisites in the [official Google Docs](https://developers.google.com/assistant/transactions/digital/dev-guide-digital-non-consumables#prerequisites).

Here are some of the steps that need to be taken:
* [Create a Google Developer account](https://support.google.com/googleplay/android-developer/answer/6112435) and a [merchant account](https://support.google.com/googleplay/android-developer/answer/7161426) to manage your products
* [Create a verified web domain](https://support.google.com/webmasters/answer/9008080) for reference
* [Create an Android app](https://developers.google.com/assistant/transactions/digital/dev-guide-digital-non-consumables#associate_an_android_app) to associate your products with
* [Create Digital Goods](https://developers.google.com/assistant/transactions/digital/dev-guide-digital-non-consumables#create_your_digital_goods) to sell
* [Prepare your Conversational Action](#prepare-your-conversational-action)
* [Configuring your Jovo app](#configuring-your-jovo-app)

#### Prepare your Conversational Action

To use transactions in your action, you'll need to enable the Transactions API. Go to your [Actions Console](https://console.actions.google.com/) and open your project. Head to `Deploy` and go to `Directory information`. Under `Additional information`, enable transactions for physical goods.

Next, you need to create a [Service Account](https://cloud.google.com/iam/docs/service-accounts) to send requests to the Transactions API with. Copy your Action's Project ID and paste it into the following link: https://console.developers.google.com/apis/credentials?project=<your-project_id>. If you then follow that link, you can create your Service Account with respective credentials.

After you gave your service account an appropriate name, choose the Role `Project > Owner`, to give your account all necessary permissions. When you're done, go to the Service Account details and add a new key certificate in JSON format, which you can then download and store in your project's directory.

The last step of configuring your Conversational Action includes associating your verified web domain and your Android app with your project. For that, return to your [Actions Console](https://console.actions.google.com/), head to `Deploy` and go to `Brand verification`. 
Here, you first need to connect your web domain. Google will send you further instructions to the domain's associated email address. Once completed, it should appear as connected.
Now, you should be able to connect your app. Follow the instructions shown. Again, Google will send a verification email to your associated email address. Once you're done, your app should show up in the list of connected apps. Enable `Access Play purchases`, and you can begin configuring your Jovo app.

#### Configuring your Jovo app

To use transactions for digital goods with the Jovo Framework, you need to install the `googleapis` npm package. If you use one of our [Transaction Examples](), you can skip this step.

```sh
$ npm install --save googleapis
```

Next, in your `src/app.js`, add the Android App package name you created earlier and the service account credentials to your Google Assistant configuration:

```javascript
// @language=javascript

// Import GoogleAssistant. 
const { GoogleAssistant } = require('jovo-platform-googleassistantconv');

// In your app, register GoogleAssistant with your app package name and account credentials.
app.use(
   new GoogleAssistant({
      transactions: {
         androidPackageName: 'com.example.demo',
         keyFile: require('./keyfile.json')
      }
   }),
);

// @language=typescript

// Import GoogleAssistant. 
import { GoogleAssistant } from 'jovo-platform-googleassistantconv';

// In your app, register GoogleAssistant with your app package name and account credentials.
app.use(
   new GoogleAssistant({
      transactions: {
         androidPackageName: 'com.example.demo',
         keyFile: require('./service-account.json')
      }
   }),
);
```

### Digital Goods Implementation

To implement the transaction of digital goods in your Jovo project, there are a few things you need to do (in line with the [transaction flow](https://developers.google.com/assistant/transactions/digital/dev-guide-digital-subscriptions#build_your_purchase_flow) described in the Google docs):

* [Gather Information](#gather-information)
* [Build the Order](#build-the-order)
* [Complete the Purchase](#complete-the-purchase)
* [Purchase Status](#purchase-status)

#### Gather Information

Before the user can make a purchase, it is recommended to check if the user is eligible to make purchases and what products are available.

##### Check for eligibility

To validate a user's ability to purchase products from your Conversational Action, you can use a `DigitalPurchaseCheck` [scene](), which checks, whether the user is verified, their device is eligible for transactions and that they are located in a supported region.

```javascript
"TransactionDigitalPurchaseCheck": {
	"conditionalEvents": [
		{
	   	"condition": "scene.slots.status == \"FINAL\"",
			"handler": {
				"webhookHandler": "Jovo"
			}
		}
	],
	"slots": [
		{
			"commitBehavior": {
				"writeSessionParam": "DigitalPurchaseCheck"
			},
			"config": {
				"@type": "type.googleapis.com/google.actions.transactions.v3.DigitalPurchaseCheckSpec"
			},
			"name": "DigitalPurchaseCheck",
			"required": true,
			"type": {
				"name": "actions.type.DigitalPurchaseCheckResult"
			}
		}
   ]
}
```

In your handler, it's sufficient to just transition to the scene:

```javascript
// @language=javascript

TransactionDigitalPurchaseRequirementsIntent() {
	// Check if digital purchases are available for the user.
	this.$googleAction.$transaction.checkDigitalPurchaseRequirements();
	this.$googleAction.setNextScene('TransactionDigitalPurchaseCheck');
}

// @language=typescript

TransactionDigitalPurchaseRequirementsIntent() {
	// Check if digital purchases are available for the user.
	this.$googleAction!.$transaction!.checkDigitalPurchaseRequirements();
	this.$googleAction!.setNextScene('TransactionDigitalPurchaseCheck');
}
```

Once your user completes the conversational flow of this scene, control will be given to your handler again, where you can check for the result:

```javascript
// @language=javascript

ON_TRANSACTION: {
	async DIGITAL_PURCHASE_CHECK() {
		if (this.$googleAction.$transaction.canPurchase()) {
      // Check for available products.
    } else {
      this.tell('You are not eligible to purchase products.');
    }
  }
}

// @language=typescript

ON_TRANSACTION: {
	async DIGITAL_PURCHASE_CHECK() {
		if (this.$googleAction!.$transaction!.canPurchase()) {
      // Check for available products.
    } else {
      this.tell('You are not eligible to purchase products.');
    }
  }
}
```

##### Check for available products

Once you can verify that the user can purchase your goods, you need to create an inventory array of your products to present to the user:

```javascript
// @language=javascript

ON_TRANSACTION: {
	async DIGITAL_PURCHASE_CHECK() {
		if (this.$googleAction.$transaction.canPurchase()) {
			const skus = await this.$googleAction.$transaction.getSkus(
				['testproduct1337'],
				'SKU_TYPE_IN_APP'
			);

         if (skus.length > 0) {
				this.$session.$data.skuId = skus[0].skuId;
				this.ask(`Do you want to buy ${skus[0].title}?`);
			}
      } else {
			this.tell(`You can't use digital purchasing.`);
		}
	},
}

// @language=typescript

ON_TRANSACTION: {
	async DIGITAL_PURCHASE_CHECK() {
		if (this.$googleAction!.$transaction!.canPurchase()) {
			const skus: Sku[] = await this.$googleAction!.$transaction!.getSkus(
				['testproduct1337'],
				'SKU_TYPE_IN_APP'
			);

         if (skus.length > 0) {
				this.$session.$data.skuId = skus[0].skuId;
				this.ask(`Do you want to buy ${skus[0].title}?`);
			}
      } else {
			this.tell(`You can't use digital purchasing.`);
		}
	},
}
```

Here, `this.$googleAction.$transaction.getSkus()` will be used to get an array of SKUs for the specified product IDs and the specified SKU type.
There are two types of digital goods that can be sold:

* `SKU_TYPE_IN_APP`: One-time in-app purchases
* `SKU_TYPE_SUBSCRIPTION`: Automatically charge users on a recurring schedule

#### Build the Order

This part of the flow prompts the user to select an item. You can either choose to follow the example, or use rich responses to display your products in a [list](), for example.

[Learn more in the official docs by Google](https://developers.google.com/assistant/transactions/digital/dev-guide-digital-non-consumables#3) how to create a rich response that describes the available items to the user.

#### Complete Purchase

Once you built your order and your user has selected an item, you can complete the purchase:

```javascript
// @language=javascript

PurchaseItem() {
	this.$googleAction.$transaction.completePurchase(this.$session.$data.skuId);
	this.$googleAction.setNextScene('TransactionCompletePurchase');
}

// @language=typescript

PurchaseItem() {
	this.$googleAction!.$transaction!.completePurchase(this.$session.$data.skuId);
	this.$googleAction!.setNextScene('TransactionCompletePurchase');
}
```

After calling `this.$googleAction.$transaction.completePurchase()` with the selected product, we use [scenes]() again to delegate the conversation flow to the Conversational Action.

```javascript
"TransactionCompletePurchase": {
   "conditionalEvents": [
		{
			"condition": "scene.slots.status == \"FINAL\"",
			"handler": {
				"webhookHandler": "Jovo"
			}
		}
	],
	"slots": [
		{
			"commitBehavior": {
				"writeSessionParam": "CompletePurchase"
			},
			"config": "$session.params.purchase",
			"name": "CompletePurchase",
			"required": true,
			"type": {
	   		"name": "actions.type.CompletePurchaseValue"
			}
	   }
	]
}
```

Once the user completed the purchase, control will be given to your handler again, where you can check for the purchase result:

```javascript
// @language=javascript

ON_TRANSACTION: {
	ON_COMPLETE_PURCHASE() {
		if (this.$googleAction!.$transaction!.getPurchaseCompleteStatus() === 'PURCHASE_STATUS_OK') {
			this.tell('Thank you for the purchase.');
		}
	},
}
```

The following purchase status can be returned:

* PURCHASE_STATUS_OK
* PURCHASE_STATUS_ITEM_CHANGE_REQUESTED
* PURCHASE_STATUS_USER_CANCELLED
* PURCHASE_STATUS_ERROR
* PURCHASE_STATUS_UNSPECIFIED

## Physical Goods

> Official Google Docs: [Build physical transactions](https://developers.google.com/assistant/transactions/physical/dev-guide-physical-custom).

Physical transactions allow you to sell physical items (e.g. books, clothes) in your Google Action. You can choose whether you want to use Google Pay or your own custom payment method for purchases. The transaction flow is mostly the same, apart from a few configurations such as the payment parameters.

> Learn more about configurations for Google Pay in the [official Google Docs](https://developers.google.com/actions/transactions/physical/dev-guide-physical-gpay).

> Learn more about configurations for merchant-managed payments in the [official Google Docs](https://developers.google.com/actions/transactions/physical/dev-guide-physical-custom).

### Physical Goods Configuration

#### Prepare your Conversational Action

TODO sufficient to link to digital goods here?

To use transactions in your action, you'll need to enable the Digital Purchase API. Go to your [Actions Console](https://console.actions.google.com/) and open your project. Head to `Deploy` and go to `Directory information`. Under `Additional information`, enable transactions for digital goods.

Next, you need to create a [Service Account](https://cloud.google.com/iam/docs/service-accounts) to send requests to the Digital Goods API with. Copy your Action's Project ID and paste it into the following link: https://console.developers.google.com/apis/credentials?project=<your-project_id>. If you then follow that link, you can create your Service Account with respective credentials.

After you gave your service account an appropriate name, choose the Role `Project > Owner`, to give your account all necessary permissions. When you're done, go to the Service Account details and add a new key certificate in JSON format, which you can then download and store in your project's directory.

![Create credentials for your service account](../../img/service-account-credentials.jpg)

#### Configuring your Jovo app

To use transactions for physical goods with the Jovo Framework, you need to install the `googleapis` npm package. If you use one of our [Transaction Examples](), you can skip this step.

```sh
$ npm install --save googleapis
```

### Physical Goods Implementation

To implement the transaction of physical goods in your Jovo project, there are a few things you need to do (in line with the [transaction flow](https://developers.google.com/assistant/transactions/physical/dev-guide-physical-custom#transaction_flow) described in the Google docs):

* [Link the user's account (Optional)](#link-users-account-optional)
* [Gather Information](#gather-information)
* [Build the Order](#build-the-order)

#### Link the user's account (Optional)

If you use your own payment method for purchases, it is recommended to link their Google account with their account on your service. If you want to use Google Pay, you can skip this step.

> Learn more about Account Linking with Conversational Actions [here]().

#### Gather Information

Before the user can perform a transaction, it is recommended to check if the user meets all transaction requirements. You can also try to request a delivery address, if you want.

##### Check for eligibility

To validate a user's ability to perform transactions from your Conversational Action, you can use a `TransactionRequirementsCheck` [scene](), which checks, whether the user is verified, their device is eligible for transactions and that they are located in a supported region.

```javascript
"TransactionRequirementsCheck": {
	"conditionalEvents": [
		{
			"condition": "scene.slots.status == \"FINAL\"",
			"handler": {
				"webhookHandler": "Jovo"
			}
		}
	],
	"slots": [
		{
			"commitBehavior": {
				"writeSessionParam": "TransactionRequirementsCheck"
			},
			"config": {
				"@type": "type.googleapis.com/google.actions.transactions.v3.TransactionRequirementsCheckSpec"
			},
			"name": "TransactionRequirementsCheck",
			"required": true,
			"type": {
				"name": "actions.type.TransactionRequirementsCheckResult"
			}
		}
	]
}
```

In your handler, it's sufficient to just transition to the scene:

```javascript
// @language=javascript

TransactionRequirementsIntent() {
	this.$googleAction.$transaction.checkPhysicalTransactionRequirements();
	this.$googleAction.setNextScene('TransactionRequirementsCheck');
}

// @language=typescript

TransactionRequirementsIntent() {
	this.$googleAction!.$transaction!.checkPhysicalTransactionRequirements();
	this.$googleAction!.setNextScene('TransactionRequirementsCheck');
}
```

Once your user completes the conversational flow of this scene, control will be given to your handler again, where you can check for the result:

```javascript
// @language=javascript

ON_TRANSACTION: {
	async TRANSACTION_REQUIREMENTS_CHECK() {
		if (this.$googleAction.$transaction.canTransact()) {
      // Continue with conversation flow.
    } else {
			this.tell(`You can't perform physical transactions.`);
    }
  }
}

// @language=typescript

ON_TRANSACTION: {
	async TRANSACTION_REQUIREMENTS_CHECK() {
		if (this.$googleAction!.$transaction!.canTransact()) {
      // Continue with conversation flow.
    } else {
			this.tell(`You can't perform physical transactions.`);
    }
  }
}
```

##### Request a delivery address

If your transaction depends on the user's delivery address, you can use the `TransactionDeliveryAddress` [scene]() to request it:

```javascript
"TransactionDeliveryAddress": {
	"conditionalEvents": [
		{
			"condition": "scene.slots.status == \"FINAL\"",
			"handler": {
				"webhookHandler": "Jovo"
			}
		}
	],
	"slots": [
		{
			"commitBehavior": {
				"writeSessionParam": "TransactionDeliveryAddressResult"
			},
			"config": "$session.params.TransactionDeliveryAddress",
			"name": "TransactionDeliveryAddress",
			"required": true,
			"type": {
				"name": "actions.type.DeliveryAddressValue"
			}
		}
	]
}
```

Before delegating the conversation to `TransactionDeliveryAddress`, you can also choose to provide a reason, which will be prompted to the user. If you do not provide a parameter to `askForDeliveryAddress()`, the default reason "to know where to send the order" will be used. 

```javascript
// @language=javascript

ON_TRANSACTION: {
	async TRANSACTION_REQUIREMENTS_CHECK() {
		if (this.$googleAction.$transaction.canTransact()) {
      this.$googleAction.$transaction.askForDeliveryAddress('To know where to send the order');
			this.$googleAction.setNextScene('TransactionDeliveryAddress');
    } else {
			this.tell(`You can't perform physical transactions.`);
    }
  }
}

// @language=typescript

ON_TRANSACTION: {
	async TRANSACTION_REQUIREMENTS_CHECK() {
		if (this.$googleAction!.$transaction!.canTransact()) {
      this.$googleAction!.$transaction!.askForDeliveryAddress('To know where to send the order');
			this.$googleAction!.setNextScene('TransactionDeliveryAddress');
    } else {
			this.tell(`You can't perform physical transactions.`);
    }
  }
}
```

Once your user completes the conversational flow of this scene, control will be given to your handler again, where you can check for the result:

```javascript
// @language=javascript

ON_TRANSACTION: {
	DELIVERY_ADDRESS() {
		if (this.$googleAction.$transaction.isDeliveryAddressAccepted()) {
			// Build your order.
		}
	}
}

// @language=typescript

ON_TRANSACTION: {
	DELIVERY_ADDRESS() {
		if (this.$googleAction!.$transaction!.isDeliveryAddressAccepted()) {
			// Build your order.
		}
	}
}
```

#### Build the order 

Now that you gathered all the information that you need, you can start building your order. In the [Jovo example](), you can find a preconfigured order object inside `src/order.ts`. You can import this order object into your `app.ts` and adjust it based on your gathered information:

```javascript
// @language=javascript

ON_TRANSACTION: {
	DELIVERY_ADDRESS() {
		if (this.$googleAction.$transaction.isDeliveryAddressAccepted()) {
			const location = this.$googleAction.$transaction.getDeliveryAddress();

			order.purchase.fulfillmentInfo.location = location;
			order.merchantOrderId = uniqueId();
			order.userVisibleOrderId = order.merchantOrderId;

			// Build your order card with presentation and order options.
			const presentationOptions = {
				actionDisplayName: 'PLACE_ORDER',
			};

			const orderOptions = {
				requestDeliveryAddress: true,
				userInfoOptions: {
					userInfoProperties: ['EMAIL'],
				},
			};

			const paymentParameters = {
				merchantPaymentOption: {
					defaultMerchantPaymentMethodId: '12345678',
					managePaymentMethodUrl: 'https://example.com/managePayment',
					merchantPaymentMethod: [
						{
							paymentMethodDisplayInfo: {
								paymentMethodDisplayName: 'VISA **** 1234',
								paymentType: 'PAYMENT_CARD',
							},
							paymentMethodGroup: 'Payment method group',
							paymentMethodId: '12345678',
							paymentMethodStatus: {
								status: 'STATUS_OK',
								statusMessage: 'Status message',
							},
						},
					],
				},
			};

			this.$googleAction.$transaction.buildOrder(
				order,
				presentationOptions,
				orderOptions,
				paymentParamenters
			);
		}
	}
}

// @language=typescript

ON_TRANSACTION: {
	DELIVERY_ADDRESS() {
		if (this.$googleAction!.$transaction!.isDeliveryAddressAccepted()) {
			const location: Location | undefined = this.$googleAction!.$transaction!.getDeliveryAddress();

			order.purchase.fulfillmentInfo.location = location;
			order.merchantOrderId = uniqueId();
			order.userVisibleOrderId = order.merchantOrderId;

			// Build your order card with presentation and order options.
			const presentationOptions: PresentationOptions = {
				actionDisplayName: 'PLACE_ORDER',
			};

			const orderOptions: OrderOptions = {
				requestDeliveryAddress: true,
				userInfoOptions: {
					userInfoProperties: ['EMAIL'],
				},
			};

			const paymentParameters: PaymentParameters = {
				merchantPaymentOption: {
					defaultMerchantPaymentMethodId: '12345678',
					managePaymentMethodUrl: 'https://example.com/managePayment',
					merchantPaymentMethod: [
						{
							paymentMethodDisplayInfo: {
								paymentMethodDisplayName: 'VISA **** 1234',
								paymentType: 'PAYMENT_CARD',
							},
							paymentMethodGroup: 'Payment method group',
							paymentMethodId: '12345678',
							paymentMethodStatus: {
								status: 'STATUS_OK',
								statusMessage: 'Status message',
							},
						},
					],
				},
			};

			this.$googleAction!.$transaction!.buildOrder(
				order,
				presentationOptions,
				orderOptions,
				paymentParamenters
			);
		}
	}
}
```

> Learn more about the order object [here](https://developers.google.com/assistant/transactions/reference/physical/rest/v3/Order).

Depending on whether you choose to use Google Pay or your own pament method, you need to adjust the payment parameters.

> Learn more about payment parameters for Google Pay in the [official Google Docs](https://developers.google.com/assistant/transactions/physical/dev-guide-physical-gpay#create_payment_parameters).

> Learn more about payment parameters for merchant-managed payments in the [official Google Docs](https://developers.google.com/assistant/transactions/physical/dev-guide-physical-custom#create_payment_parameters).

#### Propose the order

Now that you've built your order, it's time to present it to your user using the `TransactionDecision` [scene]().

```javascript
"TransactionDecision": {
	"conditionalEvents": [
		{
			"condition": "scene.slots.status == \"FINAL\"",
			"handler": {
				"webhookHandler": "Jovo"
			}
		}
	],
	"slots": [
		{
			"commitBehavior": {
				"writeSessionParam": "TransactionDecision"
			},
			"config": "$session.params.order",
			"name": "TransactionDecision",
			"required": true,
			"type": {
				"name": "actions.type.TransactionDecisionValue"
			}
		}
	]
}
```

In your handler, it's sufficient to just transition to the scene:

```javascript
// @language=javascript

this.$googleAction.setNextScene('TransactionDecision');

// @language=typescript

this.$googleAction!.setNextScene('TransactionDecision');
```

#### Handle the transaction result

Your Action presents the order to the user in the format of a "cart preview card". Once the user responded to the order, you can use one of the following functions to check for the result:

```javascript
// @language=javascript

// Check if order has been accepted.
this.$googleAction.$transaction.isOrderAccepted();

// Check if order has been rejected.
this.$googleAction.$transaction.isOrderRejected();

// Check if the delivery address has been updated.
this.$googleAction.$transaction.isDeliveryAddressUpdated();

// Check if the user has requested a cart change.
this.$googleAction.$transaction.isCartChangeRequested();

// @language=typescript

// Check if order has been accepted.
this.$googleAction!.$transaction!.isOrderAccepted();

// Check if order has been rejected.
this.$googleAction!.$transaction!.isOrderRejected();

// Check if the delivery address has been updated.
this.$googleAction!.$transaction!.isDeliveryAddressUpdated();

// Check if the user has requested a cart change.
this.$googleAction!.$transaction!.isCartChangeRequested();
```

If the transaction has succeeded, you must initiate the required steps to confirm the order, such as charging the user and providing an order update:

```javascript
// @language=javascript

ON_TRANSACTION: {
	TRANSACTION_DECISION() {
		if (this.$googleAction.$transaction.isOrderAccepted()) {
			const order = this.$googleAction.$transaction.getOrder();

			this.$googleAction.$transaction.updateOrder({
				updateMask: {
					paths: ['purchase.status', 'purchase.user_visible_status_label'],
				},
				order: {
					merchantOrderId: order.merchantOrderId,
					lastUpdateTime: new Date().toISOString(),
					purchase: {
						status: 'CONFIRMED',
						userVisibleStatusLabel: 'Order confirmed',
					},
					},
				reason: 'Reason string',
			});

			this.ask('Completed');
		}
	}
}

// @language=typescript

ON_TRANSACTION: {
	TRANSACTION_DECISION() {
		if (this.$googleAction!.$transaction!.isOrderAccepted()) {
			const order: Order = this.$googleAction!.$transaction!.getOrder();

			this.$googleAction!.$transaction!.updateOrder({
				updateMask: {
					paths: ['purchase.status', 'purchase.user_visible_status_label'],
				},
				order: {
					merchantOrderId: order.merchantOrderId,
					lastUpdateTime: new Date().toISOString(),
					purchase: {
						status: 'CONFIRMED',
						userVisibleStatusLabel: 'Order confirmed',
					},
					},
				reason: 'Reason string',
			});

			this.ask('Completed');
		}
	}
}
```

[Example Javascript](https://github.com/jovotech/jovo-framework/blob/master/examples/javascript/02_googleassistantconv/transactions/) | [Example Typescript](https://github.com/jovotech/jovo-framework/blob/master/examples/typescript/02_googleassistantconv/transactions/)
