const {App, Util} = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
Util.consoleLog(1);

const app = new App();

app.use(
    new Alexa()
);


app.setHandler({

    async LAUNCH() {
       // return this.toIntent('GetShoppingListIntent');
       // return this.toIntent('AddItemToShoppingListIntent');
       //  return this.toIntent('UpdateItemShoppingListIntent');
        return this.toIntent('DeleteItemShoppingListIntent');


    },
    async GetShoppingListIntent() {
        try {
            const list = await this.$alexaSkill.$user.getShoppingList();
            console.log(list);
        } catch (e) {
            if (e.code === 'NO_USER_PERMISSION') {
                this.tell(`Please grant the permission to access lists.`);
            } else {
                console.error(e);
            }
        }
    },
    async AddItemToShoppingListIntent() {
        try {
            const data = await this.$alexaSkill.$user.addToShoppingList('Bread')
            console.log(data);
        } catch (e) {
            if (e.code === 'NO_USER_PERMISSION') {
                this.tell(`Please grant the permission to access lists.`);
            } else {
                console.error(e);
            }
        }
    },
    async UpdateItemShoppingListIntent() {
        try {
            const data = await this.$alexaSkill.$user.updateShoppingList('Bread', 'Milk');
            console.log(data);
        } catch (e) {
            if (e.code === 'NO_USER_PERMISSION') {
                this.tell(`Please grant the permission to access lists.`);
            } else {
                console.error(e);
            }
        }
    },
    async DeleteItemShoppingListIntent() {
        try {
            const data = await this.$alexaSkill.$user.deleteShoppingListItem('Milk');
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
