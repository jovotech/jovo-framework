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
        this.alexaSkill().showVideo('https://www.url.to/video.mp4', 'Any Title', 'Any Subtitle');
    },
});

module.exports.app = app;

