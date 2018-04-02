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
    'LAUNCH': function() {
        // keep session open
        this.googleAction().audioPlayer().play('https://www.url.to/file.mp3', 'song one');
        this.googleAction().showSuggestionChips([' Chip1'])
        this.ask('This is my song');

        // close session
        // this.googleAction().audioPlayer().play('https://song.url.com/song1.mp3', 'song one');
        // this.tell('This is my song');
    },
    'AUDIOPLAYER': {
        'GoogleAction.Finished': function() { // is called when session is still active
            this.googleAction().audioPlayer().play('https://www.url.to/file.mp3', 'song one');
            this.googleAction().showSuggestionChips([' Chip1'])
            this.tell('One more time');
        },
    },
});

module.exports.app = app;
