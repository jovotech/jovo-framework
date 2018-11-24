# [Integrations](../) > Analytics

Jovo offers easy analytics integrations and enhancements for Dashbot, Bespoken, Chatbase, and Botanalytics.

* [Jovo Analytics Layer](#jovo-analytics-layer)
   * [Add Analytics Integrations](#add-analytics-integrations)
   * [Turn Analytics On and Off](#turn-analytics-on-and-off)
   * [Skip Intents](#skip-intents)
   * [Skip Users](#skip-users)
* [Dashbot](#dashbot)
* [Bespoken](#bespoken)
* [Chatbase](#chatbase)
* [Botanalytics](#botanalytics)


## Jovo Analytics Layer

Jovo offers an abstraction layer for analytics integrations that allows you to add multiple analytics providers, and even to use additional features, like skipping certain intents or users that you don't want to track.


### Add Analytics Integrations

Analytics for your voice app can be added with one line of code for each analytics vendor and voice platform.

```javascript
// Jovo app config
const config = {
    /**
     * Other settings
     */
    analytics: {
        services: {
            // Add services here
        },
    },
};
```

You can also use a dedicated method for each analytics vendor and platform:
```javascript

// Dashbot integration
app.addDashbotAlexa(key);
app.addDashbotGoogleAction(key);

// Bespoken integration
app.addBespokenAnalytics(key);

// Bespoken integration
app.addChatbaseAnalytics(key);

// Botanalytics integration
app.addBotanalyticsAlexa(key);
app.addBotanalyticsGoogleAction(key);
```

More detailed step-by-step guides can be found here:

* [Dashbot](#dashbot)
* [Bespoken](#bespoken)
* [Chatbase](#chatbase)
* [Botanalytics](#botanalytics)

The Jovo Analytics class offers several enhancements to the vendor tracking. Learn more in the following sections:

* [Turn Analytics On and Off](#turn-analytics-on-and-off)
* [Skip Intents](#skip-intents)
* [Skip Users](#skip-users)

### Turn Analytics On and Off

After adding analytics to your voice app, tracking is enabled by default. You can disable it with the following method:

```javascript
app.analytics().disable();
```

Also, you can enable analytics with this method:

```javascript
app.analytics().enable();
```

### Skip Intents

You can disable tracking for specific intents by adding them as an array like this:

```javascript
app.analytics().skipIntents(intents);
```

### Skip Users

```javascript
app.analytics().skipUsers(userIds);
```

## Dashbot

[![Dashbot Website](../../img/dashbot-home.jpg)](./dashbot.md './analytics/dashbot')

[Learn more about the Jovo Dashbot integration here.](./dashbot.md './analytics/dashbot')


## Bespoken

[![Bespoken Website](../../img/bespoken-home.jpg)](./bespoken.md './analytics/bespoken')

[Learn more about the Jovo Bespoken integration here.](./bespoken.md './analytics/bespoken')

## Chatbase

[![Chatbase Website](../../img/chatbase-home.jpg)](./chatbase.md './analytics/chatbase')

[Learn more about the Jovo Chatbase integration here.](./chatbase.md './analytics/chatbase')

## Botanalytics

[![Botanalytics Website](../../img/botanalytics-home.jpg)](./botanalytics.md './analytics/botanalytics')

[Learn more about the Jovo Botanalytics integration here.](./botanalytics.md './analytics/botanalytics')


<!--[metadata]: {"title": "Analytics Integrations", "description": "Analytics for Alexa Skills and Google Actions with Jovo Integrations", "activeSections": ["integrations", "analytics"], "expandedSections": "integrations", "inSections": "integrations", "breadCrumbs": {"Docs": "docs/", "Integrations": "docs/integrations", "Analytics": "" }, "commentsID": "framework/docs/analytics",
"route": "docs/analytics" }-->
