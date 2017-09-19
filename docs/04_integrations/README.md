# Integrations

With third-party integrations, you can add more functionality to your voice apps.

* [Databases](#databases)
  * [Jovo Persistence Layer](#jovo-persistence-layer)
  * [FilePersistence](#filepersistence)
  * [DynamoDB](#dynamodb)
* [Analytics](#analytics)
  * [Jovo Analytics Layer](#jovo-analytics-layer)
  * [VoiceLabs](#voicelabs)
  * [Dashbot](#dashbot)


## Databases

Jovo offers a Persistence Layer, which is an interface for off-the-shelf integrations with databases. Currently, we support a file-based system for prototyping, and DynamoDB.

### Jovo Persistence Layer

This is an abstraction layer for persisting data across sessions. By default, the file-based system will be used so you can start right away when prototyping locally.

#### Save Data

This will save data with your user's user ID as a mainKey, and a key and a value specified by you. This makes use of a callback function that's called after a successful (or unsuccessful, for error handling) call of the method.

```
save(key, value, callback)
​
app.db().save(key, value, function(err) {
     // do something
});
​
// Example
let score = 100;
app.db().save('score', score, function(err) {
       speech = 'Your new score is ' + score + ' points.';
       app.tell(speech);
});
```

#### Load Data

After you saved data, you can use a key to retrieve a value from the database.

```
load(key, callback)
​
app.db().load(key, function(err, data) {
     // do something
});
​
// Example
app.db().load('score', function(err, data) {
       let score = data;
       speech = 'Your current score is ' + score + ' points.';
       app.tell(speech);
});
```

#### Delete Data

This will delete a data point from the database, specified by a key.

```
deleteData(key, callback)
​
app.db().deleteData(key, function(err) {
      // do something
});
```

#### Delete a User

This will delete your whole user's data (the mainKey) from the database.

```
deleteUser(callback)
​
app.db().deleteUser(function(err) {
      // do something
});
```

### FilePersistence

The FilePersistence integration allows you to easily store user session data in a JSON file. This is especially helpful for local development and prototyping. Data will be stored to a db.json file by default.

![Jovo File Perstistence](https://www.jovo.tech/img/docs/filepersistence.jpg)


### DynamoDB

The DynamoDB integration allows you to store user session data in the NoSQL service running on AWS. This integration is especially convenient if you’re running your voice app on AWS Lambda.

You can simply integrate a DynamoDB table like this:

```
app.setDynamoDb('TableName');
```

This will create a table with a name specified by you, and use this to store and load data. To make it work, you need to give your Lambda Role DynamoDB permissions.

## Analytics
Jovo offers easy analytics integrations and enhancements for VoiceLabs and Dashbot.

### Jovo Analytics Layer

You can add and configure analytics by placing them in between the handleRequest and execute method calls of your voice app:

```
//  Place between handleRequest and execute
webhook.post('/webhook', function(req, res) {
    app.handleRequest(req, res, handlers);
    //
    // place code somewhere here
    //
    app.execute();
});
```

#### Add Analytics Integrations

Analytics for your voice app can be added with one line of code for each analytics vendor and voice platform.

```
// VoiceLabs integration
app.addVoiceLabsAlexa(key);
app.addVoiceLabsGoogleAction(key);
​
// Dashbot integration
app.addDashbotAlexa(key);
app.addDashbotGoogleAction(key);
```

More detailed step-by-step guides can be found here: [VoiceLabs](#voicelabs) | [Dashbot](#dashbot)

The Jovo Analytics class offers several enhancements to the vendor tracking, which can be found in the following sections.

#### Turn Analytics On and Off

After adding analytics to your voice app, tracking is enabled by default. You can disable it with the following method:

```
app.analytics().disable();
```

Also, you can enable analytics with this method:

```
app.analytics().enable();
```

#### Skip Intents

```
app.analytics().skipIntents(intents);
```

#### Skip Users

```
app.analytics().skipUsers(userIds);
```

### VoiceLabs

To use VoiceLabs Insights for your voice app analytics, you need to complete the following steps:

1. Create a VoiceLabs Application
2. Enable VoiceLabs Anaytics in your voice app
3. Download the voicelabs npm package
4. Test your app

#### Create A VoiceLabs Application

1. Create a VoiceLabs account or log in at https://insights.voicelabs.co/login

2. Create a new application

![Create VoiceLabs Application](https://www.jovo.tech/img/docs/voicelabs-new-application.jpg)

3. Select the platform you want to use (if you are developing for both Amazon Alexa and Google Assistant, please create 2 distinct applications)

![VoiceLabs Select Platform](https://www.jovo.tech/img/docs/voicelabs-select-platform.jpg)

4. Copy API Key

![VoiceLabs Copy API Key](https://www.jovo.tech/img/docs/voicelabs-api-key.jpg)


#### Enable VoiceLabs Analytics

VoiceLabs Analytics can be added to your voice app with the following commands:

```
// For VoiceLabs Alexa Application
app.addVoiceLabsAlexa(key);
​
// For VoiceLabs Google Assistant Application
app.addVoiceLabsGoogleAction(key);
```

#### Download the VoiceLabs Package

In your terminal, use the following command to download the package via npm:

```
# For Alexa Skills
$ npm install voicelabs
​
# For Google Actions
$ npm install voicelabs-assistant-sdk
```

#### Test

Test your voice app, after a bit your session should appear:

![VoiceLabs Test](https://www.jovo.tech/img/docs/voicelabs-test.jpg)


### Dashbot

To use Dashbot Analytics for your voice app, you need to complete the following steps:

1. Create a Dashbot Bot
2. Enable Dashbot Anaytics in your voice app
3. Download the dashbot npm package
4. Test your app

#### Create a Dashbot Bot

1. Create a Dashbot accounto or log in at https://www.dashbot.io.

2. Click “Add a Bot” in the Admin panel:

![Dashbot Add a Bot](https://www.jovo.tech/img/docs/dashbot-add-bot.jpg)
![Dashbot Add a Bot Step 2](https://www.jovo.tech/img/docs/dashbot-add-bot2.jpg)
 
3. Select the right Platform: Alexa for Alexa Skills, or Google for Google Actions (if you are developing for both Amazon Alexa and Google Assistant, please create 2 distinct Dashbot Bots):

![Dashbot Select Platform](https://www.jovo.tech/img/docs/dashbot-select-platform.jpg)

4. Copy API Key

![Dashbot Copy API Key](https://www.jovo.tech/img/docs/dashbot-api-key.jpg)

#### Enable Dashbot Analytics

Dashbot Analytics can be added to your voice app with the following commands:

```
// For Dashbot Alexa Bot
app.addDashbotAlexa(key);
​
// For Dashbot Google Bot
app.addDashbotGoogleAction(key);
```

#### Download the Dashbot Package

In your terminal, use the following command to download the package via npm:

```
$ npm install dashbot
```

#### Test

Test your voice app, after a bit your session should appear in the Report section (data is updated hourly):

![Dashbot Test](https://www.jovo.tech/img/docs/dashbot-test.jpg)

