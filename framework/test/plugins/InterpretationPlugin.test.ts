import {
  App,
  AsrData,
  InputType,
  InterpretationPlugin,
  InterpretationPluginConfig,
  InvalidParentError,
  Jovo,
  NluData,
  ParsedAudioInput,
} from '../../src';
import { ExampleExtensible, ExamplePlatform, ExampleServer } from '../utilities';

class ExampleInterpretationPlugin extends InterpretationPlugin {
  readonly targetSampleRate = 16000;

  getDefaultConfig(): InterpretationPluginConfig {
    return {
      input: {
        supportedTypes: [InputType.Text, InputType.TranscribedSpeech, InputType.Speech],
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async processAudio(jovo: Jovo, audio: ParsedAudioInput): Promise<AsrData | undefined> {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async processText(jovo: Jovo, text: string): Promise<NluData | undefined> {
    return;
  }
}

test('Invalid parent: Platform expected', () => {
  const extensible = new ExampleExtensible();
  const plugin = new ExampleInterpretationPlugin();
  expect(() => {
    plugin.mount(extensible);
  }).toThrowError(InvalidParentError);
});

describe('interpretation', () => {
  describe('asr', () => {
    test('supported - no result', async () => {
      const plugin = new ExampleInterpretationPlugin();
      const processAudioMethod = plugin.processAudio;
      plugin.processAudio = jest.fn(processAudioMethod);
      const app = new App({
        plugins: [
          new ExamplePlatform({
            plugins: [plugin],
          }),
        ],
      });
      app.hook('after.interpretation.asr', (jovo) => {
        expect(jovo.$input.asr).toBe(undefined);
      });
      const server = new ExampleServer({
        input: { type: InputType.Speech, audio: { sampleRate: 16000, base64: '<base64-content>' } },
      });
      await app.handle(server);
      expect(plugin.processAudio).toHaveBeenCalled();
    });

    test('supported - asr result', async () => {
      const plugin = new ExampleInterpretationPlugin();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      plugin.processAudio = async function (jovo, audio) {
        return {
          text: 'Hello world',
        };
      };
      const app = new App({
        plugins: [
          new ExamplePlatform({
            plugins: [plugin],
          }),
        ],
      });
      app.hook('after.interpretation.asr', (jovo) => {
        expect(jovo.$input.asr).toEqual({ text: 'Hello world' });
      });
      const server = new ExampleServer({
        input: { type: InputType.Speech, audio: { sampleRate: 16000, base64: '<base64-content>' } },
      });
      await app.handle(server);
    });

    test('not supported', async () => {
      const plugin = new ExampleInterpretationPlugin();
      const processAudioMethod = plugin.processAudio;
      plugin.processAudio = jest.fn(processAudioMethod);
      const app = new App({
        plugins: [
          new ExamplePlatform({
            plugins: [plugin],
          }),
        ],
      });
      const server = new ExampleServer({
        input: { type: InputType.Launch },
      });
      await app.handle(server);
      expect(plugin.processAudio).not.toHaveBeenCalled();
    });
  });

  describe('nlu', () => {
    test('supported - no result', async () => {
      const plugin = new ExampleInterpretationPlugin();
      const processTextMethod = plugin.processText;
      plugin.processText = jest.fn(processTextMethod);
      const app = new App({
        plugins: [
          new ExamplePlatform({
            plugins: [plugin],
          }),
        ],
      });
      app.hook('after.interpretation.nlu', (jovo) => {
        expect(jovo.$input.nlu).toBe(undefined);
      });
      const server = new ExampleServer({
        input: { type: InputType.Text, text: '<text>' },
      });
      await app.handle(server);
      expect(plugin.processText).toHaveBeenCalled();
    });

    test('supported - nlu result', async () => {
      const plugin = new ExampleInterpretationPlugin();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      plugin.processText = async function (jovo, audio) {
        return {
          intent: 'ExampleIntent',
        };
      };
      const app = new App({
        plugins: [
          new ExamplePlatform({
            plugins: [plugin],
          }),
        ],
      });
      app.hook('after.interpretation.nlu', (jovo) => {
        expect(jovo.$input.nlu).toEqual({ intent: 'ExampleIntent' });
      });
      const server = new ExampleServer({
        input: { type: InputType.Text, text: '<text>' },
      });
      await app.handle(server);
    });

    test('not supported', async () => {
      const plugin = new ExampleInterpretationPlugin();
      const processTextMethod = plugin.processText;
      plugin.processText = jest.fn(processTextMethod);
      const app = new App({
        plugins: [
          new ExamplePlatform({
            plugins: [plugin],
          }),
        ],
      });
      const server = new ExampleServer({
        input: { type: InputType.Launch },
      });
      await app.handle(server);
      expect(plugin.processText).not.toHaveBeenCalled();
    });
  });
});
