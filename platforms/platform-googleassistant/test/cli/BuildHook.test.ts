import JovoCliCore, { getRawString, InstallContext, JovoCli } from '@jovotech/cli-core';
import type { ParseContextBuild } from '@jovotech/cli-command-build';
import { JovoModelGoogle } from 'jovo-model-google';
import { JovoModelData } from 'jovo-model';

import { BuildHook } from '../../src/cli/hooks/BuildHook';
import { Plugin } from '../__mocks__/Plugin';

// Create mock modules. This allows us to modify the behavior for individual functions.
jest.mock('@jovotech/cli-core', () => ({
  ...Object.assign({}, jest.requireActual('@jovotech/cli-core')),
  JovoCli: jest.fn().mockReturnValue({
    $project: { hasModelFiles: jest.fn(), saveModel: jest.fn(), backupModel: jest.fn() },
  }),
}));
jest.mock('jovo-model-google');

beforeEach(() => {
  const plugin: Plugin = new Plugin();
  const cli: JovoCli = new JovoCli();
  plugin.$cli = cli;
  BuildHook.prototype['$cli'] = cli;
  BuildHook.prototype['$plugin'] = plugin;
  BuildHook.prototype['$context'] = {
    command: 'build',
    locales: [],
    platforms: [],
    // @ts-ignore
    flags: {},
    args: {},
  };
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('install()', () => {
  test('should register events correctly', () => {
    const hook: BuildHook = new BuildHook();
    expect(hook['middlewareCollection']).toBeUndefined();
    hook.install();
    expect(hook['middlewareCollection']).toBeDefined();
  });
});

describe('addCliOptions()', () => {
  test('should do nothing if command is not equal to "build"', () => {
    const args: InstallContext = { command: 'invalid', flags: {}, args: [] };
    const spiedAddClioptions: jest.SpyInstance = jest.spyOn(BuildHook.prototype, 'addCliOptions');

    const hook: BuildHook = new BuildHook();
    hook.addCliOptions(args);

    expect(spiedAddClioptions).toReturn();
    expect(args.flags).not.toHaveProperty('project-id');
  });

  test('should add "project-id" to flags', () => {
    const hook: BuildHook = new BuildHook();
    const args: InstallContext = { command: 'build', flags: {}, args: [] };
    hook.addCliOptions(args);

    expect(args.flags).toHaveProperty('project-id');
  });
});

describe('checkForPlatform()', () => {
  test('should do nothing if platform plugin is selected', () => {
    const uninstall: jest.Mock = jest.fn();
    jest.spyOn(BuildHook.prototype, 'uninstall').mockImplementation(uninstall);

    const hook: BuildHook = new BuildHook();
    const args: ParseContextBuild = {
      // @ts-ignore
      flags: {
        platform: ['testPlugin'],
      },
    };
    hook.checkForPlatform(args);

    expect(uninstall).not.toBeCalled();
  });

  test('should call uninstall() if platform plugin is not selected', () => {
    const uninstall: jest.Mock = jest.fn();
    jest.spyOn(BuildHook.prototype, 'uninstall').mockImplementation(() => uninstall());

    const hook: BuildHook = new BuildHook();
    const context: ParseContextBuild = {
      // @ts-ignore
      flags: {
        platform: ['anotherPlugin'],
      },
    };
    hook.checkForPlatform(context);

    expect(uninstall).toBeCalledTimes(1);
  });
});

describe('updatePluginContext()', () => {
  test('should do nothing if command is not equal to "build"', () => {
    const hook: BuildHook = new BuildHook();
    hook['$context'].command = 'invalidCommand';

    hook.updatePluginContext();

    expect(hook['$context']).not.toHaveProperty('project-id');
  });

  test('should set "project-id" from flags', () => {
    jest.spyOn(BuildHook.prototype, 'setDefaultLocale').mockReturnThis();
    const hook: BuildHook = new BuildHook();
    hook['$context'].flags['project-id'] = '123';

    hook.updatePluginContext();

    expect(hook['$context'].projectId).toBeDefined();
    expect(hook['$context'].projectId).toMatch('123');
  });

  test('should set "project-id" from config', () => {
    BuildHook.prototype['$plugin'].$config.projectId = '123';
    const hook: BuildHook = new BuildHook();

    hook.updatePluginContext();

    expect(hook['$context'].projectId).toBeDefined();
    expect(hook['$context'].projectId).toMatch('123');
  });

  test('should throw an error if "project-id" could not be found', () => {
    const hook: BuildHook = new BuildHook();
    expect(hook.updatePluginContext.bind(hook)).toThrow('Could not find project ID.');
  });
});

describe('checkForCleanBuild()', () => {
  test('should not do anything if --clean is not set', () => {
    jest.spyOn(JovoCliCore, 'deleteFolderRecursive').mockReturnThis();

    const hook: BuildHook = new BuildHook();
    hook.checkForCleanBuild();

    expect(JovoCliCore.deleteFolderRecursive).not.toBeCalled();
  });

  test('should call deleteFolderRecursive() if --clean is set', () => {
    jest.spyOn(JovoCliCore, 'deleteFolderRecursive').mockReturnThis();
    jest.spyOn(BuildHook.prototype.$plugin, 'getPlatformPath').mockReturnValue('test');

    const hook: BuildHook = new BuildHook();
    hook.$context.flags.clean = true;
    hook.checkForCleanBuild();

    expect(JovoCliCore.deleteFolderRecursive).toBeCalledTimes(1);
    expect(JovoCliCore.deleteFolderRecursive).toBeCalledWith('test');
  });
});

describe('validateLocales()', () => {
  test('should throw an error if generic locale is required, but not provided', () => {
    jest.spyOn(JovoCliCore, 'getResolvedLocales').mockReturnValue(['en-US']);

    const hook: BuildHook = new BuildHook();
    hook.$context.locales.push('en');

    expect(hook.validateLocales.bind(hook)).toThrow();
    try {
      hook.validateLocales();
    } catch (error) {
      // Strip error message from ANSI escape codes.
      expect(getRawString(error.message)).toMatch('Locale en-US requires a generic locale en.');
    }
  });

  test('should throw an error if a locale is not supported', () => {
    jest.spyOn(JovoCliCore, 'getResolvedLocales').mockReturnValue(['zh']);

    const hook: BuildHook = new BuildHook();
    hook.$context.locales.push('zh');

    expect(hook.validateLocales.bind(hook)).toThrow();
    try {
      hook.validateLocales();
    } catch (error) {
      // Strip error message from ANSI escape codes.
      expect(getRawString(error.message)).toMatch(
        'Locale zh is not supported by Google Conversational Actions.',
      );
    }
  });
});

describe('validateModels()', () => {
  // test.skip('should call jovo.$project!.validateModel() for each locale', () => {});
});

describe.skip('buildReverse()', () => {
  test("should return if platforms don't match", async () => {
    const mockedBuildReverse: jest.SpyInstance = jest.spyOn(BuildHook.prototype, 'buildReverse');

    const hook: BuildHook = new BuildHook();
    await hook.buildReverse();
    expect(mockedBuildReverse).toReturn();
  });

  test('should reverse build model files for all platform locales, set the invocation name and save the model', async () => {
    const saveModel: jest.Mock = jest.fn();
    const model: JovoModelData = {
      invocation: '',
    };
    jest.spyOn(BuildHook.prototype['$cli']['$project']!, 'hasModelFiles').mockReturnValue(false);
    jest.spyOn(BuildHook.prototype['$cli']['$project']!, 'saveModel').mockImplementation(saveModel);
    jest.spyOn(JovoModelGoogle.prototype, 'exportJovoModel').mockReturnValue(model);
    jest.spyOn(BuildHook.prototype, 'getPlatformInvocationName').mockReturnValue('testInvocation');

    const mockedSetDefaultLocale: jest.SpyInstance = jest
      .spyOn(BuildHook.prototype, 'setDefaultLocale')
      .mockReturnThis();
    const mockedGetPlatformLocales: jest.SpyInstance = jest
      .spyOn(BuildHook.prototype, 'getPlatformLocales')
      .mockReturnValue(['en', 'en-US']);
    const mockedGetPlatformModels: jest.SpyInstance = jest
      .spyOn(BuildHook.prototype, 'getPlatformModels')
      .mockReturnThis();

    const hook: BuildHook = new BuildHook();
    // Enable this plugin.
    hook.$context.platforms.push('testPlugin');
    await hook.buildReverse();

    expect(mockedSetDefaultLocale).toBeCalledTimes(1);
    expect(mockedGetPlatformLocales).toBeCalledTimes(1);
    expect(mockedGetPlatformModels).toBeCalledTimes(2);
    expect(mockedGetPlatformModels.mock.calls).toEqual([['en'], ['en-US']]);
    expect(saveModel).toBeCalledTimes(2);
    expect(model.invocation).toMatch('testInvocation');
    expect(saveModel.mock.calls).toEqual([
      [model, 'en'],
      [model, 'en-US'],
    ]);
  });

  test('should reverse build model files for the locale provided by --locale', async () => {
    const saveModel: jest.Mock = jest.fn();
    const model: JovoModelData = {
      invocation: '',
    };

    jest.spyOn(BuildHook.prototype['$cli']['$project']!, 'hasModelFiles').mockReturnValue(false);
    jest.spyOn(BuildHook.prototype['$cli']['$project']!, 'saveModel').mockImplementation(saveModel);
    jest.spyOn(JovoModelGoogle.prototype, 'exportJovoModel').mockReturnValue(model);
    jest.spyOn(BuildHook.prototype, 'getPlatformInvocationName').mockReturnValue('testInvocation');

    const mockedSetDefaultLocale: jest.SpyInstance = jest
      .spyOn(BuildHook.prototype, 'setDefaultLocale')
      .mockReturnThis();
    const mockedGetPlatformLocales: jest.SpyInstance = jest
      .spyOn(BuildHook.prototype, 'getPlatformLocales')
      .mockReturnValue(['en', 'en-US']);
    const mockedGetPlatformModels: jest.SpyInstance = jest
      .spyOn(BuildHook.prototype, 'getPlatformModels')
      .mockReturnThis();

    const hook: BuildHook = new BuildHook();
    // Enable this plugin.
    hook.$context.platforms.push('testPlugin');
    hook.$context.flags.locale = ['en'];
    await hook.buildReverse();

    expect(mockedSetDefaultLocale).toBeCalledTimes(1);
    expect(mockedGetPlatformLocales).toBeCalledTimes(1);
    expect(mockedGetPlatformModels).toBeCalledTimes(1);
    expect(mockedGetPlatformModels).toBeCalledWith('en');
    expect(saveModel).toBeCalledTimes(1);
    expect(model.invocation).toMatch('testInvocation');
    expect(saveModel).toBeCalledWith(model, 'en');
  });

  test('should throw an error if platform models for a provided locale cannot be found', async () => {
    const model: JovoModelData = {
      invocation: '',
    };
    jest.spyOn(BuildHook.prototype, 'setDefaultLocale').mockReturnThis();
    jest.spyOn(BuildHook.prototype, 'getPlatformLocales').mockReturnValue(['en', 'en-US']);
    jest.spyOn(JovoModelGoogle.prototype, 'exportJovoModel').mockReturnValue(model);
    jest.spyOn(BuildHook.prototype, 'getPlatformInvocationName').mockReturnValue('testInvocation');

    const hook: BuildHook = new BuildHook();
    // Enable this plugin.
    hook.$context.platforms.push('testPlugin');
    hook.$context.flags.locale = ['de'];

    expect(hook.buildReverse.bind(hook)).rejects.toReturn();

    try {
      await hook.buildReverse();
    } catch (error) {
      expect(getRawString(error.message)).toMatch('Could not find platform models for locale: de');
    }
  });

  test('should prompt for overwriting existing model files and return upon cancel', async () => {
    jest.spyOn(BuildHook.prototype['$cli']['$project']!, 'hasModelFiles').mockReturnValue(true);
    jest.spyOn(BuildHook.prototype, 'setDefaultLocale').mockReturnThis();
    jest.spyOn(BuildHook.prototype, 'getPlatformLocales').mockReturnValue(['en', 'en-US']);
    const mockedPromptOverwriteReverseBuild: jest.SpyInstance = jest
      .spyOn(JovoCliCore, 'promptOverwriteReverseBuild')
      .mockReturnValue(
        new Promise((res) =>
          res({
            overwrite: 'cancel',
          }),
        ),
      );
    const mockedBuildReverse: jest.SpyInstance = jest.spyOn(BuildHook.prototype, 'buildReverse');

    const hook: BuildHook = new BuildHook();
    // Enable this plugin.
    hook.$context.platforms.push('testPlugin');
    await hook.buildReverse();

    expect(mockedPromptOverwriteReverseBuild).toBeCalledTimes(1);
    expect(mockedBuildReverse).toReturn();
  });

  test('should prompt for overwriting existing model files and back them up accordingly', async () => {
    const backupModel: jest.Mock = jest.fn();
    const saveModel: jest.Mock = jest.fn();
    const model: JovoModelData = {
      invocation: '',
    };

    jest.spyOn(BuildHook.prototype['$cli']['$project']!, 'hasModelFiles').mockReturnValue(true);
    jest.spyOn(BuildHook.prototype['$cli']['$project']!, 'saveModel').mockImplementation(saveModel);
    jest
      .spyOn(BuildHook.prototype['$cli']['$project']!, 'backupModel')
      .mockImplementation(backupModel);

    jest.spyOn(BuildHook.prototype, 'setDefaultLocale').mockReturnThis();
    jest.spyOn(BuildHook.prototype, 'getPlatformLocales').mockReturnValue(['en', 'en-US']);
    jest.spyOn(BuildHook.prototype, 'getPlatformModels').mockReturnThis();

    jest.spyOn(JovoModelGoogle.prototype, 'exportJovoModel').mockReturnValue(model);
    jest.spyOn(BuildHook.prototype, 'getPlatformInvocationName').mockReturnValue('testInvocation');
    const mockedPromptOverwriteReverseBuild: jest.SpyInstance = jest
      .spyOn(JovoCliCore, 'promptOverwriteReverseBuild')
      .mockReturnValue(
        new Promise((res) =>
          res({
            overwrite: 'backup',
          }),
        ),
      );
    const hook: BuildHook = new BuildHook();
    // Enable this plugin.
    hook.$context.platforms.push('testPlugin');
    await hook.buildReverse();

    expect(mockedPromptOverwriteReverseBuild).toBeCalledTimes(1);
    expect(backupModel).toBeCalledTimes(2);
    expect(backupModel.mock.calls).toEqual([['en'], ['en-US']]);
  });

  test('should throw an error if something went wrong while exporting the Jovo Language Model', async () => {
    jest.spyOn(BuildHook.prototype['$cli']['$project']!, 'hasModelFiles').mockReturnValue(false);

    jest.spyOn(JovoModelGoogle.prototype, 'exportJovoModel').mockReturnValue(undefined);
    jest.spyOn(BuildHook.prototype, 'setDefaultLocale').mockReturnThis();
    jest.spyOn(BuildHook.prototype, 'getPlatformLocales').mockReturnValue(['en', 'en-US']);
    jest.spyOn(BuildHook.prototype, 'getPlatformModels').mockReturnThis();

    const hook: BuildHook = new BuildHook();
    // Enable this plugin.
    hook.$context.platforms.push('testPlugin');
    expect(hook.buildReverse.bind(hook)).rejects.toReturn();

    try {
      await hook.buildReverse();
    } catch (error) {
      expect(error.message).toMatch('Something went wrong while exporting your Jovo model.');
    }
  });
});
