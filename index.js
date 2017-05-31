/**
 * Created by Alex on 22-May-17.
 */

const Jovo = require('./Jovo').Jovo;

const app = new Jovo();

exports.handler = function (event, context, callback) {
    app.initLambda(event, callback, handlers);
    app.execute();
};


let handlers = {

    "LAUNCH" : function() {
       app.tell("How is it going?");
    },


    "HelloWorldIntent" : function () {
        app.tell("Hey");
    },

    "NameIntent" : function () {
        app.tell("Hey man was geht?");
    }
};




