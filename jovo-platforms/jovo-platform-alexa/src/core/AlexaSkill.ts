import { AudioData, BaseApp, HandleRequest, Host, Jovo, SpeechBuilder } from 'jovo-core';
import {
  AlexaAPI,
  BodyTemplate1,
  BodyTemplate2,
  BodyTemplate3,
  BodyTemplate6,
  BodyTemplate7,
  ListTemplate1,
  ListTemplate2,
  ListTemplate3,
} from '..';
import { AmazonProfileAPI } from '../services/AmazonProfileAPI';
import { EnumAlexaRequestType } from './alexa-enums';
import {
  AlexaRequest,
  Altitude,
  AuthorityResolution,
  Coordinate,
  Geolocation,
  Heading,
  LocationServices,
  LocationServicesAccess,
  LocationServicesStatus,
  PermissionStatus,
  Speed,
} from './AlexaRequest';

import { AlexaResponse } from './AlexaResponse';
import { AlexaSpeechBuilder } from './AlexaSpeechBuilder';
import { AlexaUser } from './AlexaUser';
import _get = require('lodash.get');
import _set = require('lodash.set');

export class AlexaSkill extends Jovo {
  $alexaSkill: AlexaSkill;
  // @ts-ignore
  $user: AlexaUser;

  constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest) {
    super(app, host, handleRequest);
    this.$alexaSkill = this;
    this.$response = new AlexaResponse();
    this.$speech = new AlexaSpeechBuilder(this);
    this.$reprompt = new AlexaSpeechBuilder(this);
  }

  /**
   * Returns Speechbuilder object initialized for the platform
   * @public
   * @return {SpeechBuilder}
   */
  speechBuilder(): AlexaSpeechBuilder {
    return this.getSpeechBuilder();
  }

  /**
   * Returns Speechbuilder object initialized for the platform
   * @public
   * @return {SpeechBuilder}
   */
  getSpeechBuilder(): AlexaSpeechBuilder {
    return new AlexaSpeechBuilder(this);
  }

  /**
   * Returns boolean if request is part of new session
   * @public
   * @return {boolean}
   */
  isNewSession(): boolean {
    return this.$request!.isNewSession();
  }

  /**
   * Returns timestamp of a user's request
   * @returns {string | undefined}
   */
  getTimestamp() {
    return this.$request!.getTimestamp();
  }

  /**
   * Returns locale of the request
   * @deprecated use this.$request.getLocale() instead
   * @returns {string}
   */
  getLocale(): string {
    return this.$request!.getLocale();
  }

  /**
   * Returns all entity resolutions for the slot name.
   * @param slotName
   */
  getEntityResolutions(slotName: string): AuthorityResolution[] {
    const alexaRequest: AlexaRequest = this.$request as AlexaRequest;
    return alexaRequest.getEntityResolutions(slotName);
  }

  /**
   * Returns true if there is a successful matched entity
   * @param slotName
   */
  hasEntityMatch(slotName: string): boolean {
    const alexaRequest: AlexaRequest = this.$request as AlexaRequest;
    return alexaRequest.hasEntityMatch(slotName);
  }

  /**
   * Returns array of successfully matched entities
   * @param slotName
   */
  getEntityMatches(slotName: string): AuthorityResolution[] {
    const alexaRequest: AlexaRequest = this.$request as AlexaRequest;
    return alexaRequest.getEntityMatches(slotName);
  }

  /**
   * Returns array of successfully matched dynamic entities
   * @param slotName
   */
  getDynamicEntityMatches(slotName: string): AuthorityResolution[] {
    const alexaRequest: AlexaRequest = this.$request as AlexaRequest;
    return alexaRequest.getDynamicEntityMatches(slotName);
  }

  /**
   * Returns array of successfully matched static entities
   * @param slotName
   */
  getStaticEntityMatches(slotName: string): AuthorityResolution[] {
    const alexaRequest: AlexaRequest = this.$request as AlexaRequest;
    return alexaRequest.getStaticEntityMatches(slotName);
  }

  /**
   * Returns UserID
   * @deprecated Use this.$user.getId() instead.
   * @public
   * @return {string}
   */
  getUserId(): string {
    return this.$user.getId();
  }

  /**
   * Sends an asynchronous speak directive
   * @param {string | SpeechBuilder} speech
   * @param {Function} callback
   * @return {Promise}
   */
  progressiveResponse(speech: string | SpeechBuilder, callback?: Function) {
    const alexaRequest: AlexaRequest = this.$request as AlexaRequest;
    if (callback) {
      AlexaAPI.progressiveResponse(
        speech,
        alexaRequest.getRequestId(),
        alexaRequest.getApiEndpoint(),
        alexaRequest.getApiAccessToken(),
      ).then(() => callback());
    } else {
      return AlexaAPI.progressiveResponse(
        speech,
        alexaRequest.getRequestId(),
        alexaRequest.getApiEndpoint(),
        alexaRequest.getApiAccessToken(),
      );
    }
  }

  /**
   * Makes a request to the amazon profile api
   * @public
   * @param {func} callback
   */
  requestAmazonProfile(callback?: Function) {
    const alexaRequest: AlexaRequest = this.$request as AlexaRequest;
    if (callback) {
      AmazonProfileAPI.requestAmazonProfile(alexaRequest.getAccessToken()).then(() => callback());
    } else {
      return AmazonProfileAPI.requestAmazonProfile(alexaRequest.getAccessToken());
    }
  }

  /**
   * Returns device id
   * @returns {string | undefined}
   */
  getDeviceId() {
    return _get(this.$request, 'context.System.device.deviceId');
  }

  /**
   * Returns audio capability of request device
   * @public
   * @return {boolean}
   */
  hasAudioInterface() {
    return this.$request!.hasAudioInterface();
  }

  /**
   * Returns screen capability of request device
   * @public
   * @return {boolean}
   */
  hasScreenInterface() {
    return this.$request!.hasScreenInterface();
  }

  /**
   * Returns screen capability of request device
   * @public
   * @return {boolean}
   */
  hasVideoInterface() {
    return this.$request!.hasVideoInterface();
  }

  /**
   * Returns APL capability of request device
   * @public
   * @return {boolean}
   */
  hasAPLInterface() {
    return (this.$request! as AlexaRequest).hasAPLInterface();
  }

  /**
   * Returns APLT capability of request device
   * @public
   * @return {boolean}
   */
  hasAPLTInterface() {
    return (this.$request! as AlexaRequest).hasAPLTInterface();
  }

  /**
   * Returns the amazon pay permission status
   * @public
   * @return {PermissionStatus | undefined}
   */
  getAmazonPayPermissionStatus(): PermissionStatus | undefined {
    return (this.$request! as AlexaRequest).getAmazonPayPermissionStatus();
  }

  /**
   * Returns true if the amazon pay permission was granted
   * @return {boolean}
   */
  isAmazonPayPermissionGranted(): boolean {
    return (this.$request! as AlexaRequest).isAmazonPayPermissionGranted();
  }

  /**
   * Returns true if the amazon pay permission was denied
   * @return {boolean}
   */
  isAmazonPayPermissionDenied(): boolean {
    return (this.$request! as AlexaRequest).isAmazonPayPermissionDenied();
  }

  /**
   * Returns geo location capability of request device
   * @public
   * @return {boolean}
   */
  hasGeoLocationInterface() {
    return (this.$request! as AlexaRequest).hasGeoLocationInterface();
  }

  /**
   * Returns the geolocation permission status
   * @return {PermissionStatus | undefined}
   */
  getGeoLocationPermissionStatus(): PermissionStatus | undefined {
    return (this.$request! as AlexaRequest).getGeoLocationPermissionStatus();
  }

  /**
   * Returns true if geolocation permission was denied
   * @return {boolean}
   */
  isGeoLocationPermissionDenied(): boolean {
    return (this.$request! as AlexaRequest).isGeoLocationPermissionDenied();
  }

  /**
   * Returns true if geolocation permission was granted
   * @return {boolean}
   */
  isGeoLocationPermissionGranted() {
    return (this.$request! as AlexaRequest).isGeoLocationPermissionGranted();
  }

  /**
   * Returns the whole geolocation object
   * @return {Geolocation | undefined}
   */
  getGeoLocationObject(): Geolocation | undefined {
    return (this.$request! as AlexaRequest).getGeoLocationObject();
  }

  /**
   * Returns geolocation timestamp
   * @return {string | undefined} ISO 8601
   */
  getGeoLocationTimestamp(): string | undefined {
    return (this.$request! as AlexaRequest).getGeoLocationTimestamp();
  }

  /**
   * Returns geolocation location services object
   * @return {LocationServices | undefined}
   */
  getLocationServicesObject(): LocationServices | undefined {
    return (this.$request! as AlexaRequest).getLocationServicesObject();
  }

  /**
   * Returns geolocation location services access
   * @return {LocationServicesAccess | undefined}
   */
  getLocationServicesAccess(): LocationServicesAccess | undefined {
    return (this.$request! as AlexaRequest).getLocationServicesAccess();
  }

  /**
   * Returns geolocation location services status
   * @return {LocationServicesStatus | undefined}
   */
  getLocationServicesStatus(): LocationServicesStatus | undefined {
    return (this.$request! as AlexaRequest).getLocationServicesStatus();
  }

  /**
   * Returns geolocation coordinate object
   * @return {Coordinate | undefined}
   */
  getCoordinateObject(): Coordinate | undefined {
    return (this.$request! as AlexaRequest).getCoordinateObject();
  }

  /**
   * Returns geolocation coordinate latitude in degrees
   * @return {number | undefined}	[-90.0, 90.0]
   */
  getCoordinateLatitude(): number | undefined {
    return (this.$request! as AlexaRequest).getCoordinateLatitude();
  }

  /**
   * Returns geolocation coordinate longitude in degrees
   * @return {number | undefined} [-180.0, 180]
   */
  getCoordinateLongitude(): number | undefined {
    return (this.$request! as AlexaRequest).getCoordinateLongitude();
  }

  /**
   * Returns geolocation coordinate accuracy in meters
   * @return {number | undefined} [0, MAX_INTEGER]
   */
  getCoordinateAccuracy(): number | undefined {
    return (this.$request! as AlexaRequest).getCoordinateAccuracy();
  }

  /**
   * Returns geolocation altitude object
   * @return {Altitude | undefined}
   */
  getAltitudeObject(): Altitude | undefined {
    return (this.$request! as AlexaRequest).getAltitudeObject();
  }

  /**
   * Returns geolocation altitude in meters
   * @return {number | undefined} [-6350, 18000]
   */
  getAltitude(): number | undefined {
    return (this.$request! as AlexaRequest).getAltitude();
  }

  /**
   * Returns geolocation altitude accuracy in meters
   * @return {number | undefined} [0, MAX_INTEGER]
   */
  getAltitudeAccuracy(): number | undefined {
    return (this.$request! as AlexaRequest).getAltitudeAccuracy();
  }

  /**
   * Returns geolocation heading object
   * @return {Heading | undefined}
   */
  getHeadingObject(): Heading | undefined {
    return (this.$request! as AlexaRequest).getHeadingObject();
  }

  /**
   * Returns geolocation heading direction in degrees
   * @return {number | undefined} (0.0, 360.0]
   */
  getHeadingDirection(): number | undefined {
    return (this.$request! as AlexaRequest).getHeadingDirection();
  }

  /**
   * Returns geolocation heading accuracy in degrees
   * @return {number | undefined} [0, MAX_INTEGER]
   */
  getHeadingAccuracy(): number | undefined {
    return (this.$request! as AlexaRequest).getHeadingAccuracy();
  }

  /**
   * Returns geolocation speed object
   * @return {Speed}
   */
  getSpeedObject(): Speed | undefined {
    return (this.$request! as AlexaRequest).getSpeedObject();
  }

  /**
   * Returns geolocation speed in meters per second
   * @return {number | undefined} [0, 1900]
   */
  getSpeed(): number | undefined {
    return (this.$request! as AlexaRequest).getSpeed();
  }

  /**
   * Returns geolocation speed accuracy in meters per second
   * @return {number | undefined} [0, MAX_INTEGER]
   */
  getSpeedAccuracy(): number | undefined {
    return (this.$request! as AlexaRequest).getSpeedAccuracy();
  }

  /**
   * Returns type of platform jovo implementation
   * @public
   * @return {string}
   */
  getType() {
    return 'AlexaSkill';
  }

  /**
   * Returns type of platform type
   * @public
   * @return {string}
   */
  getPlatformType() {
    return 'Alexa';
  }

  /**
   * Adds raw json directive to output object
   * @param directive
   */
  // tslint:disable-next-line
  addDirective(directive: any) {
    const directives = _get(this.$output, 'Alexa.Directives', []);
    directives.push(directive);
    _set(this.$output, 'Alexa.Directives', directives);
  }

  /**
   * Returns id of the touched/selected item
   * @public
   * @return {*}
   */
  getSelectedElementId() {
    return _get(this.$request, 'request.arguments') || _get(this.$request, 'request.token');
  }

  /**
   * Returns raw text.
   * Only available with catchAll slots
   * @return {String} rawText
   */
  getRawText() {
    if (!this.$inputs || this.$inputs.catchAll) {
      throw new Error('Only available with catchAll slot');
    }
    return _get(this, '$inputs.catchAll.value');
  }

  /**
   * Returns audio data of request.
   * Not supported by this platform.
   * @return {undefined}
   */
  getAudioData(): AudioData | undefined {
    return undefined;
  }

  /**
   * Returns template builder by type
   * @public
   * @param {string} type
   * @return {*}
   */
  templateBuilder(type: string) {
    if (type === 'BodyTemplate1') {
      return new BodyTemplate1();
    }
    if (type === 'BodyTemplate2') {
      return new BodyTemplate2();
    }
    if (type === 'BodyTemplate3') {
      return new BodyTemplate3();
    }
    if (type === 'BodyTemplate6') {
      return new BodyTemplate6();
    }
    if (type === 'BodyTemplate7') {
      return new BodyTemplate7();
    }
    if (type === 'ListTemplate1') {
      return new ListTemplate1();
    }
    if (type === 'ListTemplate2') {
      return new ListTemplate2();
    }
    if (type === 'ListTemplate3') {
      return new ListTemplate3();
    }
  }

  /**
   * Returns reason code for an end of a session
   *
   * @public
   * @return {*}
   */
  getEndReason() {
    return _get(this.$request, 'request.reason');
  }

  /**
   * Returns error object
   *
   * @public
   * @return {*}
   */
  getError() {
    return _get(this.$request, 'request.error');
  }

  /**
   * Returns skill id
   * @returns {string | undefined}
   */
  getSkillId(): string | undefined {
    return _get(this.$request, 'session.application.applicationId');
  }

  /**
   * Deletes shouldEndSession property
   * @public
   */
  deleteShouldEndSession(value = true) {
    _set(this.$output, 'Alexa.deleteShouldEndSession', value);
    return this;
  }

  /**
   * Sets value for shouldEndSession. Removes shouldEndSession when null
   * @public
   */
  shouldEndSession(value: boolean | null) {
    _set(this.$output, 'Alexa.shouldEndSession', value);
    return this;
  }

  /**
   * Returns true if the current request is of type ON_EVENT
   * @public
   * @return {boolean}
   */
  isEventRequest(): boolean {
    return this.$type.type === EnumAlexaRequestType.ON_EVENT;
  }

  /**
   * Returns true if the current request is of type ON_PURCHASE
   * @public
   * @return {boolean}
   */
  isPurchaseRequest(): boolean {
    return this.$type.type === EnumAlexaRequestType.ON_PURCHASE;
  }

  /**
   * Returns true if the current request is of type CAN_FULFILL_INTENT
   * @public
   * @return {boolean}
   */
  isCanFulfillIntentRequest(): boolean {
    return this.$type.type === EnumAlexaRequestType.CAN_FULFILL_INTENT;
  }

  /**
   * Returns true if the current request is of type PLAYBACKCONTROLLER
   * @public
   * @return {boolean}
   */
  isPlaybackControllerRequest(): boolean {
    return this.$type.type === EnumAlexaRequestType.PLAYBACKCONTROLLER;
  }

  /**
   * Returns true if the current request is of type ON_GAME_ENGINE_INPUT_HANDLER_EVENT
   * @public
   * @return {boolean}
   */
  isGameEngineInputHandlerEventRequest(): boolean {
    return this.$type.type === EnumAlexaRequestType.ON_GAME_ENGINE_INPUT_HANDLER_EVENT;
  }
}
