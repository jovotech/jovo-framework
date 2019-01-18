const {App} = require('jovo-framework');
const {
    Alexa,
    BodyTemplate1,
    BodyTemplate2,
    BodyTemplate3,
    BodyTemplate6,
    BodyTemplate7,
    ListTemplate1,
    ListTemplate2,
    ListTemplate3} = require('jovo-platform-alexa');
const { JovoDebugger } = require('jovo-plugin-debugger');

const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger(),
);


app.setHandler({
    LAUNCH() {
        // return this.toIntent('BodyTemplate1Intent');
        // return this.toIntent('BodyTemplate2Intent');
        // return this.toIntent('BodyTemplate3Intent');
        // return this.toIntent('BodyTemplate6Intent');
        // return this.toIntent('BodyTemplate7Intent');
        return this.toIntent('ListTemplate1Intent');
        // return this.toIntent('ListTemplate2Intent');
        // return this.toIntent('ListTemplate3Intent');
    },
    BodyTemplate1Intent() {
        return this.$alexaSkill
            .showDisplayTemplate(new BodyTemplate1().setTextContent('Text1'))
            .showHint('Hallo')
            .tell('Hello');
    },
    BodyTemplate2Intent() {
        return this.$alexaSkill
            .showDisplayTemplate(new BodyTemplate2().setTextContent('Text1').setRightImage({
                description: 'Description',
                url: 'https://via.placeholder.com/350x150',
            }))
            .showHint('Hallo')
            .tell('Hello');
    },
    BodyTemplate3Intent() {
        return this.$alexaSkill
            .showDisplayTemplate(new BodyTemplate3()
                .setTextContent('Text1')
                .setLeftImage({
                description: 'Description',
                url: 'https://via.placeholder.com/350x150',
                })
            )
            .showHint('Hallo')
            .tell('Hello');
    },
    BodyTemplate6Intent() {
        return this.$alexaSkill
            .showDisplayTemplate(new BodyTemplate6()
                .setTextContent('Text1')
                .setFullScreenImage({
                    description: 'Description',
                    url: 'https://via.placeholder.com/350x150',
                })
            )
            .showHint('Hallo')
            .tell('Hello');
    },
    BodyTemplate7Intent() {
        return this.$alexaSkill
            .showDisplayTemplate(new BodyTemplate7()
                .setTextContent('Text1')
                .setImage({
                    description: 'Description',
                    url: 'https://via.placeholder.com/350x150',
                })
            )
            .showHint('Hallo')
            .tell('Hello');
    },
    ListTemplate1Intent() {
        let listTemplate1 = new ListTemplate1();
        listTemplate1
            .setTitle('ListTemplate1 Title')
            .setToken('token1')
            .addItem(
                'tokenA',
                {
                    description: 'Description',
                    url: 'https://via.placeholder.com/1200x1000',
                },
                'primary text',
                'secondary text',
                'tertiary text'
            ).addItem(
            'tokenB',
            null,
            'primary text',
            'secondary text',
            'tertiary text'
        ).addItem(
            'tokenC',
            {
                description: 'Description',
                url: 'https://via.placeholder.com/1200x1000/ffffff/ff0000',
            },
            'primary text',
            'secondary text',
            'tertiary text'
        ).addItem(
            'tokenD',
            {
                description: 'Description',
                url: 'https://via.placeholder.com/1200x1000/ffffff/ff0000',
            },
            'primary text',
            'secondary text',
            'tertiary text'
        );
        this.followUpState('State1');
        return this.$alexaSkill
            .showDisplayTemplate(listTemplate1)
            .ask('Hello?', 'Hello?');
    },
    ListTemplate2Intent() {
        let listTemplate2 = new ListTemplate2();
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

        return this.$alexaSkill
            .showDisplayTemplate(listTemplate2)
            .showHint('Hallo')
            .tell('Hello');
    },
    ListTemplate3Intent() {
        let listTemplate3 = new ListTemplate3();
        listTemplate3
            .setTitle('ListTemplate3 Title')
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

        return this.$alexaSkill
            .showDisplayTemplate(listTemplate3)
            .showHint('Hallo')
            .tell('Hello');
    },
    'State1': {
        ON_ELEMENT_SELECTED: {
            tokenA() {
                this.tell('Yo! ' + this.getSelectedElementId());
            },
            tokenB() {
                this.tell('Yo! ' + this.getSelectedElementId());
            }
        }
    },
    ON_ELEMENT_SELECTED() {
        this.tell('OK ' + this.getSelectedElementId());
    },
});


module.exports.app = app;
