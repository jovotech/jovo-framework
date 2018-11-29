import {Plugin, HandleRequest} from "jovo-core";
import * as _ from "lodash";
import {GoogleAssistant} from "../GoogleAssistant";
import {GoogleAction} from "../core/GoogleAction";
import {GoogleActionResponse} from "../core/GoogleActionResponse";




export class GoogleAssistantCore implements Plugin {

    install(googleAssistant: GoogleAssistant) {
        googleAssistant.middleware('$init')!.use(this.init.bind(this));
        googleAssistant.middleware('$output')!.use(this.output.bind(this));

        GoogleAction.prototype.displayText = function(displayText: string) {
            _.set(this.$output, 'GoogleAssistant.displayText',
                displayText
            );
            return this;
        };

    }

    async init(handleRequest: HandleRequest) {
        const requestObject = handleRequest.host.getRequestObject();

        if (requestObject.user &&
            requestObject.conversation &&
            requestObject.surface &&
            requestObject.availableSurfaces) {
            handleRequest.jovo = new GoogleAction(handleRequest.app, handleRequest.host);
        }
    }



    async output(googleAction: GoogleAction) {
        const output = googleAction.$output;
        if (!googleAction.$response) {
            googleAction.$response = new GoogleActionResponse();
        }
        const tell = _.get(output, 'GoogleAssistant.tell') || _.get(output, 'tell');
        if (tell) {
            _.set(googleAction.$response, 'expectUserResponse', false);
            _.set(googleAction.$response, 'richResponse.items', [{
                simpleResponse: {
                    ssml: `<speak>${tell.speech}</speak>`,
                }
            }]);
        }
        const ask = _.get(output, 'GoogleAssistant.ask') || _.get(output, 'ask');

        if (ask) {
            _.set(googleAction.$response, 'expectUserResponse', true);

            // speech
            _.set(googleAction.$response, 'richResponse.items', [{
                simpleResponse: {
                    ssml: `<speak>${ask.speech}</speak>`,
                }
            }]);

            // reprompts
            const noInputPrompts: any[] = []; // tslint:disable-line

            if (output.ask && output.ask.reprompt && typeof output.ask.reprompt === 'string') {
                noInputPrompts.push({
                    ssml: `<speak>${ask.reprompt}</speak>`
                });
            } else if (Array.isArray(ask.reprompt)) {
                ask.reprompt.forEach((reprompt: string) => {
                    noInputPrompts.push({
                        ssml: `<speak>${reprompt}</speak>`
                    });
                });
            }
            _.set(googleAction.$response, 'noInputPrompts', noInputPrompts);
        }

        if (_.get(output, 'GoogleAssistant.displayText') && googleAction.hasScreenInterface()) {
            _.set(googleAction.$response, 'richResponse.items[0].simpleResponse.displayText', _.get(output, 'googleAction.displayText'));
        }

    }
    uninstall(googleAssistant: GoogleAssistant) {

    }

}
