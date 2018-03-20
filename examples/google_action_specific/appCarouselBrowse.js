'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');
const CarouselBrowse = require('../../index').GoogleAction.CarouselBrowse;
const CarouselBrowseTile = require('../../index').GoogleAction.CarouselBrowseTile;


const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        // this.toIntent('WeblinksIntent');
        this.toIntent('AmpIntent');
    },

    'WeblinksIntent': function() {
        let carousel = new CarouselBrowse();

        carousel.addItem(
            (new CarouselBrowseTile())
                .setTitle('Title 1')
                .setDescription('Description 1')
                .setFooter('footer 1')
                .setOpenUrlAction({
                    url: 'https://www.jovo.tech',
                })
                .setImage('http://via.placeholder.com/650x350?text=Carousel+item+1', 'accessibilityText')
        );
        carousel.addItem(
            (new CarouselBrowseTile())
                .setTitle('Title 1')
                .setDescription('Description 1')
                .setFooter('footer 1')
                .setOpenUrlAction({
                    url: 'https://www.jovo.tech',
                })
                .setImage('http://via.placeholder.com/650x350?text=Carousel+item+2', 'accessibilityText')
        );
        this.googleAction().showCarouselBrowse(carousel);
        this.googleAction().showSuggestionChips(['chip1', 'chip2']);

        this.ask('Click on the link', 'Click on the link');
    },

    'AmpIntent': function() {
        let carousel = new CarouselBrowse();
        carousel.addItem(
            (new CarouselBrowseTile())
                .setTitle('Title 1')
                .setDescription('Description 1')
                .setFooter('footer 1')
                .setOpenUrlAction({
                    url: 'https://url.to.amp.page.com',
                    urlTypeHint: 'AMP_CONTENT',
                })
                .setImage('http://via.placeholder.com/650x350?text=Carousel+item+1', 'accessibilityText')
        );
        carousel.addItem(
            (new CarouselBrowseTile())
                .setTitle('Title 2')
                .setDescription('Description 2')
                .setFooter('footer 2')
                .setOpenUrlAction({
                    url: 'https://url.to.amp.page.com',
                    urlTypeHint: 'AMP_CONTENT',
                })
                .setImage('http://via.placeholder.com/650x350?text=Carousel+item+2', 'accessibilityText')
        );
        this.googleAction().showCarouselBrowse(carousel);
        this.googleAction().showSuggestionChips(['chip1', 'chip2']);

        this.ask('Click on the link', 'Click on the link');
    },
});

module.exports.app = app;

// quick testing
// node index.js appHelloWorld.js --launch
// node index.js appHelloWorld.js --intent MyNameIsIntent --parameter name=Alex

