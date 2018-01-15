'use strict';

// =================================================================================
// App Configuration: Create Webhook + Enable Logging
// =================================================================================

const webhook = require('../../index').Webhook;
const app = require('../../index').Jovo;

// Enable Logging for Quick Testing
app.setConfig({
    requestLogging: true,
    responseLogging: true,
});

// Listen for post requests
webhook.listen(3000, function() {
    console.log('Example server listening on port 3000!');
});

webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});


// =================================================================================
// App Logic: Get and Update Shopping and ToDo-List-Items
// =================================================================================

let handlers = {

    'LAUNCH': function() {
       // this.toIntent('GetShoppingListIntent');
       // this.toIntent('GetTodoListIntent');
       // this.toIntent('AddItemToToDoListIntent');
       this.toIntent('GetShoppingListIntent');
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
                if (error.code === 'NO_USER_PERMISSION') {
                    app
                        .showAskForListPermissionCard(['read'])
                        .tell('Please grant the permission to access your lists.');
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
                    app
                        .showAskForListPermissionCard(['read', 'write'])
                        .tell('Please grant the permission to access your lists.');
                }
                if (error.code === 'ITEM_NOT_FOUND') {
                    app
                        .tell('Item not found.');
                }
        });
    },

    'AddItemToToDoListIntent': function() {
        this.user().addToTodoList('Sleep')
            .then((data) => {
                this.tell('Item added.');
            })
            .catch((error) => {
                if (error.code === 'NO_USER_PERMISSION') {
                    app
                        .showAskForListPermissionCard(['read', 'write'])
                        .tell('Please grant the permission to access your lists');
                }
                console.log(error);
            });
    },

};
