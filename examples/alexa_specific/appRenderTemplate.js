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
    'WelcomeIntent': function() {
        // app.tell('App launched');

        let bodyTemplate1 = this.alexaSkill().templateBuilder('BodyTemplate1');
        bodyTemplate1
            .setToken('token')
            .setTitle('BodyTemplate1 Title')
            .setTextContent('Foo', 'Bar');


        let bodyTemplate2 = this.alexaSkill().templateBuilder('BodyTemplate2');
        bodyTemplate2
            .setToken('token')
            .setTitle('BodyTemplate2 Title')
            .setTextContent('Foo', 'Bar')
            .setRightImage({
                description: 'Description',
                url: 'https://via.placeholder.com/350x150',
            });

        let bodyTemplate3 = this.alexaSkill().templateBuilder('BodyTemplate3');
        bodyTemplate3
            .setToken('token')
            .setTitle('BodyTemplate3 Title')
            .setTextContent('Foo', 'Bar')
            .setRightImage({
                description: 'Description',
                url: 'https://via.placeholder.com/350x150',
            });
        let bodyTemplate6 = this.alexaSkill().templateBuilder('BodyTemplate6');
        bodyTemplate6
            .setToken('token')
            .setTextContent('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.', 'Bar')
            .setRightImage({
                description: 'Description',
                url: 'https://via.placeholder.com/1200x1000',
            });

        let listTemplate1 = this.alexaSkill().templateBuilder('ListTemplate1');
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
        let listTemplate2 = this.alexaSkill().templateBuilder('ListTemplate2');
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


        let listTemplate3 = this.alexaSkill().templateBuilder('ListTemplate3');
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

        this
            .alexaSkill()
            .showDisplayTemplate(listTemplate3)
            .showDisplayHint('Foo Bar');

        this.tell('Look at your Echo Show');
    },

    'HelloWorld': function() {
        this.tell('Hello World');
    },

    'ON_ELEMENT_SELECTED': {
        'token': function() {
            this.toIntent('HelloWorld');
        },
    },
});

module.exports.app = app;

// quick testing
// node index.js appHelloWorld.js --launch
// node index.js appHelloWorld.js --intent MyNameIsIntent --parameter name=Alex


