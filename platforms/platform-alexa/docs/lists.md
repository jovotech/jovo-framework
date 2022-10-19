---
title: 'Alexa Lists'
excerpt: 'Learn how to use the Alexa Skill Lists feature with Jovo.'
---

# Alexa Lists

Learn how to use the Alexa Skill Lists feature with Jovo.

## Introduction

Alexa supports the ability for users to get list items and change them. [Learn more in the official Alexa documentation](https://developer.amazon.com/en-US/docs/alexa/custom-skills/access-the-alexa-shopping-and-to-do-lists.html).

Jovo offers methods to [get items from a list](#get-items-from-a-list). For example, you can get the item like this in a [handler](https://www.jovo.tech/docs/handlers):

```typescript
async someHandler() {
  const listId = '<LIST ID>';
  const itemId = '<ITEM ID>';

  try {
    const item = await this.$alexa!.$user.getListItem(listId, itemId);
    // ...
    return this.$send({ message: 'Processed item update'});
  } catch(error: Error) {
      // ...
  }
},
```

The `item` you receive from the method call is the same as defined [in the official Alexa documentation](https://developer.amazon.com/en-US/docs/alexa/list-skills/list-management-api-reference.html).

Learn more in the following sections:
- [Permissions](#permissions)
- [Receive Item Update Requests from Alexa](#receive-item-update-requests-from-alexa)
- [List Management Methods](#list-management-methods)


## Permissions

You need to [add permissions to your skill manifest](#add-list-read-permission-to-the-skill-manifest) as well as [ask the users for permission](#ask-users-for-permission) during the interaction.

### Add List-Read Permission to the Skill Manifest

To be able to get the items from a user-list, you need to add the permission to the Skill project

While you can manually enable the permission in the Alexa developer console, we recommend adding it to the `skill.json` manifest directly using the [`files` property in the Alexa project config](./project-config.md#files):

```js
const project = new ProjectConfig({
  // ...
  plugins: [
    new AlexaCli({
      // ...
      files: {
        'skill-package/skill.json': {
          manifest: {
            permissions: [{ name: 'alexa::household:lists:read' }],
          },
        },
      },
    }),
  ],
});
```

Learn more about the [`permissions` field in the official Alexa documentation](https://developer.amazon.com/docs/alexa/smapi/skill-manifest.html#permissions).

### Ask for Permission

Voice permissions provide a frictionless way to ask users if they want to provide access to their lists. [Learn more in the official Alexa docs](https://developer.amazon.com/en-US/docs/alexa/smapi/steps-to-create-a-list-skill.html#use-list-and-skill-events-in-your-list-skill-to-make-your-skill-responsive).

You can use the [`AskForListReadPermissionOutput`](https://github.com/jovotech/jovo-framework/blob/v4/latest/platforms/platform-alexa/src/output/templates/AskForListReadPermissionOutput.ts) (which extends [`AskForPermissionOutput`](https://github.com/jovotech/jovo-framework/blob/v4/latest/platforms/platform-alexa/src/output/templates/AskForPermissionOutput.ts)) for this:

```typescript
import { AskForListReadPermissionOutput } from '@jovotech/platform-alexa';
// ...

someHandler() {
  // ...

  return this.$send(AskForListReadPermissionOutput, {
    message: 'Please grant the permission to your list.',
  });
}
```

## Receive Item Update Requests from Alexa

Your skill will also be called from Alexa when you subscribe to specific events. [Learn more in the official Alexa docs](https://developer.amazon.com/docs/alexa/smapi/list-events-in-alexa-skills.html).

First you have to add `householdList` to your used `apis`. You can't specify this using the Alexa console, that's why you have to enable it using the `skill.json`. The below example does that by using the [`files` property in the Alexa project configuration](./project-config.md#files):

```js
const project = new ProjectConfig({
  // ...
  plugins: [
    new AlexaCli({
      // ...
      files: {
        'skill-package/skill.json': {
          manifest: {
            apis: {
              householdList: {},
            },
          },
        },
      },
    }),
  ],
});
```

Now you can tell Alexa which events you want to listen for. [Find more information about events in the official Alexa docs](https://developer.amazon.com/ja-JP/docs/alexa/smapi/skill-manifest-examples.html).
You also have to use the `skill.json` here:

```js
const project = new ProjectConfig({
  // ...
  plugins: [
    new AlexaCli({
      // ...
      files: {
        'skill-package/skill.json': {
          manifest: {
            events: {
              endpoint: {
                sslCertificateType: 'Wildcard',
                uri: '${JOVO_WEBHOOK_URL}',
              },
              subscriptions: [
                {
                  eventName: 'ITEMS_CREATED',
                },
                {
                  eventName: 'ITEMS_UPDATED',
                },
                {
                  eventName: 'ITEMS_DELETED',
                },
              ],
            },
          },
        },
      },
    }),
  ],
});
```

You can, for example, use the following [handlers](https://www.jovo.tech/docs/handlers) to receive event requests from Alexa:

```typescript
// ITEMS CREATED
@Handle({
  global: true,
  types: ['AlexaHouseholdListEvent.ItemsCreated'],
  platforms: ['alexa'],
})
handleCreatedItems() {
  const { listId, listItemIds } = this.$alexa?.$request.request?.body;
  console.log(`Added ${listItemIds} to ${listId}`);

  if (!listItemIds || !listId) {
    return;
  }
  Promise.all(listItemIds.map(itemId => this.$alexa?.$user?.getListItem(listId, itemId)))
      .then(result => console.log('The created items are: ', result))
}

// ITEMS UPDATED
@Handle({
  global: true,
  types: ['AlexaHouseholdListEvent.ItemsUpdated'],
  platforms: ['alexa'],
})
async handleUpdatedItems() {
  const { listId, listItemIds } = this.$alexa?.$request.request?.body;
  console.log(`Modified ${listItemIds} from ${listId}`);
}

// ITEMS DELETED
@Handle({
  global: true,
  types: ['AlexaHouseholdListEvent.ItemsDeleted'],
  platforms: ['alexa'],
})
async handleDeletedItems() {
  const { listId, listItemIds } = this.$alexa?.$request.request?.body;
  console.log(`Deleted ${listItemIds} from ${listId}`);
}
```

## List Management Methods

The following methods can be used to call the [Alexa List Management API](https://developer.amazon.com/docs/alexa/list-skills/list-management-api-reference.html)

- [Get Lists](#get-lists)
- [Get Items From a List](#get-items-from-a-list)

### Get Lists

The `getLists()` method can be used to make an API call to the [lists metadata endpoint](https://developer.amazon.com/docs/alexa/list-skills/list-management-api-reference.html#get-list-metadata) in the Alexa List Management API:

```typescript
async someHandler() {
  try {
    const lists = await this.$alexa!.$user.getLists();
    // ...
  } catch(error: Error) {
      // ...
  }
},
```

This returns an array of the following structure:

```typescript
[
  {
    "listId": "MTIzLXRvLWRvLVRBU0s=",
    "name": "Alexa to-do list",
    "state": "active",
    "version": 1,
    "statusMap": [{
            "href": "URL",
            "status": "active"
        },
        {
            "href": "URL",
            "status": "completed"
        }
    ]
  },
  // ...
]
```

### Get Items From a List

The `getListItem()` and `getListItems()` methods can be used to make an API call to the [list item endpoint](https://developer.amazon.com/docs/alexa/list-skills/list-management-api-reference.html#get-list-item) in the Alexa List Management API:

```typescript
await this.$alexa.$user.getListItem(listId: string, itemId: string) // Retrieve a single item
await this.$alexa.$user.getListItems(listId: string, itemIds: string[]) // Retrieve multiple items

// Example
async someHandler() {
  const listId = '<LIST ID>';
  const itemId = '<ITEM ID>';

  try {
    const item = await this.$alexa!.$user.getListItem(listId, itemId);
    // ...
    return this.$send({ message: 'Processed item update'});
  } catch(error: Error) {
      // ...
  }
},
```