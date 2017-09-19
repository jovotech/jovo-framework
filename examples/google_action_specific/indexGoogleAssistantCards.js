'use strict';

const webhook = require('../../index').Webhook;

webhook.listen(3000, function() {
    console.log('Example server listening on port 3000!');
});

const app = require('../../index').Jovo;

const BasicCard = require('../../index').GoogleAction.BasicCard;
const Carousel = require('../../index').GoogleAction.Carousel;
const List = require('../../index').GoogleAction.List;
const OptionItem = require('../../index').GoogleAction.OptionItem;

app.enableRequestLogging();
app.enableResponseLogging();

app.setIntentMap({
    'Default Welcome Intent': 'HelloWorldIntent',
});

// listen for post requests
webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    app.execute();
});


let handlers = {

    'LAUNCH': function() {
        app.toIntent('SuggestionsIntent');
        // app.toIntent('ListIntent');
        // app.toIntent('CarouselIntent');
    },
    'BasicCardIntent': function() {
        let basicCard = new BasicCard()
            .setTitle('Title')
            .setImage('https://via.placeholder.com/720x480', 'accessibilityText')
            .setFormattedText('Formatted Text');

        app.googleAction().showBasicCard(basicCard);
        app.googleAction().showSuggestionChips(['List', 'Carousel', 'Basic card']);
        app.ask('Response with basic card', '?');
    },
    'SuggestionsIntent': function() {
        // must end with an ask response
        app.googleAction().showSuggestionChips(['List', 'Carousel', 'Basic card']);
        app.googleAction().showLinkOutSuggestion('Name', 'http://www.example.com');
        app.ask('Choose one', 'Choose one');
    },
    'ListIntent': function() {
        let list = new List();
        list.setTitle('Simple selectable List');

        list.addItem(
            (new OptionItem())
                .setTitle('Show a BasicCard')
                .setDescription('BasicCard')
                .setImage('https://via.placeholder.com/720x480', 'accessibilityText')
                .setKey('Listitem1key')
        );
        list.addItem(
            (new OptionItem())
                .setTitle('Show a Carousel')
                .setDescription('Carousel')
                .setKey('Listitem2key')
        );
        app.googleAction().showList(list);
        app.googleAction().showSuggestionChips(['List', 'Carousel', 'Basic card']);
        app.ask('Choose from list', 'Choose from list');
    },
    'CarouselIntent': function() {
        let carousel = new Carousel();

        carousel.addItem(
            (new OptionItem())
                .setTitle('Show a BasicCard')
                .setDescription('BasicCard')
                .setImage('https://via.placeholder.com/720x480', 'accessibilityText')
                .setKey('Carouselitem1key')
        );
        carousel.addItem(
            (new OptionItem())
                .setTitle('Show a List')
                .setDescription('Description2')
                .setImage('https://via.placeholder.com/720x480', 'accessibilityText')
                .setKey('Carouselitem2key')
        );
        app.googleAction().showCarousel(carousel);
        app.googleAction().showSuggestionChips(['List', 'Carousel', 'Basic card']);

        app.ask('Choose from list', 'Choose from list');
    },
    'HelloWorldIntent': function() {
        app.tell('Hello World');
    },
    'ON_ELEMENT_SELECTED': function() {
        let selectedElement = this.getSelectedElementId();

        if (selectedElement === 'Listitem1key') {
            this.toIntent('BasicCardIntent');
        } else if (selectedElement === 'Listitem2key') {
            this.toIntent('CarouselIntent');
        } else if (selectedElement === 'Carouselitem1key') {
            this.toIntent('BasicCardIntent');
        } else if (selectedElement === 'Carouselitem2key') {
            this.toIntent('ListIntent');
        } else {
            this.tell(this.getSelectedElementId());
        }
    },
};
