const {App, Alexa, BasicLogging, Jovo, Util, GoogleAssistant, Dialogflow, DialogflowNlu, SpeechBuilder} = require('jovo-framework');

Util.consoleLog(1);

const {BodyTemplate1} = require('jovo-platform-alexa');
const {BasicCard, Carousel, CarouselItem, OptionItem, List, CarouselBrowseTile, CarouselBrowse, Table} = require('jovo-platform-googleassistant');

const { DynamoDb } = require('jovo-db-dynamodb');
const { MySQL } = require('jovo-db-mysql');
const {Messenger} = require('jovo-platform-messenger');
const _ = require('lodash');
process.env.NODE_ENV = 'dev';

const app = new App();

SpeechBuilder.ESCAPE_AMPERSAND = false;

const googleAssistant = new GoogleAssistant();
googleAssistant.use(new DialogflowNlu());

// app.use(new Dialogflow());
app.use(googleAssistant);
app.use(new Alexa());

// alexa.config.allowedSkillIds = ['abc'];



let awsConfig = {
    accessKeyId: '',
    secretAccessKey: '',
    region:  'us-east-1',
};
//
// app.use(new DynamoDB({
//     tableName: 'Blub26',
//     // awsConfig
// }));
//
// app.use(new MySQL({
//     connection: {
//         host     : 'localhost',
//         user     : 'root',
//         password : '',
//         database : 'test'
//     }
// }));

// app.setUp = getCMS;
//
// app.onError((obj) => {
//     console.log(obj.error);
//    console.log('error thrown');
//    // jovo.tell('error')
// });
// //
// app.middleware('before.request').use((jovo, host) => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             console.log('app.before.request');
//             resolve();
//         }, 200);
//     })
// });
//
// app.middleware('after.response').use((handleRequest) => {
//     // return new Promise((resolve) => {
//     //     setTimeout(() => {
//     //         console.log('app.after.response1');
//     //         resolve();
//     //     }, 200);
//     // })
//     setTimeout(() => {
//         console.log('done1');
//     }, 1000);
// });
//
// app.middleware('after.response').use((handleRequest) => {
//     setTimeout(() => {
//         console.log('done2');
//     }, 1000);
//
//     // return new Promise((resolve) => {
//     //     setTimeout(() => {
//     //         console.log('app.after.response2');
//     //         resolve();
//     //     }, 2000);
//     // })
// });
// app.middleware('after.response').use( async (handleRequest) => {
//     setTimeout(() => {
//         console.log('done3');
//     }, 1000);
//
//     return Promise.resolve();
// });
// app.middleware('after.response').use((handleRequest) => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             console.log('app.after.response3');
//             resolve();
//         }, 3000);
//     })
// });
//
// //
// app.middleware('request').use((jovo) => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             console.log('app.request');
//             resolve();
//         }, 200);
//     })
// });
//
//
// app.on('request', () => {
//     console.log('on request listener');
// });
//

app.setUp().use((handleRequest) => {
    return new Promise((resolve) => {
        console.log('setup');
        resolve();
    })

    handleRequest.app.config.Email.from =
});

// app.onError((handleRequest) => {
//    console.log(handleRequest.error);
// });

// app.setAlexaHandler({
//     LAUNCH() {
//         this.tell('Hallo Alexa');
//     }
// });
// app.setGoogleActionHandler({
//     LAUNCH() {
//         this.tell('Hallo Google');
//     }
// });

app.setHandler({

    'State1': {
        HelloWorldIntent() {
            return this.followUpState('State2').ask('Hello World', 'Hallo');
            // return this.tell('asdqsd');
        },
    },

    'HelloWorldIntent': async function() {
        console.log(this.getHandlerPath());

        return this.tell('Hallo');
        const dialog = this.alexaSkill().dialog();
        console.log(dialog);
        console.log(dialog.getState());
        if (!dialog.isCompleted()) {


            return dialog.elicitSlot('age', 'Age?', 'Age2?').ask('bla', 'blaa');

            let updatedIntent = {
                name: 'HelloWorldIntent',
                confirmationStatus: 'NONE',
                slots: {
                    name: {
                        name: 'name',
                    },
                    city: {
                        name: 'city',
                    },
                    age: {
                        name: 'age',
                        value: '40',
                        confirmationStatus: 'CONFIRMED',
                    }
                }
            };

            return dialog.delegate(updatedIntent);
        }

    },
    // ON_ERROR() {
    //   console.log('eeeeeeeeeeeeror');
    //     this.tell('ERROR');
    // },
    // END() {
    //     this.tell('bye global');
    // },
    ON_ELEMENT_SELECTED() {
        this.tell(this.googleAction().getSelectedElementId())
    },
    // ON_PERMISSION: {
    //     Carouselitem2key() {
    //         this.tell(this.googleAction().isPermissionGranted());
    //     }
    // },

    NEW_USER() {
      console.log('new USER');
    },

    ON_PERMISSION() {
        this.tell(this.googleAction().isPermissionGranted());
    },
    ON_SIGN_IN() {
      this.tell('bla ' + this.googleAction().getSignInStatus())
    },

    ON_DATETIME() {
        this.tell('bla ' + this.googleAction().getDateTime())
    },
    ON_CONFIRMATION() {
        this.tell('bla ' + this.googleAction().isConfirmed())
    },
    'AMAZON.PauseIntent'() {
        this.alexaSkill().audioPlayer().stop();
    },
    AUDIOPLAYER: {
        'GoogleAction.Finished'() {
            this.tell('finished');
        },
        'AlexaSkill.PlaybackStarted'() {

            console.log('AlexaSkill.PlaybackStarted');
        },
        'AlexaSkill.PlaybackNearlyFinished'() {

            console.log('AlexaSkill.PlaybackNearlyFinished');
            this.alexaSkill().audioPlayer().setExpectedPreviousToken('blub').enqueue('https://www.jovo.tech/audio/wfPHHzHz-nextlife.mp3', 'blub');
        }
    },
    'LAUNCH': async function() {
        // return this.tell('bla');
        // await this.$user.delete();
        // return this.repeat();

        return this.ask('What\'s your name?','bla');

        // this.speech.addText('Hallo Welt');
        // this.speech.addText(this.t('HELLO'));
        this.speech.t('HELLO');

        return this.tell(this.speech);


        return this.alexaSkill().audioPlayer().play('https://www.jovo.tech/audio/wfPHHzHz-nextlife.mp3', 'bla');

        // _.set(this.$output, 'googleAction.card.BasicCard',new BasicCard().setTitle('Hallo Google').setSubtitle('Subtitle').setFormattedText('Hallo'));
        return this.ask('bla', 'bklub');

        return this.googleAction().askForPlace('Hallo', 'Welt').ask('bla', 'blub');

        return this.googleAction().askForConfirmation('Wirklich?').ask('bla', 'blub');

        return this.googleAction().askForDateTime({
            requestTimeText: 'Zeit',
            requestDateText: 'Datum',
            requestDatetimeText: 'Datumzeit',
        }).tell('blub');



        const options = {
            description: 'description',
            largeImage: {
                url: 'https://via.placeholder.com/650x350?text=Carousel+item+2',
                accessibilityText: 'accessibilityText',
            }
        };
        this.googleAction().showSuggestionChips(['List', 'Carousel', 'Basic card', 'Table']);

        return this.googleAction().mediaResponse().play('https://www.jovo.tech/audio/WMxAtvSO-nextlife.mp3', 'Name', options).ask('lol', 'lolol');

        return this.googleAction().displayText('Hallo').tell('Blaaaa');



        let list = new List();
        list.setTitle('Simple selectable List');

        list.addItem(
            (new OptionItem())
                .setTitle('Show a BasicCard')
                .setDescription('BasicCard')
                .setImage(
                    {
                        url: 'https://via.placeholder.com/650x350?text=Carousel+item+2',
                        accessibilityText: 'accessibilityText',
                    })
                .setKey('Listitem1key')
        );
        list.addItem(
            (new OptionItem())
                .setTitle('Show a Carousel')
                .setDescription('Carousel')
                .setKey('Listitem2key')
        );
        list.addItem(
            (new OptionItem())
                .setTitle('Show a Table')
                .setDescription('Table')
                .setKey('Listitem3key')
        );
        this.googleAction().showList(list);
        this.googleAction().showSuggestionChips(['List', 'Carousel', 'Basic card', 'Table']);
        return this.ask('Choose from list', 'Choose from list');


        let table = new Table()
            .setTitle('Table Title')
            .setImage({
                url: 'https://via.placeholder.com/650x350?text=Carousel+item+2',
                accessibilityText: 'accessibilityText',
            })
            .addColumn('header 1','CENTER')
            .addColumn('header 2','LEADING')
            .addColumn('header 3','TRAILING')
            .addRow(['row 1 item 1', 'row 1 item 2', 'row 1 item 3'], false)
            .addRow(['row 2 item 1', 'row 2 item 2', 'row 2 item 3'], true)
            .addRow(['row 3 item 3', 'row 3 item 2', 'row 3 item 3'])
            .addButton("Button Title", "https://github.com/jovotech/jovo-framework-nodejs")




        this.googleAction().showSuggestionChips(['List', 'Carousel', 'Basic card', 'Table']);


        this.googleAction().showTable(table);

        return this.ask('Click on the link', 'Click on the link');




        let carouselBrowse = new CarouselBrowse();

        carouselBrowse.addItem(
            (new CarouselBrowseTile())
                .setTitle('Title 1')
                .setDescription('Description 1')
                .setFooter('footer 1')
                .setOpenUrlAction({
                    url: 'https://www.jovo.tech',
                })
                .setImage({
                    url: 'https://via.placeholder.com/650x350?text=Carousel+item+2',
                    accessibilityText: 'accessibilityText',
                }));
        carouselBrowse.addItem(
            (new CarouselBrowseTile())
                .setTitle('Title 2')
                .setDescription('Description 1')
                .setFooter('footer 1')
                .setOpenUrlAction({
                    url: 'https://www.jovo.tech',
                })
                .setImage({
                    url: 'https://via.placeholder.com/650x350?text=Carousel+item+2',
                    accessibilityText: 'accessibilityText',
                }));
        this.googleAction().showCarouselBrowse(carouselBrowse);
        this.googleAction().showSuggestionChips(['chip1', 'chip2']);

        return this.ask('Click on the link', 'Click on the link');



        const carousel = new Carousel();

        // carousel.addItem(item1);
        carousel.addItem(
            (new OptionItem())
                .setTitle('Show a BasicCard1')
                .setDescription('BasicCard')
                .setImage({
                    url: 'https://via.placeholder.com/650x350?text=Carousel+item+1',
                    accessibilityText: 'accessibilityText',
                })
                .setKey('Carouselitem1key')
        );

        // carousel.addItem(item1);
        carousel.addItem(
            (new OptionItem())
                .setTitle('Show a BasicCard2123')
                .setDescription('BasicCard')
                .setImage({
                    url: 'https://via.placeholder.com/650x350?text=Carousel+item+2',
                    accessibilityText: 'accessibilityText',
                })
                .setKey('Carouselitem2key')
        );
        // this.googleAction().showSuggestionChips(['Hallo', 'bar']);

        return this.googleAction().showCarousel(carousel).ask('Hallo123', 'Welt');
        this.googleAction().showSuggestionChips(['Hallo', 'bar']);

        return this.googleAction().showLinkOutSuggestion('Destname', 'https://assistant.google.com/').ask('Hallo', 'bla');


        // return this.googleAction().askForSignIn('Blub');
        // return this.googleAction().askForNamePermission('Bla');
        // return this.googleAction().askForCoarseLocation('Bla');
        // return this.googleAction().askForPreciseLocation('Bla');
        // return this.googleAction().askForUpdate('Default Welcome Intent', 'Bla').tell('yo');

        return this.googleAction().askForPermission(['NAME', 'DEVICE_COARSE_LOCATION', 'DEVICE_PRECISE_LOCATION'], 'give me your stuff');

        // return this.showAccountLinkingCard().ask('Please login', 'bla');



        const basicCard = new BasicCard()
            .setTitle('Hallo Google')
            .setSubtitle('Subtitle')
            .setFormattedText('Hallo');

        const basicCardJson = {
            title: 'Hallo',
            subtitle: 'Subtitle',
            formattedText: 'blub'
        };

        return this.googleAction().showBasicCard(basicCardJson).tell('Card');

        return this.tell('Card');

        return this.output({

            tell: {
                speech:   `<speak>Hallo ${bla}</speak>`
            },

            alexaSkill: {
                tell: {
                    speech: `<speak>Hallo Alexa</speak>`
                }
            },
            googleAction: {
                tell: {
                    speech: `<speak>Hallo Google Assistant</speak>`
                }
            }
        });


        return this.ask('Hallooooo', 'GHaasdasd');


        return this.followUpState('bla').ask('Bla', 'blub');

        if (this.isGoogleAction()) {
            this.$sessionAttributes.foo = 'bar';
            return this.followUpState('HelloState').ask('Hello Google', ['Hallo','Hey']);

        } else if (this.isAlexaSkill()) {
            this.$sessionAttributes.blub = 'bla';
            return this.followUpState('HelloState').ask('Hello Alexa', 'Hallo');
        }

        return this.showSimpleCard('Hallo', 'Google Action').tell('Hello Dialogflow');

        return this.alexaSkill()
            .showVideo('https://swetlow.de/Chart3.mp4')
            .tell('Ok');
        return this.alexaSkill()
            .showDisplayTemplate(new BodyTemplate1().setTextContent('Text1'))
            .showHint('Hallo')
            .tell('Hello');

        // return this.toIntent('HelloWorldIntent');

        // return this.showSimpleCard('Hello', 'World').tell('Hello World');

        // this.alexaSkill().showStandardCard('Card title', 'card content', {
        //     smallImageUrl: 'https:',
        //     largeImageUrl: 'https',
        // });
        //
        // this.alexaSkill().audioPlayer().play('bla', 'bla', 'REPLACE_ALL');

        // this.alexaSkill().showDisplayTemplate(new BodyTemplate1().setTextContent('HelloWorld'));
        // this.alexaSkill().showAskForListPermissionCard(['read']);
        return this.tell('bla');
        // this.alexaSkill().inSkillPurchase().buy();


        // this.alexaSkill().progressiveResponse('Processing your request', () => {
        //     setTimeout( () => {
        //         this.alexaSkill().progressiveResponse('Still processing');
        //     }, 1500);
        // });

        // this.alexaSkill().progressiveResponse('Processing', () => {
        //     console.log('done');
        //     this.alexaSkill().progressiveResponse('Processing 2');
        // });





        try {
            // const address = await this.$user.getDeviceAddress();
            // const address = await this.$user.getCountryAndPostalCode();
            // const list = await this.$user.getShoppingList();
            // await this.$user.addToShoppingList('Kartoffel');
            await this.$user.updateShoppingList('Kartoffel', 'Eier' );

            const list = await this.$user.getShoppingList();
            for (const item of list.items) {
                console.log(item);
            }
        } catch (e) {
            if (e.code === 'ITEM_NOT_FOUND') {
                this.tell('nicht gefunden');
            }
        }
    },
    'HelloState': {
        async MyNameIsIntent() {
            // console.log(this.$inputs.name.value);
            // console.log(this.getInput('name').value);
            this.tell('Hi in state');
        },
    },
    'MyNameIsIntent': async function() {
        this.$sessionAttributes.bla = 'blub';


        console.log(this.$inputs);
        this.ask('Hi ', 'bla');
    },
    'CatchAllIntent': function() {
        this.tell('Hello Messenger 123');
    },
    HelloWorldIntent2: async function() {
        this.tell(this.$request.getLocale() + this.t('HELLO'));
    },
});


// function getCMS(app) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             // console.log('cms initialized');
//             app.cms = {bla: 'blub'};
//             resolve();
//         }, 100);
//     });
// }
/**
 * Simulates a long api call
 * @param {func} callback
 */
function dummyApiCall(callback) {
    setTimeout(callback, 7000);
}


/**
 * Simulates a long api call
 * @param {func} callback
 */
function dummyApiCallPromise() {
    return new Promise((resolve) => setTimeout(resolve, 4000));
}

module.exports.app = app;
