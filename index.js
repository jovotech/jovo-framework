/**
 * Created by Alex on 22-May-17.
 */

var jovo = require('./jovo');

exports.handler = function (event, context, callback) {
    jovo.initLambda(event, callback, handlers);
};


var handlers1 = {
    "HelloWorldIntent" : function () {
        jovo.tell(jovo.getSlotValue("name") + " is a fool");
        this.stateA();
    },
};




