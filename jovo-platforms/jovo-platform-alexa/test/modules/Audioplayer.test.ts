import { HandleRequest, JovoRequest, TestSuite, SessionConstants } from 'jovo-core';
import { App, ExpressJS } from 'jovo-framework';
import { Alexa } from '../../src';
import _get = require('lodash.get');
import _set = require('lodash.set');

process.env.NODE_ENV = 'UNIT_TEST';
let app: App;
let t: TestSuite;
jest.setTimeout(550);
const delay = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};

beforeEach(() => {
  app = new App();
  const alexa = new Alexa();
  app.use(alexa);
  t = alexa.makeTestSuite();
});

describe('test audioplayer functions', () => {
  test('test play', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.$alexaSkill!.$audioPlayer!.play('https://url.to.audio', 'tokenABC');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      const response = handleRequest.jovo!.$response;
      expect(_get(response, 'response.directives[0].type')).toEqual('AudioPlayer.Play');
      expect(_get(response, 'response.shouldEndSession')).toEqual(true);

      expect(_get(response, 'response.directives[0].playBehavior')).toEqual('REPLACE_ALL');
      expect(_get(response, 'response.directives[0].audioItem.stream.url')).toEqual(
        'https://url.to.audio',
      );
      expect(_get(response, 'response.directives[0].audioItem.stream.token')).toEqual('tokenABC');
      expect(
        _get(response, 'response.directives[0].audioItem.stream.offsetInMilliseconds'),
      ).toEqual(0);

      done();
    });
  });

  test('test play with setMetaData', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.$alexaSkill!.$audioPlayer!.setMetaData({
          title: 'ArtWork Title',
          subtitle: 'ArtWork Subtitle',
          backgroundImage: {
            sources: [
              {
                url: 'https://www.url.to/image.jpg',
              },
            ],
          },
          art: {
            sources: [
              {
                url: 'https://www.url.to/image2.jpg',
              },
            ],
          },
        });
        this.$alexaSkill!.$audioPlayer!.play('https://url.to.audio', 'tokenABC');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      const response = handleRequest.jovo!.$response;
      expect(_get(response, 'response.directives[0].type')).toEqual('AudioPlayer.Play');
      expect(_get(response, 'response.shouldEndSession')).toEqual(true);

      expect(_get(response, 'response.directives[0].playBehavior')).toEqual('REPLACE_ALL');
      expect(_get(response, 'response.directives[0].audioItem.stream.url')).toEqual(
        'https://url.to.audio',
      );
      expect(_get(response, 'response.directives[0].audioItem.stream.token')).toEqual('tokenABC');
      expect(
        _get(response, 'response.directives[0].audioItem.stream.offsetInMilliseconds'),
      ).toEqual(0);

      expect(_get(response, 'response.directives[0].audioItem.metadata.title')).toEqual(
        'ArtWork Title',
      );
      expect(_get(response, 'response.directives[0].audioItem.metadata.subtitle')).toEqual(
        'ArtWork Subtitle',
      );
      expect(
        _get(response, 'response.directives[0].audioItem.metadata.backgroundImage.sources[0].url'),
      ).toEqual('https://www.url.to/image.jpg');
      expect(
        _get(response, 'response.directives[0].audioItem.metadata.art.sources[0].url'),
      ).toEqual('https://www.url.to/image2.jpg');

      done();
    });
  });

  test('test startOver', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.$alexaSkill!.$audioPlayer!.startOver('https://url.to.audio', 'tokenXYZ');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      const response = handleRequest.jovo!.$response;
      expect(_get(response, 'response.directives[0].type')).toEqual('AudioPlayer.Play');
      expect(_get(response, 'response.directives[0].playBehavior')).toEqual('ENQUEUE');
      expect(_get(response, 'response.directives[0].audioItem.stream.url')).toEqual(
        'https://url.to.audio',
      );
      expect(_get(response, 'response.directives[0].audioItem.stream.token')).toEqual('tokenXYZ');
      expect(
        _get(response, 'response.directives[0].audioItem.stream.offsetInMilliseconds'),
      ).toEqual(0);

      done();
    });
  });

  test('test enqueue', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.$alexaSkill!.$audioPlayer!.enqueue('https://url.to.audio', 'tokenDEF');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      const response = handleRequest.jovo!.$response;
      expect(_get(response, 'response.directives[0].type')).toEqual('AudioPlayer.Play');
      expect(_get(response, 'response.directives[0].playBehavior')).toEqual('ENQUEUE');
      expect(_get(response, 'response.directives[0].audioItem.stream.url')).toEqual(
        'https://url.to.audio',
      );
      expect(_get(response, 'response.directives[0].audioItem.stream.token')).toEqual('tokenDEF');
      expect(
        _get(response, 'response.directives[0].audioItem.stream.offsetInMilliseconds'),
      ).toEqual(0);

      done();
    });
  });

  test('test stop', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.$alexaSkill!.$audioPlayer!.stop();
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      const response = handleRequest.jovo!.$response;
      expect(_get(response, 'response.directives[0].type')).toEqual('AudioPlayer.Stop');
      expect(_get(response, 'response.shouldEndSession')).toEqual(true);

      done();
    });
  });

  test('test clearQueue (CLEAR_ALL)', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.$alexaSkill!.$audioPlayer!.clearQueue();
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      const response = handleRequest.jovo!.$response;
      expect(_get(response, 'response.directives[0].type')).toEqual('AudioPlayer.ClearQueue');
      expect(_get(response, 'response.shouldEndSession')).toEqual(true);
      expect(_get(response, 'response.directives[0].clearBehavior')).toEqual('CLEAR_ALL');

      done();
    });
  });

  test('test clearQueue (CLEAR_ENQUEUED)', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.$alexaSkill!.$audioPlayer!.clearQueue('CLEAR_ENQUEUED');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      const response = handleRequest.jovo!.$response;
      expect(_get(response, 'response.directives[0].type')).toEqual('AudioPlayer.ClearQueue');
      expect(_get(response, 'response.shouldEndSession')).toEqual(true);
      expect(_get(response, 'response.directives[0].clearBehavior')).toEqual('CLEAR_ENQUEUED');

      done();
    });
  });
});
describe('test audioplayer events', () => {
  test('test AudioPlayer.PlaybackStarted', async (done) => {
    app.setHandler({
      AUDIOPLAYER: {
        'AlexaSkill.PlaybackStarted'() {
          expect(this.$alexaSkill!.$audioPlayer!.getOffsetInMilliseconds()).toEqual(0);
          expect(this.$alexaSkill!.$audioPlayer!.getToken()).toEqual('silence');
          done();
        },
      },
    });

    const audioPlayerRequest: JovoRequest = await t.requestBuilder.audioPlayerRequest();
    app.handle(ExpressJS.dummyRequest(audioPlayerRequest));
  });

  test('test AudioPlayer.PlaybackNearlyFinished', async (done) => {
    app.setHandler({
      AUDIOPLAYER: {
        'AlexaSkill.PlaybackNearlyFinished'() {
          expect(this.$alexaSkill!.$audioPlayer!.getOffsetInMilliseconds()).toEqual(2000);
          expect(this.$alexaSkill!.$audioPlayer!.getToken()).toEqual('silence');
          done();
        },
      },
    });

    const audioPlayerRequest: JovoRequest = await t.requestBuilder.audioPlayerRequest();
    _set(audioPlayerRequest, 'context.AudioPlayer.offsetInMilliseconds', 2000);
    _set(audioPlayerRequest, 'request.type', 'AudioPlayer.PlaybackNearlyFinished');
    _set(audioPlayerRequest, 'request.offsetInMilliseconds', 2000);

    app.handle(ExpressJS.dummyRequest(audioPlayerRequest));
  });

  test('test AudioPlayer.PlaybackFinished', async (done) => {
    app.setHandler({
      AUDIOPLAYER: {
        'AlexaSkill.PlaybackFinished'() {
          expect(this.$alexaSkill!.$audioPlayer!.getOffsetInMilliseconds()).toEqual(2000);
          expect(this.$alexaSkill!.$audioPlayer!.getToken()).toEqual('silence');
          done();
        },
      },
    });

    const audioPlayerRequest: JovoRequest = await t.requestBuilder.audioPlayerRequest();
    _set(audioPlayerRequest, 'context.AudioPlayer.offsetInMilliseconds', 2000);
    _set(audioPlayerRequest, 'request.type', 'AudioPlayer.PlaybackFinished');
    _set(audioPlayerRequest, 'request.offsetInMilliseconds', 2000);

    app.handle(ExpressJS.dummyRequest(audioPlayerRequest));
  });

  test('test AudioPlayer.PlaybackStopped', async (done) => {
    app.setHandler({
      AUDIOPLAYER: {
        'AlexaSkill.PlaybackStopped'() {
          expect(this.$alexaSkill!.$audioPlayer!.getOffsetInMilliseconds()).toEqual(2000);
          expect(this.$alexaSkill!.$audioPlayer!.getToken()).toEqual('silence');
          done();
        },
      },
    });

    const audioPlayerRequest: JovoRequest = await t.requestBuilder.audioPlayerRequest();
    _set(audioPlayerRequest, 'context.AudioPlayer.offsetInMilliseconds', 2000);
    _set(audioPlayerRequest, 'request.type', 'AudioPlayer.PlaybackStopped');
    _set(audioPlayerRequest, 'request.offsetInMilliseconds', 2000);

    app.handle(ExpressJS.dummyRequest(audioPlayerRequest));
  });

  test('test AudioPlayer.PlaybackFailed', async (done) => {
    app.setHandler({
      AUDIOPLAYER: {
        'AlexaSkill.PlaybackFailed'() {
          expect(this.$alexaSkill!.$audioPlayer!.getOffsetInMilliseconds()).toEqual(2000);
          expect(this.$alexaSkill!.$audioPlayer!.getToken()).toEqual('silence');
          done();
        },
      },
    });

    const audioPlayerRequest: JovoRequest = await t.requestBuilder.audioPlayerRequest();
    _set(audioPlayerRequest, 'context.AudioPlayer.offsetInMilliseconds', 2000);
    _set(audioPlayerRequest, 'request.type', 'AudioPlayer.PlaybackFailed');
    _set(audioPlayerRequest, 'request.offsetInMilliseconds', 2000);

    app.handle(ExpressJS.dummyRequest(audioPlayerRequest));
  });

  test('test artwork chain methods', async (done) => {
    app.setHandler({
      LAUNCH() {
        this.$alexaSkill!.$audioPlayer!.setTitle('ArtWork Title')
          .setSubtitle('ArtWork Subtitle')
          .addArtwork('https://www.url.to/image2.jpg')
          .addBackground('https://www.url.to/image.jpg');
        this.$alexaSkill!.$audioPlayer!.play('https://url.to.audio', 'tokenABC');
      },
    });

    const launchRequest: JovoRequest = await t.requestBuilder.launch();
    app.handle(ExpressJS.dummyRequest(launchRequest));

    app.on('response', (handleRequest: HandleRequest) => {
      const response = handleRequest.jovo!.$response;
      expect(_get(response, 'response.directives[0].type')).toEqual('AudioPlayer.Play');
      expect(_get(response, 'response.shouldEndSession')).toEqual(true);

      expect(_get(response, 'response.directives[0].playBehavior')).toEqual('REPLACE_ALL');
      expect(_get(response, 'response.directives[0].audioItem.stream.url')).toEqual(
        'https://url.to.audio',
      );
      expect(_get(response, 'response.directives[0].audioItem.stream.token')).toEqual('tokenABC');
      expect(
        _get(response, 'response.directives[0].audioItem.stream.offsetInMilliseconds'),
      ).toEqual(0);

      expect(_get(response, 'response.directives[0].audioItem.metadata.title')).toEqual(
        'ArtWork Title',
      );
      expect(_get(response, 'response.directives[0].audioItem.metadata.subtitle')).toEqual(
        'ArtWork Subtitle',
      );
      expect(
        _get(response, 'response.directives[0].audioItem.metadata.backgroundImage.sources[0].url'),
      ).toEqual('https://www.url.to/image.jpg');
      expect(
        _get(response, 'response.directives[0].audioItem.metadata.art.sources[0].url'),
      ).toEqual('https://www.url.to/image2.jpg');

      done();
    });
  });
});
