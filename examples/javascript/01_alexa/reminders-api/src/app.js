const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const app = new App();

app.use(
    new Alexa()
);


app.setHandler({
    async LAUNCH() {
        // return this.toIntent('AddRelativeReminderIntent');
        // return this.toIntent('AddAbsoluteReminderIntent');
        // return this.toIntent('AllRemindersIntent');
        // return this.toIntent('UpdateReminderIntent');
        return this.toIntent('DeleteReminderIntent');

    },
    async AddRelativeReminderIntent() {
        try {

            const reminderRelative ={
                'requestTime': '2018-09-22T19:04:00.672',           // valid ISO 8601 format - describes the time when event actually occurred
                'trigger': {
                    'type': 'SCHEDULED_RELATIVE',                 // Indicates type of trigger
                    'offsetInSeconds': '60',                    // If reminder is set using relative time, use this field to specify the time after which reminder will ring (in seconds)
                },
                'alertInfo': {
                    'spokenInfo': {
                        'content': [{
                            'locale': 'en-US',                     // locale in which value is specified
                            'text': 'hello world',                // text that will be used for display and spoken purposes
                        }],
                    },
                },
                'pushNotification': {
                    'status': 'ENABLED',                          // if a push notification should be sent or not [default = ENABLED]
                },
            };

            const result = await this.$alexaSkill.$user.setReminder(reminderRelative);

            return this.tell(`Reminder has been set.`);
        } catch(error) {
            if (error.code === 'NO_USER_PERMISSION') {
                this.tell(`Please grant the permission to set reminders.`);
            } else {
                console.error(error);
            }
        }
    },
    async AddAbsoluteReminderIntent() {
        try {
            const reminderAbsolute = {
                'requestTime': '2016-09-22T19:04:00.672',           // valid ISO 8601 format - describes the time when event actually occurred
                'trigger': {
                    'type': 'SCHEDULED_ABSOLUTE',                 // Indicates type of trigger
                    'scheduledTime': '2018-11-02T19:35:00.000',    // valid ISO 8601 format - Intended trigger time
                    'recurrence': {                               // should contain all the recurrence information
                        'freq': 'WEEKLY',                         // frequency type of the recurrence
                        'byDay': ['FR'],                           // specifies a list of days within a week
                    },
                },
                'alertInfo': {
                    'spokenInfo': {
                        'content': [{
                            'locale': 'en-US',                     // locale in which value is specified
                            'text': 'hello world',                // text that will be used for display and spoken purposes
                        }],
                    },
                },
                'pushNotification': {
                    'status': 'ENABLED',                          // if a push notification should be sent or not [default = ENABLED]
                },
            };
            const result = await this.$alexaSkill.$user.setReminder(reminderAbsolute);

            return this.tell(`Reminder has been set.`);
        } catch(error) {
            if (error.code === 'NO_USER_PERMISSION') {
                this.tell(`Please grant the permission to set reminders.`);
            } else {
                console.error(error);
            }
        }
    },
    async AllRemindersIntent() {
        const data = await this.$alexaSkill.$user.getAllReminders();

        console.log(data);
        this.tell('Here are your reminders');

    },
    async UpdateReminderIntent() {
        try {
            const alertToken = '<REMINDER TOKEN>';

            const updatedAbsoluteReminder = {
                'requestTime': '2016-09-22T19:04:00.672',           // valid ISO 8601 format - describes the time when event actually occurred
                'trigger': {
                    'type': 'SCHEDULED_ABSOLUTE',                 // Indicates type of trigger
                    'scheduledTime': '2018-11-02T18:35:00.000',    // valid ISO 8601 format - Intended trigger time
                    'recurrence': {                               // should contain all the recurrence information
                        'freq': 'WEEKLY',                         // frequency type of the recurrence
                        'byDay': ['SA'],                           // specifies a list of days within a week
                    },
                },
                'alertInfo': {
                    'spokenInfo': {
                        'content': [{
                            'locale': 'en-US',                     // locale in which value is specified
                            'text': 'hello world',                // text that will be used for display and spoken purposes
                        }],
                    },
                },
                'pushNotification': {
                    'status': 'ENABLED',                          // if a push notification should be sent or not [default = ENABLED]
                },
            };
            const data = await this.$alexaSkill.$user.updateReminder(alertToken, updatedAbsoluteReminder);

            console.log(JSON.stringify(data, null, '\t'));
            this.tell('Reminder has been updated.');
        } catch(error) {
            if (error.code === 'NO_USER_PERMISSION') {
                this.tell(`Please grant the permission to set reminders.`);
            } else {
                console.error(error);
            }
        }
    },
    async DeleteReminderIntent() {
        try {
            const alertToken = 'd99430a0-6ff2-424d-8f00-8bd45a0a4fe6';
            const data = await this.$alexaSkill.$user.deleteReminder(alertToken);
            this.tell('Reminder has been deleted.');

        } catch(error) {
            if (error.code === 'NO_USER_PERMISSION') {
                this.tell(`Please grant the permission to set reminders.`);
            } else {
                console.error(error);
            }
        }
    },
});


module.exports.app = app;
