'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');

const app = new App();

app.use(
    new Alexa()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    async LAUNCH() {
        // set expiryTime 23 hours ahead of the current timestamp
        let expiryTime = new Date(this.$request.getTimestamp());
        expiryTime.setHours(expiryTime.getHours() + 23);
        expiryTime = expiryTime.toISOString();

        const proactiveEvent = {
            timestamp: this.$request.getTimestamp(),
            referenceId: 'test-0001',
            expiryTime: expiryTime,
            event: {
                "name": "AMAZON.WeatherAlert.Activated",
                "payload": {
                    "weatherAlert": {
                        "source": "localizedattribute:source",
                        "alertType": "TORNADO"
                    }
                }
            },
            localizedAttributes: [
                {
                    locale: 'en-US',
                    source: 'Source Test'
                }
            ],
            relevantAudience: {
                type: 'Multicast',
                payload: {}
            }
        }
        const accessToken = await this.$alexaSkill.$proactiveEvent.getAccessToken(
            '<client-id>',
            '<client-secret>'
        );
        const live = true; // Use the live api endpoint
        const result = await this.$alexaSkill.$proactiveEvent.sendProactiveEvent(proactiveEvent, accessToken, live);
        this.tell('Event was sent');
    }
});