'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};
const BasicCard = require('../../index').GoogleAction.BasicCard;
const Carousel = require('../../index').GoogleAction.Carousel;
const List = require('../../index').GoogleAction.List;
const OptionItem = require('../../index').GoogleAction.OptionItem;

const app = new App(config);
app.setIntentMap({
    'Default Welcome Intent': 'HelloWorldIntent',
});


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'ON_SIGN_IN': function() {
        this.tell('signed in: ' + app.googleAction().getSignInStatus());
    },

    'LAUNCH': function() {
        // this.showAccountLinkingCard();
        // this.googleAction().showAccountLinkingCard();
        // this.addSessionAttribute('bla', 'blub');
        // this.tell('sdsd');
        // this.toIntent('AccountLinkingIntent');
        this.toIntent('ListIntent');
        // this.toIntent('BasicCardIntent');
    },
    'AccountLinkingIntent': function() {
        this.showAccountLinkingCard();
    },
    'BasicCardIntent': function() {
        let basicCard = new BasicCard()
            .setTitle('Title')
            .setImage('http://via.placeholder.com/450x350?text=Basic+Card', 'accessibilityText')
            .setFormattedText('Formatted Text')
            .setImageDisplay('WHITE');

        this.googleAction().showBasicCard(basicCard);
        this.googleAction().showSuggestionChips(['List', 'Carousel', 'Basic card', 'Table']);
        this.ask('Response with basic card', '?');
    },
    'TableIntent': function() {
        let table = new Table()
            .setTitle('Table Title')
            .setImage('http://via.placeholder.com/250x250?text=Table', 'accessibilityText')
            .addColumn('header 1','CENTER')
            .addColumn('header 2','LEADING')
            .addColumn('header 3','TRAILING')
            .addRow(['row 1 item 1', 'row 1 item 2', 'row 1 item 3'], false)
            .addRow(['row 2 item 1', 'row 2 item 2', 'row 2 item 3'], true)
            .addRow(['row 3 item 3', 'row 3 item 2', 'row 3 item 3'])
            .addButton("Button Title", "https://github.com/jovotech/jovo-framework-nodejs")

        this.googleAction().showTable(table);
        this.googleAction().showSuggestionChips(['List', 'Carousel', 'Basic card', 'Table']);
        this.ask('Response with table', '?');
    },
    'SuggestionsIntent': function() {
        // must end with an ask response
        this.googleAction().showSuggestionChips(['List', 'Carousel', 'Basic card', 'Table']);
        this.googleAction().showLinkOutSuggestion('Name', 'http://www.example.com');
        this.ask('Suggestion Chips Example', 'Suggestion Chips Example');
    },
    'ListIntent': function() {
        let list = new List();
        list.setTitle('Simple selectable List');

        list.addItem(
            (new OptionItem())
                .setTitle('Show a BasicCard')
                .setDescription('BasicCard')
                .setImage('http://via.placeholder.com/450x350?text=List+item+1', 'accessibilityText')
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
        this.ask('Choose from list', 'Choose from list');
    },
    'CarouselIntent': function() {
        let carousel = new Carousel();

        carousel.addItem(
            (new OptionItem())
                .setTitle('Show a BasicCard')
                .setDescription('BasicCard')
                .setImage('http://via.placeholder.com/650x350?text=Carousel+item+1', 'accessibilityText')
                .setKey('Carouselitem1key')
        );
        carousel.addItem(
            (new OptionItem())
                .setTitle('Show a List')
                .setDescription('Description2')
                .setImage('http://via.placeholder.com/650x350?text=Carousel+item+2', 'accessibilityText')
                .setKey('Carouselitem2key')
        );
        this.googleAction().showCarousel(carousel);
        this.googleAction().showSuggestionChips(['List', 'Carousel', 'Basic card', 'Table']);

        this.ask('Choose from list', 'Choose from list');
    },
    'HelloWorldIntent': function() {
        this.tell('Hello World');
    },
    'ON_ELEMENT_SELECTED': function() {
        let selectedElement = this.getSelectedElementId();
        console.log('ON_ELEMENT_SELECTED');
        console.log(selectedElement);
        if (selectedElement === 'Listitem1key') {
            this.toIntent('BasicCardIntent');
        } else if (selectedElement === 'Listitem2key') {
            this.toIntent('CarouselIntent');
        } else if (selectedElement === 'Listitem3key') {
            this.toIntent('TableIntent');
        } else if (selectedElement === 'Carouselitem1key') {
            this.toIntent('BasicCardIntent');
        } else if (selectedElement === 'Carouselitem2key') {
            this.toIntent('ListIntent');
        } else {
            this.tell(this.getSelectedElementId());
        }
    },
});

module.exports.app = app;
