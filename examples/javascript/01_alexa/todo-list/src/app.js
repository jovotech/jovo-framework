const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');

const app = new App();

app.use(
    new Alexa()
);


app.setHandler({

    async LAUNCH() {
       // return this.toIntent('GetTodoListIntent');
       // return this.toIntent('AddItemToTodoListIntent');
       //  return this.toIntent('UpdateItemTodoListIntent');
        return this.toIntent('DeleteItemTodoListIntent');


    },
    async GetTodoListIntent() {
        try {
            const list = await this.$alexaSkill.$user.getToDoList();
            console.log(list);
        } catch (e) {
            if (e.code === 'NO_USER_PERMISSION') {
                this.tell(`Please grant the permission to access lists.`);
            } else {
                console.error(e);
            }
        }
    },
    async AddItemToTodoListIntent() {
        try {
            const data = await this.$alexaSkill.$user.addToToDoList('Laundry');
            console.log(data);
        } catch (e) {
            if (e.code === 'NO_USER_PERMISSION') {
                this.tell(`Please grant the permission to access lists.`);
            } else {
                console.error(e);
            }
        }
    },
    async UpdateItemTodoListIntent() {
        try {
            const data = await this.$alexaSkill.$user.updateToDoList('Laundry', 'Workout');
            console.log(data);
        } catch (e) {
            if (e.code === 'NO_USER_PERMISSION') {
                this.tell(`Please grant the permission to access lists.`);
            } else {
                console.error(e);
            }
        }
    },
    async DeleteItemTodoListIntent() {
        try {
            const data = await this.$alexaSkill.$user.deleteToDoListItem('Workout');
            console.log('item deleted');
            console.log(data);

        } catch (e) {
            if (e.code === 'NO_USER_PERMISSION') {
                this.tell(`Please grant the permission to access lists.`);
            } else {
                console.error(e);
            }
        }
    }
});

module.exports.app = app;
