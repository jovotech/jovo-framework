# Reminders API

Learn more about how to set reminders for your user with your Alexa Skill.

## Introduction

To create a reminder you simply send a `JSON` object to Amazon's API endpoint. You can find out what that these `JSON` objects look like [here](https://developer.amazon.com/docs/smapi/alexa-reminders-api-reference.html#reminder-object)

## Add Reminder

To add a reminder you use the `setReminder()` method, which takes in the `JSON` object as a parameter:

```javascript
let reminder = {
    // your reminder
};
this.$user.setReminder(reminder).then((data) => {
    console.log(data);
    this.tell('Done');
}).catch((error) => {
    console.log(error);
});
```

As a response to the API call you will receive an object containing the following data:

```javascript
{
  "alertToken": "string",
  "createdTime": "2018-08-14T15:40:55.002Z",
  "updatedTime": "2018-08-14T15:40:55.002Z",
  "status": "ON",
  "version": "string",
  "href": "string"
}
```

Name | Description | Value
:--- | :--- | :--- 
`alertToken` | Unique ID of the reminder | `String`
`createdTime` | Created time of the reminder (ISO 8601) | `String`
`updatedTime` | Last updated time of the reminder (ISO 8601) | `String`
`status` | Either **ON** or **COMPLETED** | `Enum`
`version` | Version of the reminder | `String`
`href` | URI to retrieve the alert | `String`

## Update Reminder

To update a reminder you need the `JSON` object to update with as well as the `alertToken` to define which one you want to update and the `updateReminder()` method:

```javascript
const alertToken = '<REMINDER TOKEN>';

const updatedReminder = {
    // your reminder
};

this.$user.updateReminder(alertToken, updatedReminder).then((data) => {
    console.log(data);
    this.tell('Reminder has been updated.');
}).catch((error) => {
    console.log(error);
});
```

You will receive the same response you receive after adding a new reminder.

## Delete Reminder

To delete an active reminder you need the `deleteReminder()` method which takes in the `alertToken` as a parameter:

```javascript
const alertToken = '<REMINDER TOKEN>';

this.$user.deleteReminder(alertToken).then(() => {
    this.tell('Reminder has been deleted.');
}).catch((err) => {
    console.log(err);
});
```

## Get Reminder

You can also send out a request to get a reminder using its `alertToken`:

```javascript
const alertToken = '<REMINDER TOKEN>';

this.$user.getReminder(alertToken).then((data) => {
        console.log(data);
}).catch((err) => {
    console.log(err);
});
```

There is also the possibility to get all your reminders at once:

```javascript
this.$user.getAllReminders().then((data) => {
        console.log(data);
}).catch((err) => {
    console.log(err);
});
```


<!--[metadata]: {"description": "Learn more about how to set reminders for your user with your Alexa Skill."
"route": "amazon-alexa/reminders" }-->