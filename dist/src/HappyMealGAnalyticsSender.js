"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleAnalyticsSender_1 = require("./GoogleAnalyticsSender");
const murmurhash = require("murmurhash");
class HappyMealGAnalyticsSender extends GoogleAnalyticsSender_1.GoogleAnalyticsSender {
    constructor(config) {
        config ? super(config) : super();
    }
    install(app) {
        super.install(app);
        //app.middleware('response')!.use(this.SendSessionsPlayedCount.bind(this));
    }
    sendSessionsPlayedCount(handleRequest) {
        let jovo = handleRequest.jovo;
        let idHash = murmurhash.v3(jovo.$user.getId()) + murmurhash.v3(jovo.getDeviceId());
        let visitor = this.initVisitor(jovo);
        if (jovo.getMappedIntentName() === 'StartGameIntent') {
            console.log("***************SEND Transaction");
            visitor
                .transaction("0", (err) => {
                console.log("callback from transaction...");
                err ? console.log("error : " + err.message) : console.log("no Error from transaction");
            })
                .item(1, 1, "GamesStarted", (err) => {
                console.log("callback from item...");
                err ? console.log("error: " + err.message) : console.log("no error for item");
            }).send();
            ;
            console.log("***************SENT Transaction");
            let eventParams = {
                eventCategory: "GamesStarted",
                eventAction: "StartGame",
                eventLabel: idHash.toString()
            };
            //console.log('visitor in subclass: '+ util.inspect(this.visitor));
            this.sendIntentEvent(visitor, eventParams);
        }
    }
}
exports.HappyMealGAnalyticsSender = HappyMealGAnalyticsSender;
//# sourceMappingURL=HappyMealGAnalyticsSender.js.map