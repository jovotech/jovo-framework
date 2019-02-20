const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const app = new App();

app.use(
    new Alexa()
);


app.setHandler({
    async LAUNCH() {
        if (this.$request.hasGeoLocationInterface()) {

            if (this.$request.isGeoLocationPermissionDenied()) {
                this.toIntent('AskForPermission');
            } else if (this.$request.isGeoLocationPermissionGranted()) {
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
        console.log(this.$request.getGeoLocationObject());
        console.log(`timestamp: ${this.$request.getGeoLocationTimestamp()}`);
        console.log('Location Services:');
        console.log(this.$request.getLocationServicesObject());
        console.log(this.$request.getLocationServicesAccess());
        console.log(this.$request.getLocationServicesStatus());
        console.log('Coordinate: ');
        console.log(this.$request.getCoordinateObject());
        console.log(this.$request.getCoordinateLatitude());
        console.log(this.$request.getCoordinateLongitude());
        console.log(this.$request.getCoordinateAccuracy());
        console.log('Altitude: ');
        console.log(this.$request.getAltitudeObject());
        console.log(this.$request.getAltitude());
        console.log(this.$request.getAltitudeAccuracy());
        console.log(`Heading:`);
        console.log(this.$request.getHeadingObject());
        console.log(this.$request.getHeadingDirection());
        console.log(this.$request.getHeadingAccuracy());
        console.log(`Speed:`)
        console.log(this.$request.getSpeedObject());
        console.log(this.$request.getSpeed());
        console.log(this.$request.getSpeedAccuracy());

        this.tell('Check the console for the geolocation data');
    }
});


module.exports.app = app;
