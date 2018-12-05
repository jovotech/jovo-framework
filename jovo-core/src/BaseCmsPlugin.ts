import {Extensible} from "./Extensible";
import {BaseApp} from "./BaseApp";
import {HandleRequest} from "./Interfaces";

export class BaseCmsPlugin extends Extensible {

    install(app: BaseApp) {
        app.middleware('after.platform.init')!.use(this.copyCmsDataToContext.bind(this));
    }

    private async copyCmsDataToContext(handleRequest: HandleRequest) {
        if (handleRequest.jovo) {
            handleRequest.jovo.$cms.$jovo = handleRequest.jovo;
            Object.assign(handleRequest.jovo.$cms, handleRequest.app.$cms);
        }
    }
    uninstall(app: BaseApp) {
    }
}
