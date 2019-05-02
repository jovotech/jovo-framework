import {Plugin} from "jovo-core";
import _get = require("lodash.get");
import _set = require("lodash.set");

import {GoogleAssistant} from "../GoogleAssistant";
import {GoogleAction} from "../core/GoogleAction";
import {GoogleActionResponse} from "../core/GoogleActionResponse";

export class Updates {
  googleAction: GoogleAction;

  constructor(googleAction: GoogleAction) {
    this.googleAction = googleAction;
  }

  /**
   * Ask the user to register for updates
   * @param {string} intent The intent that will be triggered by the update
   * @param {'DAILY'|'ROUTINES'} frequency The update frequency (daily or routines)
   */
  askForRegisterUpdate(intent: string, frequency = 'DAILY') {
    /* TODO: support to arguments */
    this.googleAction.$output.GoogleAssistant = {
      AskForRegisterUpdate: {
        intent,
        frequency,
      }
    };
  }

  /**
   * Check if the user has accepted the updates
   * @returns {boolean}
   */
  isRegisterUpdateOk(): boolean {
    return this.getRegisterUpdateStatus() === 'OK';
  }

  /**
   * Returns the register status
   * @returns {'OK'|'CANCELLED'}
   */
  getRegisterUpdateStatus(): string | undefined {
    for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
      if (argument.name === 'REGISTER_UPDATE') {
          return argument.extension.status;
      }
    }
  }

  /**
   * Check if the user has cancelled the updates
   * @returns {boolean}
   */
  isRegisterUpdateCancelled(): boolean {
    return this.getRegisterUpdateStatus() === 'CANCELLED';
  }

  /* TODO: Needs test */
  /**
   * Get configure updates intente parameter UPDATE_INTENT
   * @returns {string|undefined}
   */
  getConfigureUpdatesIntent(): string | undefined {
    for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
      if (argument.name === 'UPDATE_INTENT') {
          return argument.extension.status;
      }
    }
  }
}

export class UpdatesPlugin implements Plugin {
  install(googleAssistant: GoogleAssistant) {
    googleAssistant.middleware("$type")!.use(this.type.bind(this));
    googleAssistant.middleware("$output")!.use(this.output.bind(this));

    GoogleAction.prototype.$updates = undefined;
  }

  type(googleAction: GoogleAction) {
    const intentName = _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent');

    if (intentName === 'actions.intent.REGISTER_UPDATE') {
      _set(googleAction.$type, 'type', 'ON_REGISTER_UPDATE');
    }

    /* TODO: Needs test */
    if (intentName === 'actions.intent.CONFIGURE_UPDATES') {
      _set(googleAction.$type, 'type', 'ON_CONFIGURE_UPDATES');
    }

    googleAction.$updates = new Updates(googleAction);
  }

  output(googleAction: GoogleAction) {
    if (!googleAction.$originalResponse) {
      googleAction.$originalResponse = new GoogleActionResponse();
    }
    const output = googleAction.$output;

    const askForRegisterUpdate = _get(output, "GoogleAssistant.AskForRegisterUpdate");

    if (askForRegisterUpdate) {
        _set(googleAction.$originalResponse, "expectUserResponse", true);
        _set(googleAction.$originalResponse, "systemIntent", {
          intent: "actions.intent.REGISTER_UPDATE",
          inputValueData: {
              "@type": "type.googleapis.com/google.actions.v2.RegisterUpdateValueSpec",
              intent: askForRegisterUpdate.intent,
              triggerContext: {
                  timeContext: {
                      frequency: askForRegisterUpdate.frequency,
                  },
              },
          },
        });
        _set(googleAction.$originalResponse, 'inputPrompt', {
          initialPrompts: [
              {
                  textToSpeech: 'PLACEHOLDER_FOR_REGISTER_UPDATE',
              },
          ],
          noInputPrompts: [],
      });
    }

  }

  uninstall(googleAssistant: GoogleAssistant) {

  }
}
