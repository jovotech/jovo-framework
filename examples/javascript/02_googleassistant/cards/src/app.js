const {App} = require('jovo-framework');
const {
    GoogleAssistant,
    BasicCard,
    Carousel,
    List,
    OptionItem,
    CarouselBrowse,
    CarouselItem,
    CarouselBrowseTile,
    Table
} = require('jovo-platform-googleassistant');


const app = new App();

app.use(
    new GoogleAssistant()
);


app.setHandler({
    LAUNCH() {
        // return this.toIntent('BasicCardIntent');
        // return this.toIntent('TableIntent');
        // return this.toIntent('SuggestionsIntent');
        return this.toIntent('ListIntent');
        // return this.toIntent('CarouselIntent');
        // return this.toIntent('CarouselBrowseWeblinksIntent');
        // return this.toIntent('CarouselBrowseAmpIntent');
    },
    BasicCardIntent() {
        const basicCard = new BasicCard()
            .setTitle('Title')
            .setImage({
                url: 'http://via.placeholder.com/450x350?text=Basic+Card',
                accessibilityText: 'accessibilityText'})
            .setFormattedText('Formatted Text')
            .setImageDisplay('WHITE');

        this.$googleAction.showBasicCard(basicCard);
        this.$googleAction.showSuggestionChips(['List', 'Carousel', 'Basic card', 'Table']);

        this.ask('Response with basic card', '?');
    },
    TableIntent() {
        const table = new Table()
            .setTitle('Table Title')
            .setImage({
                    url: 'http://via.placeholder.com/250x250?text=Table',
                    accessibilityText: 'accessibilityText'
                })
            .addColumn('header 1','CENTER')
            .addColumn('header 2','LEADING')
            .addColumn('header 3','TRAILING')
            .addRow(['row 1 item 1', 'row 1 item 2', 'row 1 item 3'], false)
            .addRow(['row 2 item 1', 'row 2 item 2', 'row 2 item 3'], true)
            .addRow(['row 3 item 3', 'row 3 item 2', 'row 3 item 3'])
            .addButton('Button Title', 'https://github.com/jovotech/jovo-framework-nodejs')

        this.$googleAction.showTable(table);
        this.$googleAction.showSuggestionChips(['List', 'Carousel', 'Basic card', 'Table']);
        this.ask('Response with table', '?');
    },
    SuggestionsIntent() {
        // must end with an ask response
        this.$googleAction.showSuggestionChips(['List', 'Carousel', 'Basic card', 'Table']);
        this.$googleAction.showLinkOutSuggestion('Name', 'http://www.example.com');
        this.ask('Suggestion Chips Example', 'Suggestion Chips Example');
    },
    ListIntent() {
        const list = new List();
        list.setTitle('Simple selectable List');

        list.addItem(
            (new OptionItem())
                .setTitle('Show a BasicCard')
                .setDescription('BasicCard')
                .setImage({
                    url: 'http://via.placeholder.com/450x350?text=Basic+Card',
                    accessibilityText: 'accessibilityText'})
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
        this.$googleAction.showList(list);
        this.$googleAction.showSuggestionChips(['List', 'Carousel', 'Basic card', 'Table']);
        this.ask('Choose from list', 'Choose from list');
    },
    CarouselIntent() {
        let carousel = new Carousel();

        carousel.addItem(
            (new OptionItem())
                .setTitle('Show a BasicCard')
                .setDescription('BasicCard')
                .setImage({
                    url: 'http://via.placeholder.com/450x350?text=Basic+Card',
                    accessibilityText: 'accessibilityText'})
                .setKey('Carouselitem1key')
        );
        carousel.addItem(
            (new OptionItem())
                .setTitle('Show a List')
                .setDescription('Description2')
                .setImage({
                    url: 'http://via.placeholder.com/450x350?text=Basic+Card',
                    accessibilityText: 'accessibilityText'})
                .setKey('Carouselitem2key')
        );
        this.$googleAction.showCarousel(carousel);
        this.$googleAction.showSuggestionChips(['List', 'Carousel', 'Basic card', 'Table']);

        this.ask('Choose from list', 'Choose from list');
    },
    CarouselBrowseWeblinksIntent() {
        let carousel = new CarouselBrowse();

        carousel.addItem(
            (new CarouselBrowseTile())
                .setTitle('Title 1')
                .setDescription('Description 1')
                .setFooter('footer 1')
                .setOpenUrlAction({
                    url: 'https://www.jovo.tech',
                })
                .setImage({
                    url: 'http://via.placeholder.com/450x350?text=Basic+Card',
                    accessibilityText: 'accessibilityText'})
        );
        carousel.addItem(
            (new CarouselBrowseTile())
                .setTitle('Title 1')
                .setDescription('Description 1')
                .setFooter('footer 1')
                .setOpenUrlAction({
                    url: 'https://www.jovo.tech',
                })
                .setImage({
                    url: 'http://via.placeholder.com/450x350?text=Basic+Card',
                    accessibilityText: 'accessibilityText'})
        );
        this.$googleAction.showCarouselBrowse(carousel);
        this.$googleAction.showSuggestionChips(['chip1', 'chip2']);

        this.ask('Click on the link', 'Click on the link');
    },
    CarouselBrowseAmpIntent() {
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
                .setImage({
                    url: 'http://via.placeholder.com/450x350?text=Basic+Card',
                    accessibilityText: 'accessibilityText'})
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
                .setImage({
                    url: 'http://via.placeholder.com/450x350?text=Basic+Card',
                    accessibilityText: 'accessibilityText'})
        );
        this.$googleAction.showCarouselBrowse(carousel);
        this.$googleAction.showSuggestionChips(['chip1', 'chip2']);

        this.ask('Click on the link', 'Click on the link');
    },

    ON_ELEMENT_SELECTED() {
        this.tell(this.getSelectedElementId() + ' selected');
    },

});


module.exports.app = app;
