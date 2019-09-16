import { Input, JovoRequest, SessionData, Inputs, SessionConstants } from "jovo-core";
import _get = require('lodash.get');
import _set = require('lodash.set');

export interface SAPCAIInput extends Input {
    sapcaiSkill: {
        raw?: string;
        confidence: number;
        source?: string;
    };
}

export interface SAPCAIInput {
    sapcaiSkill: {
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
    entities?: { [key: string]: any };
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
    memory?: { [key: string]: any };
    skill?: string;
    skill_occurences?: number;
}

export interface SAPCAIRequestJSON {
    nlp?: NLP;
    qna?: any;
    messages?: any[];
    conversation?: Conversation;
    hasDelay?: boolean;
    hasNextMessage?: boolean;
}

/**
 * Thanks to @see http://choly.ca/post/typescript-json/
 */

export class SAPCAIRequest implements JovoRequest {
    nlp?: NLP;
    qna?: any;
    messages?: any[];
    conversation?: Conversation;
    hasDelay?: boolean;
    hasNextMessage?: boolean;

    // JovoRequest implementation

    getAlexaDevice(): string {
        let device = 'SAPCAI Web - voice only';
        return device;
    }

    getScreenResolution(): string | undefined {
        //TODO
        let resolution;
        return resolution;
    }


    getSessionId(): string | undefined {
        //TODO
        let sessionID;
        if (this.nlp) {
            sessionID = this.nlp.uuid;
        }
        return sessionID;
    }

    getAccessToken() {
        //TODO
        return _get(this, 'context.System.user.accessToken');
    }

    getInputValue( input: any, type: string ): any {
        let ret : any = {};
        ret.gold = true;

        if( type === 'bearing' ) {
            ret.value = input.bearing;
            ret.type = 'bearing';
        } else if ( type === 'color' ) {
            ret.value = input.hex
            ret.type = 'color'
        } else if ( type === 'datetime' ) {
            ret.value = new Date(input.iso)
            ret.type = 'datetime'
        } else if ( type === 'distance' ) {
            ret.value = input.meters
            ret.type = 'distance'
        } else if ( type === 'duration' ) {
            ret.value = input.seconds
            ret.type = 'duration'
        } else if ( type === 'email' ) {
            ret.value = input.raw
            ret.type = 'email'
        } else if ( type === 'emoji' ) {
            ret.value = input.unicode
            ret.type = 'emoji'
        } else if ( type === 'ip' ) {
            ret.value = input.raw
            ret.type = 'ip'
        } else if ( type === 'interval' ) {
            ret.value = input.timespan
            ret.type = 'interval'
        } else if ( type === 'job' ) {
            ret.value = input.raw
            ret.type = 'job'
        } else if ( type === 'language' ) {
            ret.value = input.short
            ret.type = 'language'
        } else if ( type === 'location' ) {
            ret.value = input.formatted
            ret.type = 'location'
        } else if ( type === 'mass' ) {
            ret.value = input.grams
            ret.type = 'mass'
        } else if ( type === 'money' ) {
            ret.value = input.dollars
            ret.type = 'money'
        } else if ( type === 'nationality' ) {
            ret.value = input.dollars
            ret.type = 'nationality'
        } else if ( type === 'number' ) {
            ret.value = input.scalar
            ret.type = 'number'
        } else if ( type === 'ordinal' ) {
            ret.value = input.rank
            ret.type = 'ordinal'
        } else if ( type === 'organization' ) {
            ret.value = input.raw
            ret.type = 'organization'
        } else if ( type === 'percent' ) {
            ret.value = input.percent
            ret.type = 'organization'
        } else if ( type === 'person' ) {
            ret.value = input.fullname
            ret.type = 'person'
        } else if ( type === 'phone' ) {
            ret.value = input.number
            ret.type = 'phone'
        } else if ( type === 'pronoun' ) {
            ret.value = input.raw
            ret.type = 'pronoun'
        } else if ( type === 'set' ) {
            ret.value = input.raw
            ret.type = 'set'
        } else if ( type === 'sort' ) {
            ret.value = input.raw
            ret.type = 'sort'
        } else if ( type === 'speed' ) {
            ret.value = input.mps
            ret.type = 'speed'
        } else if ( type === 'temperature' ) {
            ret.value = input.celsius
            ret.type = 'temperature'
        } else if ( type === 'url' ) {
            ret.value = input.raw
            ret.type = 'url'
        } else if ( type === 'volume' ) {
            ret.value = input.liters
            ret.type = 'volume'
        } else {
            ret.value = input.raw
            ret.type = null
            ret.gold = false;
        }

        return ret;
    }

    getMemoryInputMeta(memoryInput: any, entities: { [key:string]:any[] } ): any {
        let meta = null;
        for (let [entityType, entityArray] of Object.entries(entities)) {
            for (let [entityIndex, entity] of Object.entries(entityArray)) {
                let entityMeta = this.getInputValue(entity, entityType);
                if( memoryInput.raw === entity.raw ) {
                    meta = entityMeta
                    return meta;
                }
            }
        }
        return meta;
    }

    getInputs(): Inputs {
        const inputs: Inputs = {};
        const entities = this.getEntities();
        const memoryInputs : any[] = this.getMemoryInputs();
        
        // First of all parse entities
        if( entities ) {
            for (let [entityType, entityArray] of Object.entries(entities)) {
                for (let [entityIndex, entity] of entityArray.entries()) {
                    let entityKey = `${entityType}_${entityIndex}`;
                    let entityMeta = this.getInputValue(entity, entityType);
                    let entityObj = entity;
                    entityObj.source = 'entity';
                    entityObj.type = entityMeta.type;
                    entityObj.gold = entityMeta.gold;
    
                    const input: SAPCAIInput = {
                        name: entityKey,
                        key: entityKey,
                        value: entityMeta.value,
                        id: entityKey,
                        sapcaiSkill: entityObj
                    };
    
                    inputs[entityKey] = input;
                }
            }
        }
        
        if( memoryInputs ) {
            // We need to mix both entities and memory input (from requirements)
            for (let [memoryInputsName, memoryInput] of Object.entries(memoryInputs)) {
                // Every memory input should be (as far as I know) matched by an entity. 
                // To understand which
                let meta : any = {};
                if( memoryInput.confidence ) {
                    // this is an entity representation
                    // Let's cycle all the entities and check if the raw value is the same

                    let memoryInputMeta = this.getMemoryInputMeta(memoryInput, entities);
                    if( !memoryInputMeta ) {
                        meta.value = memoryInput.raw;
                        meta.type = null;
                        meta.gold = false;
                    } else {
                        meta = memoryInputMeta;
                    }

                    let entityObj = memoryInput;
                    entityObj.source = 'memory';
                    entityObj.type = meta.type;
                    entityObj.gold = meta.gold;

                    const input: SAPCAIInput = {
                        name: memoryInputsName,
                        key: memoryInputsName,
                        value: meta.value,
                        id: memoryInputsName,
                        sapcaiSkill: entityObj
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

            //TODO
            //TODO
            const slot: Entity = {
                raw: input.name!,
                scalar: input.value
            };

            const sapcaiInput = input as SAPCAIInput;

            if (sapcaiInput.sapcaiSkill) {
                _set(this, `conversation.memory[${input.name}]`, sapcaiInput.sapcaiSkill);
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
    
    addSessionData(key: string, value: any): this { // tslint:disable-line
        return this.addSessionAttribute(key, value);
    }

    getSessionAttributes() {
        return _get(this, 'conversation.memory');
    }

    getTimestamp() {
        return _get(this, 'nlp.timestamp');
    }

    getUserId() {
        //TODO
        return _get(this, 'nlp.uuid')
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

    /**
     * Returns video capability of request device
     * @return {boolean}
     */
    hasVideoInterface() {
        //TODO
        return true;
    }

    isNewSession() {
        //TODO
        return true;
    }

    // Jovo Request -- SETTER

    setLocale(locale: string) {
        //TODO
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


    addSessionAttribute(key: string, value: any) { // tslint:disable-line
        if (this.getSessionAttributes()) {
            _set(this, `conversation.memory.${key}`, value);
        }
        return this;
    }


    setUserId(userId: string) {
        //TODO
        _set(this, 'nlp.uuid', userId);
        return this;
    }

    setAccessToken(accessToken: string) {
        //TODO
        return this;
    }


    setNewSession(isNew: boolean) {
        //TODO
        return this;
    }

    setTimestamp(timestamp: string) {
        //TODO
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
        //TODO
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
        //TODO
        if (typeof value === 'string') {
            _set(this, `conversation.memorys.${key}`, {
                name: key,
                value
            });
        } else {
            _set(this, `conversation.memory.${key}`, value);
        }

        return this;
    }

    toJSON(): SAPCAIRequestJSON {
        // copy all fields from `this` to an empty object and return in
        return Object.assign({}, this);
    }

    // Alexa Request HELPER

    getIntentName() {
        return _get(this, 'conversation.skill');
    }

    getEntities(): { [key:string]:any[] } {
        return _get(this, 'nlp.entities');
    }

    getEntity(name: string): any[] {
        return _get(this, `nlp.entities.${name}`);
    }

    setEntities(entities: { [key:string]:any[] }) { // tslint:disable-line
        _set(this, `nlp.entities`, entities);
        return this;
    }

    setEntity(name: string, value: any[]) {
        _set(this, `nlp.entities.${name}`, value);
        return this;
    }

    getMemoryInputs(): any[] {
        return _get(this, 'conversation.memory');
    }

    getMemoryInput(name: string): any | undefined {
        return _get(this, `conversation.memory.${name}`);
    }

    setMemoryInputs(entities: any[]) { // tslint:disable-line
        _set(this, `conversation.memory`, entities);
        return this;
    }

    setMemoryInput(name: string, value: any) {
        _set(this, `conversation.memory.${name}`, value);
        return this;
    }

    setIntentName(intentName: string) {
        if (this.getIntentName()) {
            _set(this, 'conversation.skill', intentName);
        }
        return this;
    }

    // fromJSON is used to convert an serialized version
    // of the User to an instance of the class
    static fromJSON(json: SAPCAIRequestJSON | string): SAPCAIRequest {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, SAPCAIRequest.reviver);
        } else {
            // create an instance of the User class
            const sapcaiRequest = Object.create(SAPCAIRequest.prototype);
            // copy all the fields from the json object
            return Object.assign(sapcaiRequest, json);
        }
    }

    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call User.fromJSON on the resulting value.
    static reviver(key: string, value: any): any { //tslint:disable-line
        return key === "" ? SAPCAIRequest.fromJSON(value) : value;
    }

}
