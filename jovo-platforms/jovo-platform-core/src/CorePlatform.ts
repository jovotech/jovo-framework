import {
  ActionSet,
  BaseApp,
  ExtensibleConfig,
  HandleRequest,
  Jovo,
  Platform,
  TestSuite,
} from 'jovo-core';
import { PlatformStorage } from 'jovo-db-platformstorage';
import _get = require('lodash.get');
import _merge = require('lodash.merge');
import _set = require('lodash.set');
import {
  CorePlatformApp,
  CorePlatformCore,
  CorePlatformRequest,
  CorePlatformRequestBuilder,
  CorePlatformRequestJSON,
  CorePlatformResponse,
  CorePlatformResponseBuilder,
} from '.';

export interface Config extends ExtensibleConfig {
  handlers?: any; // tslint:disable-line:no-any
}

export class CorePlatform extends Platform<CorePlatformRequest, CorePlatformResponse> {
  requestBuilder: CorePlatformRequestBuilder = new CorePlatformRequestBuilder();
  responseBuilder: CorePlatformResponseBuilder = new CorePlatformResponseBuilder();

  config: Config = {
    enabled: true,
  };

  constructor(config?: ExtensibleConfig) {
    super(config);

    if (config) {
      this.config = _merge(this.config, config);
    }

    this.actionSet = new ActionSet(
      [
        'setup',
        '$init',
        '$request',
        '$session',
        '$user',
        '$type',
        '$asr',
        '$nlu',
        '$inputs',
        '$tts.before',
        '$tts',
        '$output',
        '$response',
      ],
      this,
    );
  }

  getAppType(): string {
    return 'CorePlatformApp';
  }

  install(app: BaseApp): void {
    app.$platform.set(this.constructor.name, this);
    app.middleware('request')!.use(this.request.bind(this));
    app.middleware('platform.init')!.use(this.initialize.bind(this));
    app.middleware('asr')!.use(this.asr.bind(this));
    app.middleware('nlu')!.use(this.nlu.bind(this));
    app.middleware('before.tts')!.use(this.beforeTTS.bind(this));
    app.middleware('tts')!.use(this.tts.bind(this));
    app.middleware('platform.output')!.use(this.output.bind(this));
    app.middleware('response')!.use(this.response.bind(this));

    app.use(new PlatformStorage());

    this.use(new CorePlatformCore());

    Jovo.prototype.$corePlatformApp = undefined;
    Jovo.prototype.corePlatformApp = function() {
      if (this.constructor.name !== 'CorePlatformApp') {
        throw Error(`Can't handle request. Please use this.isCorePlatformApp()`);
      }
      return this as CorePlatformApp;
    };
    Jovo.prototype.isCorePlatformApp = function() {
      return this.constructor.name === 'CorePlatformApp';
    };
  }

  async request(handleRequest: HandleRequest) {
    const audioBase64String = (handleRequest.host.$request as CorePlatformRequestJSON).request.body
      .audio?.b64string;
    if (audioBase64String) {
      const samples = this.getSamplesFromAudio(audioBase64String);
      _set(handleRequest.host.$request, 'request.body.audio.data', samples);
    }
  }

  async initialize(handleRequest: HandleRequest) {
    handleRequest.platformClazz = CorePlatformApp;
    await this.middleware('$init')!.run(handleRequest);

    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'CorePlatformApp') {
      return Promise.resolve();
    }

    await this.middleware('$request')!.run(handleRequest.jovo);
    await this.middleware('$type')!.run(handleRequest.jovo);
    await this.middleware('$session')!.run(handleRequest.jovo);

    if (this.config.handlers) {
      _set(
        handleRequest.app,
        'config.handlers',
        _merge(_get(handleRequest.app, 'config.handlers'), this.config.handlers),
      );
    }
  }

  async asr(handleRequest: HandleRequest) {
    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'CorePlatformApp') {
      return Promise.resolve();
    }
    await this.middleware('$asr')!.run(handleRequest.jovo);
  }

  async nlu(handleRequest: HandleRequest) {
    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'CorePlatformApp') {
      return Promise.resolve();
    }
    await this.middleware('$nlu')!.run(handleRequest.jovo);
    await this.middleware('$inputs')!.run(handleRequest.jovo);
  }

  async beforeTTS(handleRequest: HandleRequest) {
    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'CorePlatformApp') {
      return Promise.resolve();
    }
    await this.middleware('$tts.before')!.run(handleRequest.jovo);
  }

  async tts(handleRequest: HandleRequest) {
    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'CorePlatformApp') {
      return Promise.resolve();
    }
    await this.middleware('$tts')!.run(handleRequest.jovo);
  }

  async output(handleRequest: HandleRequest) {
    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'CorePlatformApp') {
      return Promise.resolve();
    }
    await this.middleware('$output')!.run(handleRequest.jovo);
  }

  async response(handleRequest: HandleRequest) {
    if (!handleRequest.jovo || handleRequest.jovo.constructor.name !== 'CorePlatformApp') {
      return Promise.resolve();
    }
    await this.middleware('$response')!.run(handleRequest.jovo);

    await handleRequest.host.setResponse(handleRequest.jovo.$response);
  }

  makeTestSuite(): TestSuite<CorePlatformRequestBuilder, CorePlatformResponseBuilder> {
    return new TestSuite(new CorePlatformRequestBuilder(), new CorePlatformResponseBuilder());
  }

  private getSamplesFromAudio(base64: string): Float32Array {
    const binaryBuffer = Buffer.from(base64, 'base64').toString('binary');
    const length = binaryBuffer.length / Float32Array.BYTES_PER_ELEMENT;
    const view = new DataView(new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT));
    const samples = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      const p = i * 4;
      view.setUint8(0, binaryBuffer.charCodeAt(p));
      view.setUint8(1, binaryBuffer.charCodeAt(p + 1));
      view.setUint8(2, binaryBuffer.charCodeAt(p + 2));
      view.setUint8(3, binaryBuffer.charCodeAt(p + 3));
      samples[i] = view.getFloat32(0, true);
    }
    return samples;
  }
}
