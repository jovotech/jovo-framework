import { Plugin } from 'jovo-core';
import _set = require('lodash.set');
import _get = require('lodash.get');

import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
import { EnumGoogleAssistantRequestType } from '../core/google-assistant-enums';
import { GoogleActionResponse } from '../core/GoogleActionResponse';
export interface Device {
  location: {
    coordinates: {
      latitude: string;
      longitude: string;
    };
  };
}

export class AskFor implements Plugin {
  install(googleAssistant: GoogleAssistant) {
    googleAssistant.middleware('$type')!.use(this.type.bind(this));
    googleAssistant.middleware('$output')!.use(this.output.bind(this));

    /**
     * Ask for name
     * @public
     * @param {string} optContext
     */
    GoogleAction.prototype.askForName = function(optContext = '') {
      return this.askForNamePermission(optContext);
    };

    /**
     * Ask for zipcode and city
     * @public
     * @param {string} optContext
     */
    GoogleAction.prototype.askForZipCodeAndCity = function(optContext = '') {
      return this.askForCoarseLocation(optContext);
    };

    /**
     * Ask for name permission
     * @public
     * @param {string} optContext
     */
    GoogleAction.prototype.askForNamePermission = function(optContext = '') {
      this.$output.GoogleAssistant = {
        AskForPermission: {
          permissions: ['NAME'],
          optContext,
        },
      };
      return this;
    };

    /**
     * Ask for coarse location permission
     * @public
     * @param {string} optContext
     */
    GoogleAction.prototype.askForCoarseLocation = function(optContext = '') {
      this.$output.GoogleAssistant = {
        AskForPermission: {
          permissions: ['DEVICE_COARSE_LOCATION'],
          optContext,
        },
      };
      return this;
    };

    /**
     * Ask for permissions
     * @public
     * @param {string} optContext
     */
    GoogleAction.prototype.askForPreciseLocation = function(optContext = '') {
      this.$output.GoogleAssistant = {
        AskForPermission: {
          permissions: ['DEVICE_PRECISE_LOCATION'],
          optContext,
        },
      };
      return this;
    };

    /**
     * Calls askForNotification()
     *
     * @public
     * @param {string} intent // intent for which you want to send notifications
     */
    GoogleAction.prototype.askForUpdate = function(intent: string) {
      return this.askForNotification(intent);
    };

    /**
     * Ask for notification permission
     * "name" and "text" currently don't have any effect, but are implemented in the actionssdk as well.
     * Might have an effect soon.
     * @public
     * @param {string} intent // intent for which you want to send notifications
     */
    GoogleAction.prototype.askForNotification = function(intent: string) {
      this.$output.GoogleAssistant = {
        AskForUpdatePermission: {
          // Google calls it UpdatePermission as well
          intent,
        },
      };
      return this;
    };

    /**
     * Ask for permissions
     * @public
     * @param {'NAME'|'DEVICE_COARSE_LOCATION'|'DEVICE_PRECISE_LOCATION'} permissions
     * @param {string} optContext
     */
    GoogleAction.prototype.askForPermission = function(permissions: string[], optContext = '') {
      this.$output.GoogleAssistant = {
        AskForPermission: {
          permissions,
          optContext,
        },
      };
      return this;
    };

    /**
     * Returns true if permission granted
     * @return {boolean}
     */
    GoogleAction.prototype.isPermissionGranted = function() {
      for (const argument of _get(
        this.$originalRequest || this.$request,
        'inputs[0]["arguments"]',
        [],
      )) {
        if (argument.name === 'PERMISSION') {
          return _get(argument, 'boolValue', false);
        }
      }
      return false;
    };

    /**
     * Ask form sign in
     * @public
     * @param {string} optContext
     */
    GoogleAction.prototype.askForSignIn = function(optContext = '') {
      this.$output.GoogleAssistant = {
        AskForSignIn: {
          optContext,
        },
      };
      return this;
    };

    /**
     * Returns sign in status after sign in
     * @public
     * @return {boolean}
     */
    GoogleAction.prototype.getSignInStatus = function() {
      for (const argument of _get(
        this.$originalRequest || this.$request,
        'inputs[0]["arguments"]',
        [],
      )) {
        if (argument.name === 'SIGN_IN') {
          return argument.extension.status;
        }
      }
    };

    /**
     * Returns sign in cancelled
     * @public
     * @return {boolean}
     */
    GoogleAction.prototype.isSignInCancelled = function() {
      return this.getSignInStatus() === 'CANCELLED';
    };

    /**
     * Returns sign in denied
     * @public
     * @return {boolean}
     */
    GoogleAction.prototype.isSignInDenied = function() {
      return this.getSignInStatus() === 'DENIED';
    };

    /**
     * Returns sign in ok
     * @public
     * @return {boolean}
     */
    GoogleAction.prototype.isSignInOk = function() {
      return this.getSignInStatus() === 'OK';
    };

    /**
     * Ask for update date time
     * @public
     * @param {*} questions
     */
    GoogleAction.prototype.askForDateTime = function(questions: {
      requestDatetimeText: string;
      requestDateText: string;
      requestTimeText: string;
    }) {
      this.$output.GoogleAssistant = {
        AskForDateTime: questions,
      };
      return this;
    };

    /**
     * Return date time confirmation value
     * @returns {string}
     */
    GoogleAction.prototype.getDateTime = function() {
      for (const argument of _get(
        this.$originalRequest || this.$request,
        'inputs[0]["arguments"]',
        [],
      )) {
        if (argument.name === 'DATETIME') {
          return argument.datetimeValue;
        }
      }
    };

    /**
     * Return place confirmation value
     * @return {object | undefined}
     */
    GoogleAction.prototype.getPlace = function() {
      for (const argument of _get(
        this.$originalRequest || this.$request,
        'inputs[0]["arguments"]',
        [],
      )) {
        if (argument.name === 'PLACE') {
          return argument.placeValue;
        }
      }
    };

    /**
     * Return device object
     * @returns {Device}
     */
    GoogleAction.prototype.getDevice = function(): Device {
      return _get(this.$originalRequest || this.$request, 'device');
    };

    /**
     * Ask for confirmation
     * @public
     * @param {*} text
     */
    GoogleAction.prototype.askForConfirmation = function(text: string) {
      this.$output.GoogleAssistant = {
        AskForConfirmation: text,
      };
      return this;
    };

    /**
     * Return confirmation status
     * @returns {boolean}
     */
    GoogleAction.prototype.isConfirmed = function() {
      for (const argument of _get(
        this.$originalRequest || this.$request,
        'inputs[0]["arguments"]',
        [],
      )) {
        if (argument.name === 'CONFIRMATION') {
          return argument.boolValue;
        }
      }
    };

    /**
     *  Ask for place
     * @param {string} requestPrompt
     * @param {string} permissionContext
     * @returns {this}
     */
    GoogleAction.prototype.askForPlace = function(
      requestPrompt: string,
      permissionContext: string,
    ) {
      this.$output.GoogleAssistant = {
        AskForPlace: {
          requestPrompt,
          permissionContext,
        },
      };
      return this;
    };
  }
  uninstall(googleAssistant: GoogleAssistant) {}
  type(googleAction: GoogleAction) {
    if (
      _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
      'actions.intent.PERMISSION'
    ) {
      googleAction.$type.type = EnumGoogleAssistantRequestType.ON_PERMISSION;
    }
    if (
      _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
      'actions.intent.SIGN_IN'
    ) {
      googleAction.$type.type = EnumGoogleAssistantRequestType.ON_SIGN_IN;
    }
    if (
      _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
      'actions.intent.CONFIRMATION'
    ) {
      googleAction.$type.type = EnumGoogleAssistantRequestType.ON_CONFIRMATION;
    }
    if (
      _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
      'actions.intent.DATETIME'
    ) {
      googleAction.$type.type = EnumGoogleAssistantRequestType.ON_DATETIME;
    }
    if (
      _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
      'actions.intent.PLACE'
    ) {
      googleAction.$type.type = EnumGoogleAssistantRequestType.ON_PLACE;
    }
  }
  output(googleAction: GoogleAction) {
    const output = googleAction.$output;
    if (!googleAction.$originalResponse) {
      googleAction.$originalResponse = new GoogleActionResponse();
    }

    const askForSignIn =
      _get(output, 'card.AccountLinkingCard') || _get(output, 'GoogleAssistant.AskForSignIn');

    if (askForSignIn) {
      const optContext =
        _get(output, 'GoogleAssistant.AskForSignIn.optContext') ||
        _get(output, 'ask.speech', _get(output, 'GoogleAssistant.ask.speech'));

      _set(googleAction.$originalResponse, 'expectUserResponse', true);

      _set(googleAction.$originalResponse, 'systemIntent', {
        intent: 'actions.intent.SIGN_IN',
        inputValueData: {
          '@type': 'type.googleapis.com/google.actions.v2.SignInValueSpec',
          'optContext': optContext || '',
        },
      });
      _set(googleAction.$originalResponse, 'inputPrompt', {
        initialPrompts: [
          {
            textToSpeech: 'PLACEHOLDER_FOR_SIGN_IN',
          },
        ],
        noInputPrompts: [],
      });
    }

    if (_get(output, 'GoogleAssistant.AskForPermission')) {
      const optContext =
        _get(output, 'GoogleAssistant.AskForPermission.optContext') ||
        _get(output, 'ask.speech', _get(output, 'GoogleAssistant.ask.speech'));

      _set(googleAction.$originalResponse, 'expectUserResponse', true);

      _set(googleAction.$originalResponse, 'systemIntent', {
        intent: 'actions.intent.PERMISSION',
        inputValueData: {
          '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
          'optContext': optContext || '',
          'permissions': _get(output, 'GoogleAssistant.AskForPermission.permissions'),
        },
      });
    }

    if (_get(output, 'GoogleAssistant.AskForUpdatePermission')) {
      const optContext =
        _get(output, 'GoogleAssistant.AskForPermission.optContext') ||
        _get(output, 'ask.speech', _get(output, 'GoogleAssistant.ask.speech'));

      _set(googleAction.$originalResponse, 'expectUserResponse', true);

      _set(googleAction.$originalResponse, 'systemIntent', {
        intent: 'actions.intent.PERMISSION',
        inputValueData: {
          '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
          'optContext': optContext || '',
          'permissions': ['UPDATE'],
          'updatePermissionValueSpec': {
            intent: _get(output, 'GoogleAssistant.AskForUpdatePermission.intent'),
          },
        },
      });
    }

    if (_get(output, 'GoogleAssistant.AskForDateTime')) {
      _set(googleAction.$originalResponse, 'expectUserResponse', true);
      _set(googleAction.$originalResponse, 'systemIntent', {
        intent: 'actions.intent.DATETIME',
        inputValueData: {
          '@type': 'type.googleapis.com/google.actions.v2.DateTimeValueSpec',
          'dialogSpec': _get(output, 'GoogleAssistant.AskForDateTime'),
        },
      });
    }

    if (_get(output, 'GoogleAssistant.AskForConfirmation')) {
      _set(googleAction.$originalResponse, 'expectUserResponse', true);
      _set(googleAction.$originalResponse, 'systemIntent', {
        intent: 'actions.intent.CONFIRMATION',
        inputValueData: {
          '@type': 'type.googleapis.com/google.actions.v2.ConfirmationValueSpec',
          'dialogSpec': {
            requestConfirmationText: _get(output, 'GoogleAssistant.AskForConfirmation'),
          },
        },
      });
    }

    if (_get(output, 'GoogleAssistant.AskForPlace')) {
      _set(googleAction.$originalResponse, 'expectUserResponse', true);
      _set(googleAction.$originalResponse, 'systemIntent', {
        intent: 'actions.intent.PLACE',
        inputValueData: {
          '@type': 'type.googleapis.com/google.actions.v2.PlaceValueSpec',
          'dialog_spec': {
            extension: {
              '@type': 'type.googleapis.com/google.actions.v2.PlaceValueSpec.PlaceDialogSpec',
              'requestPrompt': _get(output, 'GoogleAssistant.AskForPlace.requestPrompt'),
              'permissionContext': _get(output, 'GoogleAssistant.AskForPlace.permissionContext'),
            },
          },
        },
      });
    }
  }
}
