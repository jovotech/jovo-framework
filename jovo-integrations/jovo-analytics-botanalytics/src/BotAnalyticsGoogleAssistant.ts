// import { Analytics, PluginConfig, BaseApp, HandleRequest } from "jovo-core";
// import * as _ from 'lodash';
//
// import botanalytics, {Google} from 'botanalytics';
//
// export interface Config extends PluginConfig {
//     key: string;
// }
//
// export class BotAnalyticsGoogleAssistant implements Analytics {
//     config: Config = {
//         key: '',
//     };
//     botanalytics!: Google;
//
//     constructor(config?: Config) {
//         if (config) {
//             this.config = _.merge(this.config, config);
//         }
//         this.track = this.track.bind(this);
//     }
//
//     install(app: BaseApp) {
//         this.botanalytics = botanalytics(this.config.key).google;
//         app.on('response', this.track);
//     }
//
//     uninstall(app: BaseApp) {
//         app.removeListener('response', this.track);
//     }
//
//     track(handleRequest: HandleRequest) {
//         if (!handleRequest.jovo) {
//             return;
//         }
//
//         if (handleRequest.jovo.constructor.name === 'GoogleAction') {
//             this.botanalytics.logIncoming(handleRequest.host.getRequestObject());
//             this.botanalytics.logOutgoing(handleRequest.host.getRequestObject(), handleRequest.jovo.$response!);
//         }
//     }
// }
