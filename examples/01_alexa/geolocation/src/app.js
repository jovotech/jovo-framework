const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const app = new App();

app.use(
    new Alexa()
);


app.setHandler({
    async LAUNCH() {
        if (this.$alexaSkill.hasGeoLocationInterface()) {

            if (this.$alexaSkill.isGeoLocationPermissionDenied()) {
                this.toIntent('AskForPermission');
            } else if (this.$alexaSkill.isGeoLocationPermissionGranted()) {
                this.toIntent('GetGeoLocationData');
            }
        } else {
            this.tell('Device does not support Geolocation Interface');
        }
    },
    async AskForPermission() {
        this.$alexaSkill.showAskForGeoLocationCard();
    },
    async GetGeoLocationData() {
        console.log('Geolocation:');
        console.log(this.$alexaSkill.getGeoLocationObject());
        console.log(`timestamp ${this.$alexaSkill.getGeoLocationTimestamp()}`);
        console.log('Location Services:');
        console.log(this.$alexaSkill.getLocationServicesObject());
        console.log(this.$alexaSkill.getLocationServicesAccess());
        console.log(this.$alexaSkill.getLocationServicesStatus());
        console.log('Coordinate: ');
        console.log(this.$alexaSkill.getCoordinateObject());
        console.log(this.$alexaSkill.getCoordinateLatitude());
        console.log(this.$alexaSkill.getCoordinateLongitude());
        console.log(this.$alexaSkill.getCoordinateAccuracy());
        console.log('Altitude: ');
        console.log(this.$alexaSkill.getAltitudeObject());
        console.log(this.$alexaSkill.getAltitude());
        console.log(this.$alexaSkill.getAltitudeAccuracy());
        console.log(`Heading:`);
        console.log(this.$alexaSkill.getHeadingObject());
        console.log(this.$alexaSkill.getHeadingDirection());
        console.log(this.$alexaSkill.getHeadingAccuracy());
        console.log(`Speed:`)
        console.log(this.$alexaSkill.getSpeedObject());
        console.log(this.$alexaSkill.getSpeed());
        console.log(this.$alexaSkill.getSpeedAccuracy());

        this.tell('Check the console for the geolocation data');
    }
});


module.exports.app = app;
