# Analytics

Jovo offers easy analytics integrations and enhancements for Dashbot, Bespoken, Chatbase, and Botanalytics.

* [Jovo Analytics Interface](#jovo-analytics-interface)
* [Available Integrations](#available-integrations)


## Jovo Analytics Interface

Jovo offers an abstraction layer for analytics integrations that allows you to add multiple analytics providers.

Analytics for your voice app can be added in your `config.js` file like this:

```javascript
// @language=javascript

// src/config.js

module.exports = {
    
    analytics: {
        ServiceName: {
            // Add configuration
        },
    },

    // ...

};

// @language=typescript

// src/config.ts

const config = {
    
    analytics: {
        ServiceName: {
            // Add configuration
        },
    },

    // ...

};
```

More detailed step-by-step guides for each service can be found in the [Available Integrations](#available-integrations) section.



## Available Integrations

Name | Description
------------ | -------------
[Dashbot](./dashbot.md './analytics/dashbot') | Conversational Analytics
[Bespoken](./bespoken.md './analytics/bespoken') | Voice App Logging and Monitoring
[Chatbase](./chatbase.md './analytics/chatbase') | Virtual Agent Analytics
[Botanalytics](./botanalytics.md './analytics/botanalytics') | Conversational Analytics
[VoiceHero](./voicehero.md './analytics/voicehero') | Custom Voice App Analytics



<!--[metadata]: {"description": "Analytics for Alexa Skills and Google Actions with Jovo Integrations",
"route": "analytics" }-->
