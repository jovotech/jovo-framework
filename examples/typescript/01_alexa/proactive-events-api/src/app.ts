
import { App } from 'jovo-framework';
import {Alexa, ProactiveEventObject} from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';


const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);



app.setHandler({
    async LAUNCH() {
        // set expiryTime 23 hours ahead of the current timestamp
        const expiryTime = new Date(this.$request!.getTimestamp());
        expiryTime.setHours(expiryTime.getHours() + 23);

        const proactiveEvent: ProactiveEventObject = {
            timestamp: this.$request!.getTimestamp(),
            referenceId: 'test-0001',
            expiryTime: expiryTime.toISOString(),
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
            }
        };
        const accessToken = await this.$alexaSkill!.$proactiveEvent!.getAccessToken(
            '<client-id>',
            '<client-secret>'
        );
        const live = true; // Use the live api endpoint
        const result = await this.$alexaSkill!.$proactiveEvent!.sendProactiveEvent(proactiveEvent, accessToken, live);
        this.tell('Event was sent');
    }
});


export {app};
