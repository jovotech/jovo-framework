# [Platform Specific Features](../) > [Amazon Alexa](./README.md) > Lists
This section shows how to access shopping lists and to-do lists when building Alexa Skills with the Jovo Framework.

* [Introduction to Lists](#introduction-to-lists)
   * [List Permissions](#list-permissions)
   * [List Permission Card](#list-permission-card)
* [Shopping List](#shopping-list)
* [To-Do List](#to---do-list)

## Introduction to Lists

Amazon Alexa offers the ability to its users to add items to a shopping list and a to-do list. Custom Skills can get the permission to access these lists for read and write operations. For a general overview, read the [official list reference by Amazon](https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html).


### List Permissions

Users need to grant your Alexa Skill permission for `read` and/or `write` access to their lists. To enable your Alexa Skill to ask for list permissions, you can do either of the following:
* Configure permissions in the Amazon Developer Portal
* Update the `skill.json`
* Update the Jovo `app.json`

In the Amazon Developer Portal, you can do this by checking the following permissions:

![Alexa List Permissions](../../img/alexa-list-permissions.jpg)

The same result is achieved by adding the following to the `manifest` in your `skill.json`:

```javascript
"permissions": [
      {
        "name": "alexa::household:lists:read"
      },
      {
        "name": "alexa::household:lists:write"
      }
]
```

If you're using the [Jovo Language Model](../../03_app-configuration/01_models/README.md) and don't want to make the changes to the Amazon Developer Portal, you can also add this to the `alexaSkill` object in the `app.json` of your Jovo project. This way, these permissions are written into the `skill.json` with the `jovo build` command.

This is how an example `app.json` could look like:

```javascript
{
	"alexaSkill": {
		"nlu": "alexa",
		"manifest": {
			"permissions": [
				{
				  "name": "alexa::household:lists:read"
				},
				{
				  "name": "alexa::household:lists:write"
				}
			]
		}
	},
	"endpoint": "${JOVO_WEBHOOK_URL}"
}
```



### List Permission Card

If your users haven't granted your Skill the permission access lists yet (for example because they did not enabled it with their voice, not in the Alexa app), you can use a [`List Permission Card`](./visual.md#permission-card './visual-output#permission-card') to ask for the required permission.

This is mostly used after the error code `'NO_USER_PERMISSION'` is returned. Here is an example:

```javascript
this.user().getShoppingList('active')
    .then((data) => {
        // Success! Now do something with the data
    })
    .catch((error) => {
        if (error.code === 'NO_USER_PERMISSION') {
            this.alexaSkill().showAskForListPermissionCard(['read'])
                .tell('Please grant the permission to access your lists.');
        } else {
            this.tell(error.message);
        }
    });
```

You can ask for both `read` and `write` access with the Permission Card:

```javascript
this.alexaSkill().showAskforListPermissionCard(['read', 'write'])
    .tell('Please grant the permission to access your lists.');
```

This is what it looks like in the Alexa app:

![Alexa List Permission Card in the Alexa App](../../img/alexa-list-permission-card.jpg)

Users can then update the permissions in the Skill's settings:

![Update List Permissions in the Alexa App](../../img/alexa-list-permissions-app.jpg)


## Shopping List

Get the user's shopping list:

```javascript
this.user().getShoppingList(status);

// Example
this.user().getShoppingList('active')
    .then((data) => {
        for (let obj of data.items) {
            this.speech.addSentence(obj.value);
        }
        this.tell(this.speech);
    })
    .catch((error) => {
        if (error.code === 'NO_USER_PERMISSION') {
            this.alexaSkill().showAskForListPermissionCard(['read']);
            this.tell('Please grant the permission.');
        }
    })
```

Add an item to the shopping list:

```javascript
this.user().addToShoppingList(value, status);

// Example
this.user().addToShoppingList('milk', 'active')
    .then((data) => {
        this.tell('Added the item to the list.');
    })
    .catch((error) => {
        if (error.code === 'NO_USER_PERMISSION') {
            this.alexaSkill().showAskForListPermissionCard(['read', 'write']
                .tell('Please grant the permission.');
        }
    })
```

Update the shopping list:

```javascript
this.user().updateShoppingList(oldValue, newValue, newStatus);

// Example
this.user().updateShoppingList('milk', 'almond milk', 'active')
    .then((data) => {
        this.tell('Updated the list');
    })
    .catch((error) => {
        if (error.code === 'NO_USER_PERMISSION') {
            this.alexaSkill().showAskForListPermissionCard(['read', 'write'])
                .tell('Please grant the permission.');
        }
        if (error.code === 'ITEM_NOT_FOUND') {
            this.tell('Item not found.');
        }   
    })
```

## To-Do List

Get the user's to-do list:

```javascript
this.user().getToDoList(status);

// Example
this.user().getToDoList('active')
    .then((data) => {
        for (let obj of data.items) {
            this.speech.addSentence(obj.value);
        }
        this.tell(this.speech);
    })
    .catch((error) => {
       if (error.code === 'NO_USER_PERMISSION') {
            this.alexaSkill().showAskForListPermissionCard(['read', 'write'])
                .tell('Please grant the permission to access your lists.');
        } 
    });
```

Add an item to the to-do list:

```javascript
this.user().addToDoList(value, status);

// Example
this.user().addToTodoList('Sleep', 'active')
    .then((data) => {
        this.tell('Item added.');
    })
    .catch((error) => {
        if (error.code === 'NO_USER_PERMISSION') {
            this.alexaSkill().showAskForListPermissionCard(['read', 'write'])
                .tell('Please grant the permission to access your lists');
        }
    });
```

Update the to-do list:

```javascript
this.user().updateToDoList(oldValue, newValue, newStatus);

// Example
this.user().updateToDoList('Pay bills', 'Go Shopping', 'active')
    .then((data) => {
        this.tell('Item updated.');
    })
    .catch((error) => {
        if (error.code === 'NO_USER_PERMISSION') {
            this.alexaSkill().showAskForListPermissionCard(['read', 'write'])
                .tell('Please grant the permission to access your lists.');
        }
        if (error.code === 'ITEM_NOT_FOUND') {
            this.tell('Item not found.');
        }
    });
```




<!--[metadata]: {"title": "Alexa Lists", "description": "Learn how to build Amazon Alexa Skills that use Lists with the Jovo Framework", "activeSections": ["platforms", "alexa", "alexa_lists"], "expandedSections": "platforms", "inSections": "platforms", "breadCrumbs": {"Docs": "docs/", "Platforms": "docs/platforms",
"Amazon Alexa": "docs/amazon-alexa", "Lists": "" }, "commentsID": "framework/docs/amazon-alexa/lists",
"route": "docs/amazon-alexa/lists" }-->
