'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);

// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        // this.toIntent('AddRelativeReminderIntent');
        // this.toIntent('AddAbsoluteReminderIntent');

        // this.toIntent('DeleteReminderIntent');
        // this.toIntent('UpdateReminderIntent');
        // this.toIntent('AllRemindersIntent');
    },

    'AddRelativeReminderIntent': function() {
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

        this.user().setReminder(reminderRelative).then((data) => {
            console.log(data);
            this.tell('Done');
        }).catch((err) => {
            if (error.code === 'NO_USER_PERMISSION') {
                this.tell('Please grant the permission to set reminders.');
            } else {
                this.tell(error.message);
            }
        });
    },

    'AddAbsoluteReminderIntent': function() {
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


        this.user().setReminder(reminderAbsolute).then((data) => {
            console.log(data);
            this.tell('Done');
        }).catch((err) => {
            if (error.code === 'NO_USER_PERMISSION') {
                this.tell('Please grant the permission to set reminders.');
            } else {
                this.tell(error.message);
            }
        });
    },

    'AllRemindersIntent': function() {
        this.user().getAllReminders().then((data) => {
                console.log(JSON.stringify(data, null, '\t'));
                this.tell('Here are your reminders');
        });
    },

    'UpdateReminderIntent': function() {
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

            this.user().updateReminder(alertToken, updatedAbsoluteReminder).then((data) => {
                console.log(JSON.stringify(data, null, '\t'));
                this.tell('Reminder has been updated.');
        });
    },

    'DeleteReminderIntent': function() {
        const alertToken = '<REMINDER TOKEN>';

        //  only deletes active reminders
        this.user().deleteReminder(alertToken).then(() => {
            this.tell('Reminder has been deleted.');
        }).catch((err) => {
            console.log(err);
            this.tell('error');
        });
    },
});

module.exports.app = app;


