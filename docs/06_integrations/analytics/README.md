# [Integrations](../) > Analytics

Jovo offers easy analytics integrations and enhancements for VoiceLabs, Dashbot, and Bespoken.

* [Jovo Analytics Layer](#jovo-analytics-layer)
* [VoiceLabs](#voicelabs)
* [Dashbot](#dashbot)
* [Bespoken](#bespoken)


## Jovo Analytics Layer


### Add Analytics Integrations

Analytics for your voice app can be added with one line of code for each analytics vendor and voice platform.

```javascript
// VoiceLabs integration
app.addVoiceLabsAlexa(key);
app.addVoiceLabsGoogleAction(key);
​
// Dashbot integration
app.addDashbotAlexa(key);
app.addDashbotGoogleAction(key);

// Bespoken integration
app.addBespokenAnalytics(key);
```

More detailed step-by-step guides can be found here: 

* [VoiceLabs](#voicelabs)
* [Dashbot](#dashbot)
* [Bespoken](#bespoken)

The Jovo Analytics class offers several enhancements to the vendor tracking, which can be found in the following sections.

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

## VoiceLabs

To use VoiceLabs Insights for your voice app analytics, you need to complete the following steps:

1. Create a VoiceLabs Application
2. Enable VoiceLabs Anaytics in your voice app
3. Download the voicelabs npm package
4. Test your app

### Create A VoiceLabs Application

1. Create a VoiceLabs account or log in at https://insights.voicelabs.co/login

2. Create a new application

![Create VoiceLabs Application](https://www.jovo.tech/img/docs/voicelabs-new-application.jpg)

3. Select the platform you want to use (if you are developing for both Amazon Alexa and Google Assistant, please create 2 distinct applications)

![VoiceLabs Select Platform](https://www.jovo.tech/img/docs/voicelabs-select-platform.jpg)

4. Copy API Key

![VoiceLabs Copy API Key](https://www.jovo.tech/img/docs/voicelabs-api-key.jpg)


### Enable VoiceLabs Analytics

VoiceLabs Analytics can be added to your voice app with the following commands:

```javascript
// For VoiceLabs Alexa Application
app.addVoiceLabsAlexa(key);
​
// For VoiceLabs Google Assistant Application
app.addVoiceLabsGoogleAction(key);
```

### Download the VoiceLabs Package

In your terminal, use the following command to download the package via npm:

```
# For Alexa Skills
$ npm install voicelabs
​
# For Google Actions
$ npm install voicelabs-assistant-sdk
```

### Test

Test your voice app, after a bit your session should appear:

![VoiceLabs Test](https://www.jovo.tech/img/docs/voicelabs-test.jpg)


## Dashbot

To use Dashbot Analytics for your voice app, you need to complete the following steps:

1. Create a Dashbot Bot
2. Enable Dashbot Anaytics in your voice app
3. Download the dashbot npm package
4. Test your app

### Create a Dashbot Bot

1. Create a Dashbot account or log in at https://www.dashbot.io.

2. Click “Add a Bot” in the Admin panel:

![Dashbot Add a Bot](https://www.jovo.tech/img/docs/dashbot-add-bot.jpg)
![Dashbot Add a Bot Step 2](https://www.jovo.tech/img/docs/dashbot-add-bot2.jpg)
 
3. Select the right Platform: Alexa for Alexa Skills, or Google for Google Actions (if you are developing for both Amazon Alexa and Google Assistant, please create 2 distinct Dashbot Bots):

![Dashbot Select Platform](https://www.jovo.tech/img/docs/dashbot-select-platform.jpg)

4. Copy API Key

![Dashbot Copy API Key](https://www.jovo.tech/img/docs/dashbot-api-key.jpg)

### Enable Dashbot Analytics

Dashbot Analytics can be added to your voice app with the following commands:

```javascript
// For Dashbot Alexa Bot
app.addDashbotAlexa(key);
​
// For Dashbot Google Bot
app.addDashbotGoogleAction(key);
```

### Download the Dashbot Package

In your terminal, use the following command to download the package via npm:

```
$ npm install dashbot
```

### Test

Test your voice app, after a bit your session should appear in the Report section (data is updated hourly):

![Dashbot Test](https://www.jovo.tech/img/docs/dashbot-test.jpg)



## Bespoken

To use Bespoken Analytics for your voice app, you need to complete the following steps:

1. Create a Bespoken Dashboard account
2. Enable Bespoken Analytics in your voice app
3. Test your app

### Create a Bespoken Dashboard Account

1. Create a Bespoken account or log in at https://apps.bespoken.io/dashboard/.

2. Click the plus sign on the Home page:

![Bespoken Add a Source](https://bespoken.io/wp-content/uploads/2017/10/DashboardHomePage.png)

3. Set the name for your source and click on "Create Source"
![Bespoken Set source name](https://bespoken.io/wp-content/uploads/2017/10/DashboardCreateASkill.png)

4. On your source main page, you can see your secret key for that source in the top right corner by clicking "Show"
![Bespoken Source Main Page](https://bespoken.io/wp-content/uploads/2017/10/DashboardSkillMain.png)

5. Copy the Secret Key

### Enable Bespoken Analytics

Bespoken Analytics can be added to your voice app with the following command:

```javascript
app.addBespokenAnalytics(key);
```

### Test

Test your voice app, after a bit your session should appear in the created skill.


