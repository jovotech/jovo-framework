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
// App Logic: Add (Echo Show) Render Templates
// =================================================================================

let handlers = {

    'LAUNCH': function() {
        // app.tell('App launched');

        let bodyTemplate1 = app.alexaSkill().templateBuilder('BodyTemplate1');
        bodyTemplate1
            .setToken('token')
            .setTitle('BodyTemplate1 Title')
            .setTextContent('Foo', 'Bar');


        let bodyTemplate2 = app.alexaSkill().templateBuilder('BodyTemplate2');
        bodyTemplate2
            .setToken('token')
            .setTitle('BodyTemplate2 Title')
            .setTextContent('Foo', 'Bar')
            .setRightImage({
                description: 'Description',
                url: 'https://via.placeholder.com/350x150',
            });

        let bodyTemplate3 = app.alexaSkill().templateBuilder('BodyTemplate3');
        bodyTemplate3
            .setToken('token')
            .setTitle('BodyTemplate3 Title')
            .setTextContent('Foo', 'Bar')
            .setRightImage({
                description: 'Description',
                url: 'https://via.placeholder.com/350x150',
            });
        let bodyTemplate6 = app.alexaSkill().templateBuilder('BodyTemplate6');
        bodyTemplate6
            .setToken('token')
            .setTextContent('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', 'Bar')
            .setRightImage({
                description: 'Description',
                url: 'https://via.placeholder.com/1200x1000',
            });

        let listTemplate1 = app.alexaSkill().templateBuilder('ListTemplate1');
        listTemplate1
            .setTitle('ListTemplate1 Title')
            .setToken('token')
            .addItem(
                'token',
                {
                    description: 'Description',
                    url: 'https://via.placeholder.com/1200x1000',
                },
                'primary text',
                'secondary text',
                'tertiary text'
            ).addItem(
                'token',
                null,
                'primary text',
                'secondary text',
                'tertiary text'
            ).addItem(
                'token',
                {
                    description: 'Description',
                    url: 'https://via.placeholder.com/1200x1000/ffffff/ff0000',
                },
                'primary text',
                'secondary text',
                'tertiary text'
            ).addItem(
                'token',
                {
                    description: 'Description',
                    url: 'https://via.placeholder.com/1200x1000/ffffff/ff0000',
                },
                'primary text',
                'secondary text',
                'tertiary text'
            );
        let listTemplate2 = app.alexaSkill().templateBuilder('ListTemplate2');
        listTemplate2
            .setTitle('ListTemplate2 Title')
            .setToken('token')
            .addItem(
                'token',
                {
                    description: 'Description',
                    url: 'https://via.placeholder.com/1200x1000',
                },
                'primary text',
                'secondary text',
                'tertiary text'
            ).addItem(
            'token',
            null,
            'primary text',
            'secondary text',
            'tertiary text'
        ).addItem(
            'token',
            {
                description: 'Description',
                url: 'https://via.placeholder.com/1200x1000/ffffff/ff0000',
            },
            'primary text',
            'secondary text',
            'tertiary text'
        ).addItem(
            'token',
            {
                description: 'Description',
                url: 'https://via.placeholder.com/1200x1000/ffffff/ff0000',
            },
            'primary text',
            'secondary text',
            'tertiary text'
        );


        let listTemplate3 = app.alexaSkill().templateBuilder('ListTemplate3');
        listTemplate3
            .setTitle('ListTemplate3 Title')
            .setToken('token')
            .setBackButton('VISIBLE')
            .addItem(
                'token',
                {
                    description: 'Description',
                    url: 'https://via.placeholder.com/1200x1000',
                },
                'primary text',
                'secondary text',
                'tertiary text'
            ).addItem(
            'token',
            null,
            'primary text',
            'secondary text',
            'tertiary text'
        ).addItem(
            'token',
            {
                description: 'Description',
                url: 'https://via.placeholder.com/1200x1000/ffffff/ff0000',
            },
            'primary text',
            'secondary text',
            'tertiary text'
        ).addItem(
            'token',
            {
                description: 'Description',
                url: 'https://via.placeholder.com/1200x1000/ffffff/ff0000',
            },
            'primary text',
            'secondary text',
            'tertiary text'
        );

        app
            .alexaSkill()
            .showDisplayTemplate(listTemplate3)
            .showDisplayHint('Foo Bar');

        app.tell('Look at your Echo Show');
    },

    'HelloWorld': function() {
        app.tell('Hello World');
    },

    'ON_ELEMENT_SELECTED': {
        'token': function() {
            app.toIntent('HelloWorld');
        },
    },
};
