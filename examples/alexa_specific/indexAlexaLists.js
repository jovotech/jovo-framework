'use strict';

const webhook = require('../../index').Webhook;

webhook.listen(3000, function() {
    console.log('Example server listening on port 3000!');
});

const app = require('../../index').Jovo;
app.enableRequestLogging();
// app.enableResponseLogging();

// listen for post requests
webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});


let handlers = {

    'LAUNCH': function() {
       // app.toIntent('GetShoppingListIntent');
       //  app.toIntent('GetTodoListIntent');
       // app.toIntent('AddItemToToDoListIntent');
       app.toIntent('UpdateItemIntent');
    },
    'GetShoppingListIntent': function() {
        // active or completed
        app.user().getShoppingList('active')
            .then((data) => {
                // iterate items on list
                for (let obj of data.items) {
                    app.speech.addSentence(obj.value);
                }
                app.tell(app.speech);
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
        // active or completed
        app.user().getToDoList('active')
            .then((data) => {
                // iterate items on list
                for (let obj of data.items) {
                    app.speech.addSentence(obj.value);
                }
                app.tell(app.speech);
            })
            .catch((error) => {
                console.log(error);
            });
    },
    'UpdateItemIntent': function() {
        app.user().updateToDoList('Pay bills', 'Go Shopping', 'active')
            .then((data) => {
            console.log(data);
                app.tell('item changed');
            })
            .catch((error) => {
                if (error.code === 'NO_USER_PERMISSION') {
                    app
                        .showAskForListPermissionCard(['read', 'write'])
                        .tell('Please grant the permission to access your lists');
                }
                if (error.code === 'ITEM_NOT_FOUND') {
                    app
                        .tell('Item not found');
                }
        });
    },
    'AddItemToToDoListIntent': function() {
        app.user().addToTodoList('Sleep')
            .then((data) => {
                app.tell('Item added');
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
