---
title: 'Alexa In-Skill Purchases (ISP)'
excerpt: 'Learn how to implement Alexa In-Skill Purchasing (ISP) with Jovo.'
---

# Alexa In-Skill Purchases (ISP)

Learn how to implement Alexa in-skill purchasing (ISP) with Jovo.

## Introduction

Alexa Skill developers can make money through in-skill purchasing. It allows you to sell items either through one-time purchases, consumables, or subscriptions. Learn more in the [official Alexa docs](https://developer.amazon.com/docs/alexa/in-skill-purchase/isp-overview.html).

While the official Alexa documentation is a great starting point showing you how to create ISP products in the Alexa Developer Console, this documentation shows you how to add support for ISP to your Skill code built with Jovo. The [official Alexa documentation on adding ISP to a Skill](https://developer.amazon.com/docs/alexa/in-skill-purchase/add-isps-to-a-skill.html) can also be helpful here.

The [delegate to ISP flow](#delegate-to-isp-flow) section introduces ways to hand off to Alexa for the purchasing flow. For example, to delegate to a `Buy` ISP flow from a [handler](https://www.jovo.tech/docs/handlers), you can do something like this:

```typescript
import { Handle } from '@jovotech/framework';
import { IspBuyOutput } from '@jovotech/platform-alexa';
// ...

@Handle({
  intents: ['BuySkillItemIntent'],
  platforms: ['alexa']
})
async askForBuyConfirmation() {
  // Call the Alexa ISP API to retrieve the products added in the Alexa Developer Console
  const products = await this.$alexa!.isp.getProductList();

  const firstProduct = products.inSkillProducts[0];
  return this.$send(IspBuyOutput, {
    message: 'This is the plan I have to offer',
    productId: firstProduct.productId,
  });
}
```

The [handle purchase results](#handle-purchase-results) section explains how to accept requests from Alexa with information about the user's purchase decision. For example, you can react to an accepted purchase of the type `Buy` like this:

```typescript
import { Handle } from '@jovotech/framework';
import { AlexaHandles, IspType, PurchaseResult } from '@jovotech/platform-alexa';
// ...

@Handle(AlexaHandles.onIsp(IspType.Buy, PurchaseResult.Accepted)) // or ('Buy', 'ACCEPTED')
successfulPurchase() {
  return this.$send({ message: 'Thanks for buying.' });
}
```

All ISP helpers that are part of the `this.$alexa.isp` property can be found in the [ISP helpers](#isp-helpers) section.



## Delegate to ISP Flow

To [add support for purchase requests](https://developer.amazon.com/docs/alexa/in-skill-purchase/add-isps-to-a-skill.html#buy-requests), you need to send requests of the type `Connections.SendRequest`. These requests hand off the control from your Jovo app code to the Alexa ISP flow.

Jovo offers [output classes](https://www.jovo.tech/docs/output-classes) that make it easier to send those requests for each ISP type:

- [Buy](#buy)
- [Upsell](#upsell)
- [Cancel](#cancel)

### Buy

Here is an example how you could react to a `BuySkillItemIntent` in a Jovo [handler](https://www.jovo.tech/docs/handlers) and use the `IspBuyOutput` [output class](https://www.jovo.tech/docs/output-classes) to hand off to the Alexa ISP flow:

```typescript
import { Handle } from '@jovotech/framework';
import { IspBuyOutput } from '@jovotech/platform-alexa';
// ...

@Handle({
  intents: ['BuySkillItemIntent'],
  platforms: ['alexa']
})
async askForBuyConfirmation() {
  // Call the Alexa ISP API to retrieve the products added in the Alexa Developer Console
  const products = await this.$alexa!.isp.getProductList();

  const firstProduct = products.inSkillProducts[0];
  return this.$send(IspBuyOutput, {
    message: 'This is the plan I have to offer',
    productId: firstProduct.productId,
  });
}
```

Under the hood, the output looks like this:

```typescript
{
  message: this.options.message,
  platforms: {
    alexa: {
      nativeResponse: {
        response: {
          shouldEndSession: true,
          directives: [
            {
              type: 'Connections.SendRequest',
              name: 'Buy',
              payload: {
                InSkillProduct: {
                  productId: this.options.productId,
                },
              },
              token: this.options.token || '',
            },
          ],
        },
      },
    },
  },
}
```

### Upsell

Here is an example how a `askForUpsell` [handler](https://www.jovo.tech/docs/handlers) could use the `IspUpsellOutput` [output class](https://www.jovo.tech/docs/output-classes) to hand off to the Alexa ISP flow. For more information about purchase suggestions, take a look at the [official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/in-skill-purchase/add-isps-to-a-skill.html#product-offers).

```typescript
import { Handle } from '@jovotech/framework';
import { IspUpsellOutput } from '@jovotech/platform-alexa';
// ...

async askForUpsell() {
  // Call the Alexa ISP API to retrieve the products added in the Alexa Developer Console
  const products = await this.$alexa!.isp.getProductList();

  const firstProduct = products.inSkillProducts[0];
  return this.$send(IspUpsellOutput, {
    productId: '<your-product-id>',
    upsellMessage: 'This is my product... Do you want to know more?',
  });
}
```

Under the hood, the output looks like this:

```typescript
{
  message: this.options.message,
  platforms: {
    alexa: {
      nativeResponse: {
        response: {
          shouldEndSession: true,
          directives: [
            {
              type: 'Connections.SendRequest',
              name: 'Upsell',
              payload: {
                InSkillProduct: {
                  productId: this.options.productId,
                },
                upsellMessage: this.options.upsellMessage,
              },
              token: this.options.token || '',
            },
          ],
        },
      },
    },
  },
}
```

### Cancel

Here is an example how you could react to a `CancelSkillItemIntent` in a Jovo [handler](https://www.jovo.tech/docs/handlers) and use the `IspCancelOutput` [output class](https://www.jovo.tech/docs/output-classes) to hand off to the Alexa ISP flow:

```typescript
import { Handle } from '@jovotech/framework';
import { IspCancelOutput } from '@jovotech/platform-alexa';
// ...

@Handle({
  intents: ['CancelSkillItemIntent'],
  platforms: ['alexa']
})
async askForCancelConfirmation() {
  // ...

  return this.$send(IspCancelOutput, {
    productId: '<your-product-id>',
  });
}
```

Under the hood, the output looks like this:

```typescript
{
  message: this.options.message,
  platforms: {
    alexa: {
      nativeResponse: {
        response: {
          shouldEndSession: true,
          directives: [
            {
              type: 'Connections.SendRequest',
              name: 'Cancel',
              payload: {
                InSkillProduct: {
                  productId: this.options.productId,
                },
              },
              token: this.options.token || '',
            },
          ],
        },
      },
    },
  },
}
```

## Handle Purchase Results

After a user interacted with the ISP flow, Alexa sends a `Connections.Response` request to your Jovo app. Learn more in the official Alexa docs: [Resume your skill after the purchase flow](https://developer.amazon.com/en-US/docs/alexa/in-skill-purchase/add-isps-to-a-skill.html#handle-results).

To accept these requests, you can use the `onIsp` helper for the [`@Handle` decorator](https://www.jovo.tech/docs/handle-decorators).

Here is an example for accepted purchases of the type `Buy`:

```typescript
import { Handle } from '@jovotech/framework';
import { AlexaHandles, IspType, PurchaseResult } from '@jovotech/platform-alexa';
// ...

@Handle(AlexaHandles.onIsp(IspType.Buy, PurchaseResult.Accepted)) // or ('Buy', 'ACCEPTED')
successfulPurchase() {
  return this.$send({ message: 'Thanks for buying.' });
}
```

The method `onIsp(type: IspType, purchaseResult?: PurchaseResult)` accepts the following parameters:

- `type: IspType`: This can be `Buy`, `Upsell`, or `Cancel`.
- `purchaseResult?: PurchaseResult`: This can be `ACCEPTED`, `DECLINED`, `ALREADY_PURCHASED`, and `ERROR`.

The `purchaseResult` parameter is optional. You can also retrieve it like this:

```typescript
import { Handle } from '@jovotech/framework';
import { AlexaHandles, PurchaseResult } from '@jovotech/platform-alexa';
// ...

@Handle(AlexaHandles.onIsp('Buy'))
successfulPurchase() {
  const purchaseResult = this.$alexa!.isp.getPurchaseResult();
  if(purchaseResult === PurchaseResult.Accepted) {
    // ...
  }
}
```

Under the hood, the object that is returned for the [`@Handle` decorator](https://www.jovo.tech/docs/handle-decorators) looks like this:

```typescript
{
  global: true,
  types: ['Connections.Response'],
  platforms: ['alexa'],
  if: (jovo: Jovo) => {
    const result = purchaseResult
      ? (jovo.$request as AlexaRequest).request?.payload?.purchaseResult === purchaseResult
      : true;
    return (jovo.$request as AlexaRequest).request?.name === type && result;
  },
}
```


## ISP Helper Methods

You can access the Alexa ISP property like this:

```typescript
this.$alexa.isp
```

It offers the following methods to interact with the Alexa ISP API:

```typescript
await this.$alexa.isp.getProductList();
await this.$alexa.isp.getProductByReferenceName(referenceName: string)
```

There are also the following helpers that help you read data from an ISP request:

```typescript
this.$alexa.isp.getPurchaseResult();
this.$alexa.isp.getProductId();
```