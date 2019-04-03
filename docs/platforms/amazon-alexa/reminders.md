# Reminders API

Learn more about how to set reminders for your user with your Alexa Skill.

* [Introduction](#introduction)
* [Add Reminder](#add-reminder)
* [Update Reminder](#update-reminder)
* [Delete Reminder](#delete-reminder)
* [Get Reminder](#get-reminder)

## Introduction

To create a reminder you simply send a `JSON` object to Amazon's API endpoint. You can find out what that these `JSON` objects look like [here](https://developer.amazon.com/docs/smapi/alexa-reminders-api-reference.html#reminder-object)

## Add Reminder

To add a reminder you use the `setReminder()` method, which takes in the `JSON` object as a parameter:

```javascript
// @language=javascript

await this.$alexaSkill.$user.setReminder(reminder);

// Example
async AddReminderIntent() {
    const reminder = {
        // Your reminder
    };

    try {
        const result = await this.$alexaSkill.$user.setReminder(reminder);

        this.tell('Reminder has been set.');

    } catch(error) {
        if (error.code === 'NO_USER_PERMISSION') {
            this.tell('Please grant the permission to set reminders.');
        } else {
            console.error(error);
            // Do something
        }
    }
},

// @language=typescript

await this.$alexaSkill!.$user.setReminder(reminder: AbsoluteReminder | RelativeReminder);

// Example
async AddReminderIntent() {
    const reminder = {
        // Your reminder
    };

    try {
        const result = await this.$alexaSkill!.$user.setReminder(reminder);

        this.tell('Reminder has been set.');

    } catch(error: Error) {
        if (error.code === 'NO_USER_PERMISSION') {
            this.tell('Please grant the permission to set reminders.');
        } else {
            console.error(error);
            // Do something
        }
    }
},
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
// @language=javascript

await this.$alexaSkill.$user.updateReminder(alertToken, updatedReminder);

// Example
async UpdateReminderIntent() {
    const alertToken = '<REMINDER TOKEN>';
    const updatedReminder = {
        // Your reminder
    };

    try {
        const result = await this.$alexaSkill.$user.updateReminder(alertToken, updatedAbsoluteReminder);

        this.tell('Reminder has been updated.');

    } catch(error) {
        if (error.code === 'NO_USER_PERMISSION') {
                this.tell('Please grant the permission to set reminders.');
        } else {
            console.error(error);
            // Do something
        }
    }
},

// @language=typescript

await this.$alexaSkill!.$user.updateReminder(alertToken: string, updatedReminder: AbsoluteReminder | RelativeReminder);

// Example
async UpdateReminderIntent() {
    const alertToken = '<REMINDER TOKEN>';
    const updatedReminder = {
        // Your reminder
    };

    try {
        const result = await this.$alexaSkill!.$user.updateReminder(alertToken, updatedAbsoluteReminder);

        this.tell('Reminder has been updated.');

    } catch(error: Error) {
        if (error.code === 'NO_USER_PERMISSION') {
                this.tell('Please grant the permission to set reminders.');
        } else {
            console.error(error);
            // Do something
        }
    }
},
```

You will receive the same response you receive after adding a new reminder.

## Delete Reminder

To delete an active reminder you need the `deleteReminder()` method which takes in the `alertToken` as a parameter:

```javascript
// @language=javascript

await this.$alexaSkill.$user.deleteReminder(alertToken);

async DeleteReminderIntent() {
    try {
        const alertToken = '<REMINDER TOKEN>';
        const result = await this.$alexaSkill.$user.deleteReminder(alertToken);
        this.tell('Reminder has been deleted.');

    } catch(error) {
        if (error.code === 'NO_USER_PERMISSION') {
            this.tell(`Please grant the permission to set reminders.`);
        } else {
            console.error(error);
            // Do something
        }
    }
},

// @language=typescript

await this.$alexaSkill!.$user.deleteReminder(alertToken: string);

async DeleteReminderIntent() {
    try {
        const alertToken = '<REMINDER TOKEN>';
        const result = await this.$alexaSkill!.$user.deleteReminder(alertToken);
        this.tell('Reminder has been deleted.');

    } catch(error: Error) {
        if (error.code === 'NO_USER_PERMISSION') {
            this.tell(`Please grant the permission to set reminders.`);
        } else {
            console.error(error);
            // Do something
        }
    }
},
```

## Get Reminder

You can also send out a request to get a reminder using its `alertToken`:

```javascript
// @language=javascript

await this.$alexaSkill.$user.getReminder(alertToken)

// Example
async GetReminderIntent() {
    const alertToken = '<REMINDER TOKEN>';

    try {
        const result = await this.$alexaSkill.$user.getReminder(alertToken);

    } catch(error) {
        console.error(error);
    }
},

// @language=typescript

await this.$alexaSkill!.$user.getReminder(alertToken: string)

// Example
async GetReminderIntent() {
    const alertToken = '<REMINDER TOKEN>';

    try {
        const result = await this.$alexaSkill!.$user.getReminder(alertToken);

    } catch(error: Error) {
        console.error(error);
    }
},
```

There is also the possibility to get all your reminders at once:

```javascript
// @language=javascript

await this.$alexaSkill.$user.getAllReminders()

// Example
async GetAllRemindersIntent() {
    const alertToken = '<REMINDER TOKEN>';

    try {
        const result = await this.$alexaSkill.$user.getAllReminders();

    } catch(error) {
        console.error(error);
    }
},

// @language=typescript

await this.$alexaSkill!.$user.getAllReminders()

// Example
async GetAllRemindersIntent() {
    const alertToken = '<REMINDER TOKEN>';

    try {
        const result = await this.$alexaSkill!.$user.getAllReminders();

    } catch(error: Error) {
        console.error(error);
    }
},
```

<!--[metadata]: {"description": "Learn more about how to set reminders for your user with your Alexa Skill.",
"route": "amazon-alexa/reminders" }-->
