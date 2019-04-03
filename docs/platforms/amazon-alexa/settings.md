# Settings API

Learn more about how to obtain your user's settings information.

* [Introduction](#introduction)
* [Time Zone](#time-zone)
* [Distance Measurement Unit](#distance-measurement-unit)
* [Temperature Measurement Unit](#temperature-measurement-unit)

## Introduction

The Alexa Settings API allows you to access the time zone, distance measurement unit and temperature measurement unit of your user.

## Time Zone

Here is an example how you can get the user's timezone in a `GetTimezoneIntent`:

```javascript
// @language=javascript

await this.$alexaSkill.$user.getTimezone()

// Example
async GetTimezoneIntent() {
    try {
        const timezone = await this.$alexaSkill.$user.getTimezone();
        return this.tell(`Your timezone is ${timezone}`);
    } catch(error) {
        // Do something
    }
},

// @language=typescript

await this.$alexaSkill!.$user.getTimezone()

// Example
async GetTimezoneIntent() {
    try {
        const timezone = await this.$alexaSkill!.$user.getTimezone();
        return this.tell(`Your timezone is ${timezone}`);
    } catch(error: Error) {
        // Do something
    }
},
```

You can use this information to get the local time of the user. For example, you can use the [moment-timezone](https://momentjs.com/timezone/) package:

```javascript
// @language=javascript

// Initialization
const moment = require('moment-timezone');

// Inside Handler
async GetLocalTimeIntent() {
    try {
        const timezone = await this.$alexaSkill.$user.getTimezone();

        const now = moment.utc();
        const localTime = now.tz(timezone).format('ddd, MMM D, YYYY [at] h:mma');

        return this.tell(`Your local time is ${localTime}`);
    } catch(error) {
        // Do something
    }
},

// @language=typescript

// Initialization
const moment = require('moment-timezone');

// Inside Handler
async GetLocalTimeIntent() {
    try {
        const timezone = await this.$alexaSkill!.$user.getTimezone();

        const now = moment.utc();
        const localTime = now.tz(timezone).format('ddd, MMM D, YYYY [at] h:mma');

        return this.tell(`Your local time is ${localTime}`);
    } catch(error: Error) {
        // Do something
    }
},
```

## Distance Measurement Unit

Here is an example how you can get the user's distance measurement unit in a `GetDistanceUnitIntent`:

```javascript
// @language=javascript

await this.$alexaSkill.$user.getDistanceUnit()

// Example
async GetDistanceUnitIntent() {
    try {
        const distanceUnit = await this.$alexaSkill.$user.getDistanceUnit();
        this.tell(`Your distance measurement unit is ${distanceUnit}`);
    } catch(error) {
        // Do something
    }
},

// @language=typescript

await this.$alexaSkill!.$user.getDistanceUnit()

// Example
async GetDistanceUnitIntent() {
    try {
        const distanceUnit = await this.$alexaSkill!.$user.getDistanceUnit();
        this.tell(`Your distance measurement unit is ${distanceUnit}`);
    } catch(error: Error) {
        // Do something
    }
},
```

## Temperature Measurement Unit

Here is an example how you can get the user's temperature measurement unit in a `GetDistanceUnitIntent`:

```javascript
// @language=javascript

await this.$alexaSkill.$user.getTemperatureUnit()

// Example
async GetTemperatureUnitIntent() {
    try {
        const temperatureUnit = await this.$alexaSkill.$user.getTemperatureUnit();
        this.tell(`Your temperature unit is ${temperatureUnit}`);
    } catch(error) {
        // Do something
    }
},

// @language=typescript

await this.$alexaSkill!.$user.getTemperatureUnit()

// Example
async GetTemperatureUnitIntent() {
    try {
        const temperatureUnit = await this.$alexaSkill!.$user.getTemperatureUnit();
        this.tell(`Your temperature unit is ${temperatureUnit}`);
    } catch(error: Error) {
        // Do something
    }
},
```


<!--[metadata]: {"description": "Learn how to get your user's settings information.",
"route": "amazon-alexa/settings" }-->
