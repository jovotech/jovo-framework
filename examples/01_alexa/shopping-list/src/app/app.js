const {App, Alexa, Jovo, Util} = require('jovo-framework');
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
            const list = await this.$user.getShoppingList();
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
            const data = await this.$user.addToShoppingList('Bread')
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
            const data = await this.$user.updateShoppingList('Bread', 'Milk');
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
            const data = await this.$user.deleteShoppingListItem('Milk');
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
