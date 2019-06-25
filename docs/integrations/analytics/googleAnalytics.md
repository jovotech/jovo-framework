# Google Analytics

Learn how to use Google Analytics for your Alexa Skills and Google Actions built with Jovo.

* [About Google Analytics](#about-google-analytics)
* [Installation](#installation)
   * [Create a Google Analytics Account](#create-a-google-analytics-account)
   * [Enable Google Analytics](#enable-google-analytics)
   * [Test Google Analytics](#test-google-analytics)
* [Usage](#usage)
   * [Concept] (#concept)
   * []
   


## About Google Analytics

![Google Website](../../img/ga00_banner.png)

[Google Analytics](https://analytics.google.com/analytics/web/) lets you measure your advertising ROI as well as track your Flash, video, and social networking sites and applications.

With the Google Analytics integration for Jovo, you can track the behavior of you voice app and get insights about your users. It offers standard tracking which will start immediately after activating and developer methods for sending events and transactions from your voice app. Even thought you won't have to mess with creating users and adding appropriate data the plugin offers the possibility to adjust and overwrite implemented tracking and helper methods (for example if you want to adjust the algorithm which generates the userId). 

## Installation

To use Google Analytics for your voice app, you need to complete the following steps:

1. Create a Google Analytics account
2. Enable Google Analytics in your Jovo voice app
3. Test your app

### Create a Google Analytics Account

1. Login to Google Analytics with a google account at https://marketingplatform.google.com/intl/de/about/analytics/.

2. Click Start for free:

![Google Analytics Landing Page](../../img/ga0_landingPage.png)

3. Click sign up
![Google Analytics sign up](../../img/ga1_signUp.png)

4. Fill the form like you want. Stay with "Website" and choose a random string for the URL. The plugin will do the tracking on its own. Finish by clicking "get tracking id". 
![Google Analytics set up account](../../img/ga2_newAccount.png)

5. After confirming the terms of service you will arrive at the admin section of your Google Analytics Tracking Website. Copy the trackingId which you will need it to connect your voice app.
![Google Analytics save trackingId](../../img/ga3_adminTrackingId.png)



### Enable Google Analytics

To add Google Analytics to your voice app, do the following:

* Download the npm package
* Enable the plugin in `app.js`
* Add configurations in `config.js`

First, download the npm package:

```sh
$ npm install --save jovo-analytics-bespoken	//todo: change npm
```

Enable the plugin like this:

```javascript
// @language=javascript

// src/app.js

const { GoogleAnalyticsAlexa, GoogleAnalyticsAssistant } = require('jovo-analytics-bespoken'); //todo: change require

app.use(
    new GoogleAnalyticsAlexa(),
    new GoogleAnalyticsAssistant()

// @language=typescript

// src/app.ts

import { GoogleAnalyticsAlexa, GoogleAnalyticsAssistant } from 'jovo-analytics-bespoken'; //todo

app.use(
    new GoogleAnalyticsAlexa(),
    new GoogleAnalyticsAssistant()
);
```

Add configurations like this:

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    analytics: {
        GoogleAnalyticsAlexa: {
            trackingId: '<key>',
        },
        GoogleAnalyticsAssistant: {
            trackingId: '<key>',
        },
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    analytics: {
        GoogleAnalyticsAlexa: {
            trackingId: '<key>',
        },
        GoogleAnalyticsAssistant: {
            trackingId: '<key>',
        },
    },

    // ...

};
```

### Test Google Analytics

Test your voice app, after a bit your session should appear in your tracking website.

##Usage
Google Analytics for Jovo is designed to tie tracking data to users and intents (without having the developer to mess with it). It separates into the parts:
1. Automatic intent tracking
2. User methods
3. Customize standard behavior

#### 1. Automatic intent tracking
After the plugin is enabled it automatically tracks intents by sending pageviews to google analytics. To see intent metrics navigate to "Behavior" -> "Overview" in your google analytics web pannel. After some time the "Behaviour Flow" will show intent paths users take within your skill.
Google Analytics for Jovo enhances all sent data with the information shown in the scheme bellow. It will be explained in the section underneath.

![AutoTrackingFlow](../../img/ga4_Processing_autoDataOnly.png) 

##### User Id
The userID is a hash generated from the according platform response. Be carefull when using Google Assistant because the userId will change sometimes if account linking is not activated. 

##### Source
You can use the "data source" to split users into segments from Amazon Alexa and Google Assistant. The following grafic shows some test traffic for the "Audience Overview".
            ![AudienceOverview](../../img/ga5_AudienceSegmentExample.png)

Segment templates can be added by clicking at [AlexaSegmentTemplate](https://analytics.google.com/analytics/web/template?uid=cnQV_g8eR5Of0eQngb2A7g) and [GoogleAssistantTemplate](https://analytics.google.com/analytics/web/template?uid=Wvd3HYvyQDKFfXClkrXCAw). Withing the opened dialog you can add them to any Google Analytics view you like. 
Afterwards you can click at the "AllUsers" segment in any report and activate them via the checkboxes. The grafic bellow highlights both points via red rectangles. Click the third rectangle "actions" to adjust them (for example by adding additional behaviour filters).
![SegmentActivation](../../img/ga7_segmentSelection.png)

##### Device & ScreenResolution
Device Info can be found in "Audience" -> "Technology" -> "Browser&OS". The browser field will display recognized device types. Within this report you have the possibility to switch to screen resolution.
![DeviceInfo](../../img/ga6_DeviceInfo.png)





<!--[metadata]: {"description": "Add Bespoken Analytics to your Alexa Skills and Google Actions with Jovo",
"route": "analytics/bespoken" }-->
