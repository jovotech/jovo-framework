import JovoCliCore, { getRawString, JovoCli } from '@jovotech/cli-core';

import { AlexaBuildContext, BuildHook } from '../../src/cli/hooks/BuildHook';
import { Plugin } from '../__mocks__/Plugin';

// Create mock modules. This allows us to modify the behavior for individual functions.
jest.mock('@jovotech/cli-core', () => ({
  ...Object.assign({}, jest.requireActual('@jovotech/cli-core')),
  JovoCli: jest.fn().mockReturnValue({
    $project: {
      hasModelFiles: jest.fn(),
      saveModel: jest.fn(),
      backupModel: jest.fn(),
      validateModel: jest.fn(),
    },
  }),
}));
jest.mock('jovo-model-alexa');

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
    flags: {},
    args: {},
  } as unknown as AlexaBuildContext;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('install()', () => {
  describe('install()', () => {
    test('should register events correctly', () => {
      const hook: BuildHook = new BuildHook();
      expect(hook['middlewareCollection']).toBeUndefined();
      hook.install();
      expect(hook['middlewareCollection']).toBeDefined();
    });
  });
});

describe('checkForPlatform()', () => {
  test('should do nothing if platform plugin is selected', () => {
    const uninstall: jest.Mock = jest.fn();
    jest.spyOn(BuildHook.prototype, 'uninstall').mockImplementation(uninstall);

    const hook: BuildHook = new BuildHook();
    const args = {
      flags: {
        platform: ['testPlugin'],
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (hook.checkForPlatform as any)(args);

    expect(uninstall).not.toBeCalled();
  });

  test('should call uninstall() if platform plugin is not selected', () => {
    const uninstall: jest.Mock = jest.fn();
    jest.spyOn(BuildHook.prototype, 'uninstall').mockImplementation(() => uninstall());

    const hook: BuildHook = new BuildHook();
    const context = {
      flags: {
        platform: ['anotherPlugin'],
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (hook.checkForPlatform as any)(context);

    expect(uninstall).toBeCalledTimes(1);
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
  test('should throw an error if generic locale is provided', () => {
    jest.spyOn(JovoCliCore, 'getResolvedLocales').mockReturnValue(['en']);

    const hook: BuildHook = new BuildHook();
    hook.$context.locales.push('en');

    expect(hook.validateLocales.bind(hook)).toThrow();
    try {
      hook.validateLocales();
    } catch (error) {
      // Strip error message from ANSI escape codes.
      expect(getRawString(error.message)).toMatch('Locale en is not supported by Amazon Alexa.');
      expect(error.hint).toMatch(
        'Alexa does not support generic locales, please specify locales in your project configuration.',
      );
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
      expect(getRawString(error.message)).toMatch('Locale zh is not supported by Amazon Alexa.');
    }
  });
});

describe('validateModels()', () => {
  test('should call jovo.$project!.validateModel() for each locale', async () => {
    const spiedValidateModel: jest.SpyInstance = jest
      .spyOn(BuildHook.prototype['$cli']['$project']!, 'validateModel')
      .mockReturnThis();

    const hook: BuildHook = new BuildHook();
    hook.$context.locales.push('en', 'de');
    await hook.validateModels();

    expect(spiedValidateModel).toBeCalledTimes(2);
  });
});
