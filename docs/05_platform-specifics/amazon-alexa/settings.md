# Settings API

Learn more about how to obtain your user's settings information.

* [Introduction](#introduction)
* [Time Zone](#time-zone)
* [Distance Measurement Unit](#distance-measurement-unit)
* [Temperature Measurement Unit](#temperature-measurement-unit)

## Introduction

The Alexa Settings API allows you to access the time zone, distance measurement unit and temperature measurement unit of your user.

## Time Zone

```javascript
this.user().getTimezone().then((timezone) => {
    this.tell(`Your timezone is ${timezone}`);
}).catch((error) => {
    console.log(error);
});
```

## Distance Measurement Unit

```javascript
this.user().getDistanceUnit().then((distanceUnit) => {
    this.tell(`Your distance measurement unit is ${distanceUnit}`);
}).catch((error) => {
    console.log(error);
});
```

## Temperature Measurement Unit

```javascript
this.user().getTemperatureUnit().then((temperatureUnit) => {
    this.tell(`Your temperature measurement unit is ${distanceUnit}`);
}).catch((error) => {
    console.log(error);
});
```


<!--[metadata]: {"description": "Learn how to get your user's settings information."
"route": "amazon-alexa/settings" }-->