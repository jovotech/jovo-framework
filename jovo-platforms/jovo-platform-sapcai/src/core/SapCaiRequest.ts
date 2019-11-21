import { Input, Inputs, JovoRequest, SessionConstants, SessionData } from 'jovo-core';
import { EntityValue, Message } from './Interfaces';
import { NEW_SESSION_KEY } from '../index';
import _get = require('lodash.get');
import _set = require('lodash.set');

export interface SapCaiInput extends Input {
  caiSkill: {
    raw?: string;
    confidence: number;
    source?: string;
  };
}

export interface Intent {
  slug?: string;
  confidence?: number;
  description?: string;
}

export interface Entity {
  scalar?: number;
  raw?: string;
  confidence?: number;
}

export interface NLP {
  uuid?: string;
  intents?: Intent[];
  entities?: Record<string, Entity>;
  language?: string;
  processing_language?: string;
  timestamp?: string;
  status?: number;
  source?: string;
  act?: string;
  type?: string;
  sentiment?: string;
}

export interface Conversation {
  id?: string;
  language?: string;
  // tslint:disable-next-line:no-any
  memory?: Record<string, any>;
  skill?: string;
  skill_occurences?: number;
}

export interface SapCaiRequestJSON {
  nlp?: NLP;
  // tslint:disable-next-line:no-any
  qna?: Record<string, any>;
  messages?: Message[];
  conversation?: Conversation;
  hasDelay?: boolean;
  hasNextMessage?: boolean;
}

export class SapCaiRequest implements JovoRequest {
  nlp?: NLP;
  // tslint:disable-next-line:no-any
  qna?: Record<string, any>;
  messages?: Message[];
  conversation?: Conversation;
  hasDelay?: boolean;
  hasNextMessage?: boolean;

  // of the User to an instance of the class
  static fromJSON(json: SapCaiRequestJSON | string): SapCaiRequest {
    if (typeof json === 'string') {
      // if it's a string, parse it first
      return JSON.parse(json, SapCaiRequest.reviver);
    } else {
      // create an instance of the User class
      const request = Object.create(SapCaiRequest.prototype);
      // copy all the fields from the json object
      return Object.assign(request, json);
    }
  }

  // tslint:disable-next-line:no-any
  static reviver(key: string, value: any): any {
    //tslint:disable-line
    return key === '' ? SapCaiRequest.fromJSON(value) : value;
  }

  getSessionId(): string | undefined {
    return _get(this, 'conversation.id');
  }

  getAccessToken() {
    return undefined;
  }

  // tslint:disable-next-line:no-any
  getEntityValue(input: any, type: string): EntityValue {
    let isBuiltInEntity = true;
    let value = undefined;

    switch (type) {
      case 'bearing':
        value = input.bearing;
        break;
      case 'color':
        value = input.hex;
        break;
      case 'datetime':
        value = new Date(input.iso);
        break;
      case 'distance':
        value = input.meters;
        break;
      case 'duration':
        value = input.seconds;
        break;
      case 'emoji':
        value = input.unicode;
        break;
      case 'interval':
        value = input.timespan;
        break;
      case 'language':
        value = input.short;
        break;
      case 'location':
        value = input.formatted;
        break;
      case 'mass':
        value = input.grams;
        break;
      case 'money':
      // TODO make sure nationality really provides 'dollars'
      case 'nationality':
        value = input.dollars;
        break;
      case 'number':
        value = input.scalar;
        break;
      case 'ordinal':
        value = input.rank;
        break;
      case 'percent':
        value = input.percent;
        break;
      case 'person':
        value = input.fullname;
        break;
      case 'phone':
        value = input.number;
        break;
      case 'speed':
        value = input.mps;
        break;
      case 'temperature':
        value = input.celsius;
        break;
      case 'volume':
        value = input.liters;
        break;
      case 'email':
      case 'ip':
      case 'job':
      case 'organization':
      case 'pronoun':
      case 'set':
      case 'sort':
      case 'url':
        value = input.raw;
        break;
      default:
        isBuiltInEntity = false;
        break;
    }
    return { isBuiltInEntity, value, type: type || null };
  }

  // tslint:disable-next-line:no-any
  getMemoryInputMeta(memoryInput: any, entities: Record<string, any>): any {
    let meta = null;
    for (const [entityType, entityArray] of Object.entries(entities)) {
      for (const [entityIndex, entity] of Object.entries(entityArray)) {
        const entityMeta = this.getEntityValue(entity, entityType);
        // tslint:disable-next-line:no-any
        if (memoryInput.raw === (entity as any).raw) {
          meta = entityMeta;
          return meta;
        }
      }
    }
    return meta;
  }

  getInputs(): Inputs {
    const inputs: Inputs = {};
    const entities = this.getEntities();
    // tslint:disable-next-line:no-any
    const memoryInputs: any[] = this.getMemoryInputs();

    // First of all parse entities
    if (entities) {
      for (const [entityType, entityArray] of Object.entries(entities)) {
        for (const [entityIndex, entity] of entityArray.entries()) {
          const entityKey = `${entityType}_${entityIndex}`;
          const entityMeta = this.getEntityValue(entity, entityType);
          const entityObj = {
            ...entity,
            type: entityMeta.type,
            isBuiltInEntity: entityMeta.isBuiltInEntity,
            source: 'entity',
          };

          const input: SapCaiInput = {
            name: entityKey,
            key: entityKey,
            value: entityMeta.value,
            id: entityKey,
            caiSkill: entityObj,
          };

          inputs[entityKey] = input;
        }
      }
    }

    if (memoryInputs) {
      // We need to mix both entities and memory input (from requirements)
      for (const [memoryInputsName, memoryInput] of Object.entries(memoryInputs)) {
        // Every memory input should be (as far as I know) matched by an entity.
        // To understand which
        // tslint:disable-next-line:no-any
        let meta: any = {};
        if (memoryInput.confidence) {
          // this is an entity representation
          // Let's cycle all the entities and check if the raw value is the same

          const memoryInputMeta = this.getMemoryInputMeta(memoryInput, entities);
          if (!memoryInputMeta) {
            meta.value = memoryInput.raw;
            meta.type = null;
            meta.gold = false;
          } else {
            meta = memoryInputMeta;
          }

          const entityObj = memoryInput;
          entityObj.source = 'memory';
          entityObj.type = meta.type;
          entityObj.gold = meta.gold;

          const input: SapCaiInput = {
            name: memoryInputsName,
            key: memoryInputsName,
            value: meta.value,
            id: memoryInputsName,
            caiSkill: entityObj,
          };

          inputs[memoryInputsName] = input;
        }
      }
    }
    return inputs;
  }

  setInputs(inputs: Inputs): this {
    Object.keys(inputs).forEach((key: string) => {
      const input: Input = inputs[key];

      const slot: Entity = {
        raw: input.name!,
        scalar: input.value,
      };

      const sapcaiInput = input as SapCaiInput;

      if (sapcaiInput.caiSkill) {
        _set(this, `conversation.memory[${input.name}]`, sapcaiInput.caiSkill);
      } else {
        _set(this, `conversation.memory[${input.name}]`, slot);
      }
    });

    return this;
  }

  getLocale(): string {
    return this.nlp!.language!;
  }

  getLanguage(): string {
    return this.getLocale();
  }

  getSessionData() {
    return this.getSessionAttributes();
  }

  getState() {
    return _get(this.getSessionAttributes(), SessionConstants.STATE);
  }

  setSessionData(sessionData: SessionData): this {
    return this.setSessionAttributes(sessionData);
  }

  // tslint:disable-next-line:no-any
  addSessionData(key: string, value: any): this {
    return this.addSessionAttribute(key, value);
  }

  getSessionAttributes() {
    return _get(this, 'conversation.memory');
  }

  getTimestamp() {
    return _get(this, 'nlp.timestamp');
  }

  getUserId() {
    return _get(this, 'nlp.uuid');
  }

  /**
   * Returns audio capability of request device
   * @return {boolean}
   */
  hasAudioInterface() {
    //TODO
    return true;
  }

  /**
   * Returns screen capability of request device
   * @return {boolean}
   */
  hasScreenInterface() {
    //TODO
    return true;
  }

  // Jovo Request -- SETTER

  /**
   * Returns video capability of request device
   * @return {boolean}
   */
  hasVideoInterface() {
    //TODO
    return true;
  }

  isNewSession() {
    return _get(this.getSessionAttributes(), NEW_SESSION_KEY, true);
  }

  setLocale(locale: string) {
    if (_get(this, `nlp.language`)) {
      _set(this, 'nlp.language', locale);
    }
    return this;
  }

  setScreenInterface() {
    //TODO
    return this;
  }

  setVideoInterface() {
    //TODO
    return this;
  }

  setSessionAttributes(attributes: SessionData): this {
    if (this.getSessionAttributes()) {
      _set(this, 'conversation.memory', attributes);
    }
    return this;
  }

  // tslint:disable-next-line:no-any
  addSessionAttribute(key: string, value: any) {
    // tslint:disable-line
    if (this.getSessionAttributes()) {
      _set(this, `conversation.memory.${key}`, value);
    }
    return this;
  }

  setUserId(userId: string) {
    _set(this, 'nlp.uuid', userId);
    return this;
  }

  setAccessToken(accessToken: string) {
    //TODO
    return this;
  }

  setNewSession(isNew: boolean) {
    _set(this, `conversation.memory[${NEW_SESSION_KEY}]`, isNew);
    return this;
  }

  setTimestamp(timestamp: string) {
    if (_get(this, `nlp.timestamp`)) {
      _set(this, 'nlp.timestamp', timestamp);
    }
    return this;
  }

  /**
   * Sets sessionId for the request
   * @param sessionId
   */
  setSessionId(sessionId: string) {
    _set(this, 'conversation.id', sessionId);
    return this;
  }

  setAudioInterface() {
    //TODO
    return this;
  }

  setState(state: string) {
    if (_get(this, 'conversation.memory')) {
      _set(this, `conversation.memory[${SessionConstants.STATE}]`, state);
    }
    return this;
  }

  addInput(key: string, value: string | object) {
    if (typeof value === 'string') {
      _set(this, `conversation.memory.${key}`, {
        name: key,
        value,
      });
    } else {
      _set(this, `conversation.memory.${key}`, value);
    }

    return this;
  }

  toJSON(): SapCaiRequestJSON {
    // copy all fields from `this` to an empty object and return in
    return Object.assign({}, this);
  }

  getIntentName() {
    return _get(this, 'conversation.skill');
  }

  // tslint:disable-next-line:no-any
  getEntities(): Record<string, any> {
    return _get(this, 'nlp.entities');
  }

  // tslint:disable-next-line:no-any
  getEntity(name: string): any[] {
    return _get(this, `nlp.entities.${name}`);
  }

  // tslint:disable-next-line:no-any
  setEntities(entities: Record<string, any>) {
    // tslint:disable-line
    _set(this, `nlp.entities`, entities);
    return this;
  }

  // tslint:disable-next-line:no-any
  setEntity(name: string, value: any[]) {
    _set(this, `nlp.entities.${name}`, value);
    return this;
  }

  // tslint:disable-next-line:no-any
  getMemoryInputs(): any[] {
    return _get(this, 'conversation.memory');
  }

  // tslint:disable-next-line:no-any
  getMemoryInput(name: string): any | undefined {
    return _get(this, `conversation.memory.${name}`);
  }

  // tslint:disable-next-line:no-any
  setMemoryInputs(entities: any[]) {
    _set(this, `conversation.memory`, entities);
    return this;
  }

  // fromJSON is used to convert an serialized version

  // tslint:disable-next-line:no-any
  setMemoryInput(name: string, value: any) {
    _set(this, `conversation.memory.${name}`, value);
    return this;
  }

  // reviver can be passed as the second parameter to JSON.parse
  // to automatically call User.fromJSON on the resulting value.

  setIntentName(intentName: string) {
    if (this.getIntentName()) {
      _set(this, 'conversation.skill', intentName);
    }
    return this;
  }

  getDeviceName(): string | undefined {
    return;
  }
}
