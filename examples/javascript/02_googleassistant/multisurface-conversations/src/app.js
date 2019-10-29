'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { GoogleAssistant, NotificationPlugin } = require('jovo-platform-googleassistant');

const app = new App();

const googleAssistant = new GoogleAssistant();

app.use(
    googleAssistant
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    async LAUNCH() {

        const availableSurfaces = this.$googleAction.getAvailableSurfaces();

        if (availableSurfaces.includes('actions.capability.SCREEN_OUTPUT')) {
            this.$googleAction.newSurface(
                ['actions.capability.SCREEN_OUTPUT'],
                'Let\'s move you to a screen device for cards and other visual responses',
                'Title')
        }
    },

    ON_NEW_SURFACE() {

        if (this.$googleAction.isNewSurfaceConfirmed()) {
            this.tell('Hello Smartphone');
        } else {
            this.tell('Hello Speaker');
        }
    }

});

module.exports.app = app;
