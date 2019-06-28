import { GoogleAnalyticsSender, EventParameters, Config } from "./GoogleAnalyticsSender";
import { Plugin, BaseApp, Jovo, HandleRequest } from "jovo-core";
import * as util from 'util'
import * as ua from 'universal-analytics';
import * as murmurhash from 'murmurhash';



export class HappyMealGAnalyticsSender extends GoogleAnalyticsSender {

    constructor(config?: Config) {
        config ? super(config) : super();

    }

    install(app: BaseApp): void {
        super.install(app);
        //app.middleware('response')!.use(this.SendSessionsPlayedCount.bind(this));
    }




    sendSessionsPlayedCount(handleRequest: HandleRequest) {
        let jovo: Jovo = handleRequest.jovo!;

        let idHash = murmurhash.v3(jovo.$user.getId()!) + murmurhash.v3(jovo.getDeviceId()!);

        let visitor = this.initVisitor(jovo);


        if (jovo.getMappedIntentName() === 'StartGameIntent') {
            console.log("***************SEND Transaction");
            visitor!
                .transaction("0", (err) => {
                    console.log("callback from transaction...");
                     
                    err? console.log("error : "+ err!.message): console.log("no Error from transaction");
                })
                .item(1, 1, "GamesStarted", (err)  => {
                    console.log("callback from item...");
                    err? console.log("error: "+ err!.message) : console.log("no error for item");
                }).send();
                ;
            console.log("***************SENT Transaction");
            let eventParams: EventParameters = {
                eventCategory: "GamesStarted",
                eventAction: "StartGame",
                eventLabel: idHash.toString()
            }
            //console.log('visitor in subclass: '+ util.inspect(this.visitor));
            this.sendIntentEvent(visitor!, eventParams);
        }




    }
}