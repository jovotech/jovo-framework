'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);

// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.toIntent('GetShoppingListIntent');
        // this.toIntent('GetTodoListIntent');
        // this.toIntent('AddItemToToDoListIntent');
        // this.toIntent('AddItemToShoppingListIntent');
    },

    'GetShoppingListIntent': function() {
        // Active or completed
        this.user().getShoppingList('active')
            .then((data) => {
                // Iterate through items on list
                for (let obj of data.items) {
                    this.speech.addSentence(obj.value);
                }
                this.tell(this.speech);
            })
            .catch((error) => {
                console.log(error);
                if (error.code === 'NO_USER_PERMISSION') {
                    this.alexaSkill()
                        .showAskForListPermissionCard(['read'])
                        .tell('Please grant the permission to access your lists.');
                } else {
                    this.tell(error.message);
                }
            });
    },

    'GetTodoListIntent': function() {
        // Active or completed
        this.user().getToDoList('active')
            .then((data) => {
                // Iterate through items on list
                for (let obj of data.items) {
                    this.speech.addSentence(obj.value);
                }
                this.tell(this.speech);
            })
            .catch((error) => {
                console.log(error);
            });
    },

    'UpdateToDoListItemIntent': function() {
        this.user().updateToDoList('Pay bills', 'Go Shopping', 'active')
            .then((data) => {
                console.log(data);
                this.tell('Item updated.');
            })
            .catch((error) => {
                if (error.code === 'NO_USER_PERMISSION') {
                    this
                        .showAskForListPermissionCard(['read', 'write'])
                        .tell('Please grant the permission to access your lists.');
                }
                if (error.code === 'ITEM_NOT_FOUND') {
                    this
                        .tell('Item not found.');
                } else {
                    this.tell(error.message);
                }
            });
    },

    'AddItemToToDoListIntent': function() {
        this.user().addToTodoList('Sport')
            .then((data) => {
                this.tell('Item added.');
            })
            .catch((error) => {
                if (error.code === 'NO_USER_PERMISSION') {
                    this
                        .showAskForListPermissionCard(['read', 'write'])
                        .tell('Please grant the permission to access your lists');
                }
                console.log(error);
            });
    },

    'AddItemToShoppingListIntent': function() {
        this.user().addToShoppingList('Bread')
            .then((data) => {
                this.tell('Item added.');
            })
            .catch((error) => {
                if (error.code === 'NO_USER_PERMISSION') {
                    this
                        .showAskForListPermissionCard(['read', 'write'])
                        .tell('Please grant the permission to access your lists');
                }
                console.log(error);
            });
    },
});

module.exports.app = app;

// quick testing
// node index.js appHelloWorld.js --launch
// node index.js appHelloWorld.js --intent MyNameIsIntent --parameter name=Alex

