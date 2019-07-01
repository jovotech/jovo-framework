'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { GoogleAssistant, NotificationPlugin } = require('jovo-platform-googleassistant');

const app = new App();

const googleAssistant = new GoogleAssistant();

googleAssistant.use(new NotificationPlugin());

app.use(
    googleAssistant
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    async LAUNCH() {

        this.toIntent('AskForNotifications');
        // this.toIntent('SendNotificationIntent');
    },
    AskForNotifications() {
        // You have to show them suggestion chips inviting them to opt-in,
        // before you can send the actual permission request
        this.$googleAction.showSuggestionChips(['yes', 'no']);
        this.ask('Notifications?');
    },

    YesIntent() {
        this.$googleAction.askForNotification('HelloWorldIntent');
    },

    async SendNotificationIntent() {
        const accessToken = await this.$googleAction.$notification.getAccessToken(
            '<client-email>',
            '<private-key>'
        );
        const notification = {
            customPushMessage: {
                userNotification: {
                    title: 'Notification Test Title',
                },
                target: {
                    userId: this.$user.getId(),
                    intent: 'HelloWorldIntent',
                    locale: this.$request.getLocale()
                },
            }
        };
        const result = await this.$googleAction.$notification.sendNotification(notification, accessToken);
        this.tell('Notification sent!');
    },

    HelloWorldIntent() {
        // this.tell('Hello World!');
    },

    ON_PERMISSION() {
        if (this.$googleAction.isPermissionGranted()) {
            this.tell('Alright! You will receive notifications');
        } else {
            this.tell('You won\'t receive notifications');
        }
    }
});

module.exports.app = app;
