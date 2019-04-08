
import { App } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';
import * as moment from 'moment-timezone';


const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger(),
    new FileDb(),
);





app.setHandler({
    async LAUNCH() {
        // return this.toIntent('GetTimezoneIntent');
        // return this.toIntent('GetLocalTimeIntent');
        // return this.toIntent('GetDistanceUnitIntent');
        return this.toIntent('GetTemperatureUnitIntent');
    },
    async GetTimezoneIntent() {
        try {
            const timezone = await this.$alexaSkill!.$user.getTimezone();
            return this.tell(`Your timezone is ${timezone}`);
        } catch(error) {

        }
    },
    async GetLocalTimeIntent() {
        try {
            const timezone = await this.$alexaSkill!.$user.getTimezone();

            const now = moment.utc();
            const localTime = now.tz(timezone).format('ddd, MMM D, YYYY [at] h:mma');

            return this.tell(`Your local time is ${localTime}`);
        } catch(error) {

        }
    },
    async GetDistanceUnitIntent() {
        try {
            // doesn't work with the simulator
            const distanceUnit = await this.$alexaSkill!.$user.getDistanceUnit();
            this.tell(`Your distance measurement unit is ${distanceUnit}`);
        } catch(error) {

        }

    },
    async GetTemperatureUnitIntent() {
        try {
            // doesn't work with the simulator
            const temperatureUnit = await this.$alexaSkill!.$user.getTemperatureUnit();
            this.tell(`Your temperature unit is ${temperatureUnit}`);
        } catch(error) {

        }

    },

});



export {app};
