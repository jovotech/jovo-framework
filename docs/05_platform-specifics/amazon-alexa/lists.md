# [Platform Specific Features](../) > [Amazon Alexa](./README.md) > Lists
This section provides an overview of Alexa specific features for user data.

* [Lists](#lists)
  * [Shopping List](#shopping-list)
  * [To-Do List](#to---do-list)

## Lists

Currently Amazon Alexa offers a to-do and a shopping list, which both can be updated and read by you, if you have the necessary permissions.
Use a [`card`](./visual.md#permission-card './visual-output#permission-card') to ask for the required permission:

```javascript
this.alexaSkill().showAskforListPermissionCard(['read', 'write']);
this.tell('Please grant the permission to access your lists.');
```

[Official Amazon reference](https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html)

### Shopping List

Get the user's shopping list:

```javascript
this.user().getShoppingList(status);

// example
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

// example
this.user().addToShoppingList('milk', 'active')
    .then((data) => {
        this.tell('Added the item to the list.');
    })
    .catch((error) => {
        if (error.code === 'NO_USER_PERMISSION') {
          this.alexaSkill().showAskForListPermissionCard(['read', 'write']);
          this.tell('Please grant the permission.');
        }
    })
```

Update the shopping list:

```javascript
this.user().updateShoppingList(oldValue, newValue, newStatus);

// example
this.user().updateShoppingList('milk', 'almond milk', 'active')
    .then((data) => {
        this.tell('Updated the list');
    })
    .catch((error) => {
        if (error.code === 'NO_USER_PERMISSION') {
          this.alexaSkill().showAskForListPermissionCard(['read', 'write']);
          this.tell('Please grant the permission.');
        }
        if (error.code === 'ITEM_NOT_FOUND') {
            this.tell('Item not found.');
        }   
    })
```

### To-Do List

Get the user's to-do list:

```javascript
this.user().getToDoList(status);

//example
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
            this.tell('Please grant the permission to access your lists.');
        } 
    });
```

Add an item to the to-do list:

```javascript
this.user().addToDoList(value, status);

// example
this.user().addToTodoList('Sleep', 'active')
    .then((data) => {
        this.tell('Item added.');
    })
    .catch((error) => {
        if (error.code === 'NO_USER_PERMISSION') {
            this.alexaSkill().showAskForListPermissionCard(['read', 'write'])
            this.tell('Please grant the permission to access your lists');
        }
    });
```

Update the to-do list:

```javascript
this.user().updateToDoList(oldValue, newValue, newStatus);

// example
this.user().updateToDoList('Pay bills', 'Go Shopping', 'active')
    .then((data) => {
        this.tell('Item updated.');
    })
    .catch((error) => {
        if (error.code === 'NO_USER_PERMISSION') {
            this.alexaSkill().showAskForListPermissionCard(['read', 'write'])
            this.tell('Please grant the permission to access your lists.');
        }
        if (error.code === 'ITEM_NOT_FOUND') {
            this.tell('Item not found.');
        }
    });
```




<!--[metadata]: {"title": "Alexa Lists", "description": "Learn how to build Amazon Alexa Skills that use Lists with the Jovo Framework", "activeSections": ["platforms", "alexa", "alexa_lists"], "expandedSections": "platforms", "inSections": "platforms", "breadCrumbs": {"Docs": "framework/docs", "Platforms": "framework/docs/platforms",
"Amazon Alexa": "framework/docs/amazon-alexa", "Lists": "" }, "commentsID": "framework/docs/amazon-alexa/lists" }-->
