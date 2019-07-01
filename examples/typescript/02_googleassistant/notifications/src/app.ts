
import { App } from 'jovo-framework';


import {GoogleAssistant, NotificationObject, NotificationPlugin} from 'jovo-platform-googleassistant';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';


const app = new App();

app.use(
    new GoogleAssistant().use(new NotificationPlugin()),
    new JovoDebugger(),
    new FileDb(),
);


app.setHandler({
    async LAUNCH() {
        this.toIntent('AskForNotifications');
        // this.toIntent('SendNotificationIntent');
    },
    AskForNotifications() {
        // You have to show them suggestion chips inviting them to opt-in,
        // before you can send the actual permission request
        this.$googleAction!.showSuggestionChips(['yes', 'no']);
        this.ask('Notifications?');
    },

    YesIntent() {
        this.$googleAction!.askForNotification('HelloWorldIntent');
    },

    async SendNotificationIntent() {
        const accessToken = await this.$googleAction!.$notification!.getAccessToken(
            '<client-email>',
            '<private-key>'
        );
        const notification: NotificationObject = {
            customPushMessage: {
                userNotification: {
                    title: 'Notification Test Title',
                },
                target: {
                    userId: this.$user.getId()!,
                    intent: 'HelloWorldIntent',
                    locale: this.$request!.getLocale()
                },
            }
        };
        const result = await this.$googleAction!.$notification!.sendNotification(notification, accessToken);
        this.tell('Notification sent!');
    },

    HelloWorldIntent() {
        this.tell('Hello World!');
    },

    ON_PERMISSION() {
        if (this.$googleAction!.isPermissionGranted()) {
            this.tell('Alright! You will receive notifications');
        } else {
            this.tell('You won\'t receive notifications');
        }
    }
});

export {app};
