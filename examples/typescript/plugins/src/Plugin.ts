import {HandleRequest, Plugin} from "jovo-core";
import {App} from "jovo-framework";

export class MiddlewareAuthPlugin implements Plugin {
    install(app: App) {
        app.middleware('request')!.use(this.auth.bind(this));

    }

    auth(handleRequest: HandleRequest) {

        if (!handleRequest.host.headers['auth-code']) {
            // throw new Error('Missing auth code');
        }
    }

}
