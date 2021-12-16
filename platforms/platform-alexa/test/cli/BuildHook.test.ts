import JovoCliCore, {
  Files,
  getRawString,
  InstallContext,
  JovoCli,
  Project,
  Task,
  TaskConfig,
  TaskFunction,
} from '@jovotech/cli-core';
import { FileBuilder } from '@jovotech/filebuilder';
import { JovoModelAlexa } from '@jovotech/model-alexa';
import _merge from 'lodash.merge';
import { AlexaCli } from '../../src/cli';
import DefaultFiles from '../../src/cli/DefaultFiles.json';
import { AlexaBuildPlatformContext, BuildHook } from '../../src/cli/hooks/BuildHook';

// Create mock modules. This allows us to modify the behavior for individual functions.
jest.mock('@jovotech/cli-core', () => ({
  ...Object.assign({}, jest.requireActual('@jovotech/cli-core')),
  JovoCli: jest.fn().mockReturnValue({
    project: {
      getBuildDirectory: jest.fn().mockReturnValue(''),
      hasModelFiles: jest.fn(),
      saveModel: jest.fn(),
      getModel: jest.fn(),
      backupModel: jest.fn(),
      validateModel: jest.fn(),
      hasPlatform: jest.fn(),
      getProjectName: jest.fn(),
      getBuildPath: jest.fn().mockReturnValue(''),
    },
  }),
  Task: jest
    .fn()
    .mockImplementation(
      (title: string, action: Task[] | TaskFunction = [], config?: Partial<TaskConfig>) => {
        return {
          title,
          action,
          config: _merge({ enabled: true, indentation: 0 }, config),
          add(...actions: Task[]): void {
            this.action.push(...actions);
          },
          async run(): Promise<void> {
            if (!this.config.enabled) {
              return;
            }

            if (Array.isArray(this.action)) {
              for (const action of this.action) {
                await action.run();
              }
            } else {
              await this.action();
            }
          },
        };
      },
    ),
}));
jest.mock('@jovotech/model-alexa');
jest.mock('../../src/cli/hooks/AlexaHook');
jest.mock('@jovotech/filebuilder');

beforeEach(() => {
  const plugin: AlexaCli = new AlexaCli();
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
    alexa: {},
  } as unknown as AlexaBuildPlatformContext;

  // Reset FileBuilder mocks
  FileBuilder.normalizeFileObject = jest.fn();
  FileBuilder.buildDirectory = jest.fn();
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

describe('addCliOptions()', () => {
  test('should do nothing if command is not build:platform', () => {
    jest.spyOn(BuildHook.prototype, 'addCliOptions');

    const context: InstallContext = {
      args: [],
      command: 'invalid',
      flags: {},
    };

    const hook: BuildHook = new BuildHook();
    hook.addCliOptions(context);

    expect(hook.addCliOptions).toReturn();
    expect(Object.keys(context.flags)).toHaveLength(0);
  });

  test('should enhance context flags with ask-profile', () => {
    jest.spyOn(BuildHook.prototype, 'addCliOptions');

    const context: InstallContext = {
      args: [],
      command: 'build:platform',
      flags: {},
    };

    const hook: BuildHook = new BuildHook();
    hook.addCliOptions(context);

    expect(hook.addCliOptions).toReturn();
    expect(Object.keys(context.flags)).toHaveLength(1);
    expect(context.flags['ask-profile']).toBeDefined();
    expect(context.flags['ask-profile'].description).toMatch('Name of used ASK profile');
  });
});

describe('updatePluginContext()', () => {
  test('should set askProfile from flags', () => {
    const hook: BuildHook = new BuildHook();

    expect(Object.keys(hook.$context.alexa)).toHaveLength(0);

    hook.$context.flags['ask-profile'] = 'dev';
    hook.updatePluginContext();

    expect(Object.keys(hook.$context.alexa)).toHaveLength(1);
    expect(hook.$context.alexa.askProfile).toBeDefined();
    expect(hook.$context.alexa.askProfile).toMatch('dev');
  });

  test('should set askProfile from config', () => {
    const hook: BuildHook = new BuildHook();

    expect(Object.keys(hook.$context.alexa)).toHaveLength(0);

    hook.$plugin.config.askProfile = 'dev';
    hook.updatePluginContext();

    expect(Object.keys(hook.$context.alexa)).toHaveLength(1);
    expect(hook.$context.alexa.askProfile).toBeDefined();
    expect(hook.$context.alexa.askProfile).toMatch('dev');
  });

  test('should set default askProfile', () => {
    const hook: BuildHook = new BuildHook();

    expect(Object.keys(hook.$context.alexa)).toHaveLength(0);

    hook.updatePluginContext();

    expect(Object.keys(hook.$context.alexa)).toHaveLength(1);
    expect(hook.$context.alexa.askProfile).toBeDefined();
    expect(hook.$context.alexa.askProfile).toMatch('default');
  });
});

describe('checkForPlatform()', () => {
  test('should do nothing if platform plugin is selected', () => {
    const uninstall: jest.Mock = jest.fn();
    jest.spyOn(BuildHook.prototype, 'uninstall').mockImplementation(uninstall);

    const hook: BuildHook = new BuildHook();
    hook.$context.platforms.push('alexa');
    hook.checkForPlatform();

    expect(uninstall).not.toBeCalled();
  });

  test('should call uninstall() if platform plugin is not selected', () => {
    const uninstall: jest.Mock = jest.fn();
    jest.spyOn(BuildHook.prototype, 'uninstall').mockImplementation(() => uninstall());

    const hook: BuildHook = new BuildHook();
    hook.$context.platforms.push('invalid');
    hook.checkForPlatform();

    expect(uninstall).toBeCalledTimes(1);
  });
});

describe('validateLocales()', () => {
  test('should throw an error if a locale is not supported', () => {
    jest.spyOn(JovoCliCore, 'getResolvedLocales').mockReturnValue(['zh-FD']);

    const hook: BuildHook = new BuildHook();
    hook.$context.locales.push('en');

    expect(hook.validateLocales.bind(hook)).toThrow();
    try {
      hook.validateLocales();
    } catch (error) {
      // Strip error message from ANSI escape codes.
      expect(getRawString(error.message)).toMatch('Locale zh-FD is not supported by Amazon Alexa.');
    }
  });

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
      expect(error.properties.hint).toMatch(
        'Alexa does not support generic locales, please specify locales in your project configuration.',
      );
    }
  });
});

describe('validateModels()', () => {
  test('should validate model for each locale', async () => {
    const mockedModel = {
      invocation: 'my test app',
    };
    const mockedValidateModel: jest.SpyInstance = jest
      .spyOn(BuildHook.prototype['$cli']['project']!, 'validateModel')
      .mockReturnThis();
    const mockedGetModel: jest.SpyInstance = jest
      .spyOn(BuildHook.prototype['$cli']['project']!, 'getModel')
      .mockReturnValue(new Promise((res) => res(mockedModel)));
    jest.spyOn(JovoModelAlexa, 'getValidator').mockReturnValue({});

    const hook: BuildHook = new BuildHook();
    hook.$context.locales.push('en', 'de');
    await hook.validateModels();

    expect(mockedGetModel).toBeCalledTimes(2);
    expect(mockedGetModel.mock.calls).toEqual([['en'], ['de']]);
    expect(mockedValidateModel).toBeCalledTimes(2);
    expect(mockedValidateModel.mock.calls).toEqual([
      ['en', mockedModel, {}, 'AlexaCli'],
      ['de', mockedModel, {}, 'AlexaCli'],
    ]);
  });
});

describe('checkForCleanBuild()', () => {
  test('should not do anything if --clean is not set', () => {
    jest.spyOn(JovoCliCore, 'deleteFolderRecursive');

    const hook: BuildHook = new BuildHook();
    hook.checkForCleanBuild();

    expect(JovoCliCore.deleteFolderRecursive).not.toBeCalled();
  });

  test('should call deleteFolderRecursive() if --clean is set', () => {
    jest.spyOn(JovoCliCore, 'deleteFolderRecursive').mockReturnThis();
    jest.spyOn(AlexaCli.prototype, 'platformPath', 'get').mockReturnValue('test');

    const hook: BuildHook = new BuildHook();
    hook.$context.flags.clean = true;
    hook.checkForCleanBuild();

    expect(JovoCliCore.deleteFolderRecursive).toBeCalledTimes(1);
    expect(JovoCliCore.deleteFolderRecursive).toBeCalledWith('test');
  });
});

describe('build()', () => {
  test('should generate only project files', async () => {
    jest.spyOn(BuildHook.prototype['$cli']['project']!, 'hasModelFiles').mockReturnValue(false);
    const mockedBuildProjectFiles: jest.SpyInstance = jest
      .spyOn(BuildHook.prototype, 'buildProjectFiles')
      .mockReturnThis();
    const mockedBuildInteractionModel: jest.SpyInstance = jest.spyOn(
      BuildHook.prototype,
      'buildInteractionModel',
    );
    const mockedBuildConversationsFiles: jest.SpyInstance = jest.spyOn(
      BuildHook.prototype,
      'buildConversationsFiles',
    );
    const mockedBuildResponseFiles: jest.SpyInstance = jest.spyOn(
      BuildHook.prototype,
      'buildResponseFiles',
    );

    const hook: BuildHook = new BuildHook();
    hook.$context.alexa.isACSkill = false;
    await hook.build();

    expect(mockedBuildProjectFiles).toBeCalledTimes(1);
    expect(mockedBuildInteractionModel).toBeCalledTimes(0);
    expect(mockedBuildConversationsFiles).toBeCalledTimes(0);
    expect(mockedBuildResponseFiles).toBeCalledTimes(0);
  });

  test('should generate project files and interaction models', async () => {
    jest.spyOn(BuildHook.prototype['$cli']['project']!, 'hasModelFiles').mockReturnValue(true);
    const mockedBuildProjectFiles: jest.SpyInstance = jest
      .spyOn(BuildHook.prototype, 'buildProjectFiles')
      .mockReturnThis();
    const mockedBuildInteractionModel: jest.SpyInstance = jest
      .spyOn(BuildHook.prototype, 'buildInteractionModel')
      .mockReturnThis();
    const mockedBuildConversationsFiles: jest.SpyInstance = jest.spyOn(
      BuildHook.prototype,
      'buildConversationsFiles',
    );
    const mockedBuildResponseFiles: jest.SpyInstance = jest.spyOn(
      BuildHook.prototype,
      'buildResponseFiles',
    );

    const hook: BuildHook = new BuildHook();
    hook.$context.alexa.isACSkill = false;
    await hook.build();

    expect(mockedBuildProjectFiles).toBeCalledTimes(1);
    expect(mockedBuildInteractionModel).toBeCalledTimes(1);
    expect(mockedBuildConversationsFiles).toBeCalledTimes(0);
    expect(mockedBuildResponseFiles).toBeCalledTimes(0);
  });

  test('should generate project files, interaction models and Alexa Conversations files', async () => {
    jest.spyOn(BuildHook.prototype['$cli']['project']!, 'hasModelFiles').mockReturnValue(true);
    const mockedBuildProjectFiles: jest.SpyInstance = jest
      .spyOn(BuildHook.prototype, 'buildProjectFiles')
      .mockReturnThis();
    const mockedBuildInteractionModel: jest.SpyInstance = jest
      .spyOn(BuildHook.prototype, 'buildInteractionModel')
      .mockReturnThis();
    const mockedBuildConversationsFiles: jest.SpyInstance = jest
      .spyOn(BuildHook.prototype, 'buildConversationsFiles')
      .mockReturnThis();
    const mockedBuildResponseFiles: jest.SpyInstance = jest
      .spyOn(BuildHook.prototype, 'buildResponseFiles')
      .mockReturnThis();

    const hook: BuildHook = new BuildHook();
    hook.$context.alexa.isACSkill = true;
    await hook.build();

    expect(mockedBuildProjectFiles).toBeCalledTimes(1);
    expect(mockedBuildInteractionModel).toBeCalledTimes(1);
    expect(mockedBuildConversationsFiles).toBeCalledTimes(1);
    expect(mockedBuildResponseFiles).toBeCalledTimes(1);
  });
});

// describe('buildReverse()', () => {});

describe.only('buildProjectFiles()', () => {
  beforeEach(() => {
    // Turn this on by default so our testing data doesn't interfer with DefaultFiles
    jest.spyOn(BuildHook.prototype['$cli']['project']!, 'hasPlatform').mockReturnValue(true);
    jest
      .spyOn(BuildHook.prototype, 'getPluginEndpoint')
      .mockReturnValue('https://webhook.jovo.cloud/test');
    FileBuilder.normalizeFileObject = jest.fn().mockImplementation((obj) => obj);
    FileBuilder.buildDirectory = jest.fn().mockReturnThis();
  });

  test('should merge config files with default files if platform has not yet been built', () => {
    jest.spyOn(BuildHook.prototype['$cli']['project']!, 'hasPlatform').mockReturnValue(false);

    const hook: BuildHook = new BuildHook();
    hook.buildProjectFiles();

    expect(FileBuilder.buildDirectory).toBeCalledTimes(1);
    expect(FileBuilder.buildDirectory).toBeCalledWith(
      _merge(DefaultFiles, {
        ['skill-package/']: {
          ['skill.json']: {
            manifest: {
              apis: { custom: { endpoint: 'https://webhook.jovo.cloud/test' } },
            },
          },
        },
      }),
      'platform.alexa',
    );
  });

  test('should use config files if platform has been built already', () => {
    const hook: BuildHook = new BuildHook();
    hook.$context.alexa.askProfile = 'dev';
    hook.buildProjectFiles();

    expect(FileBuilder.buildDirectory).toBeCalledTimes(1);
    expect(FileBuilder.buildDirectory).toBeCalledWith(
      {
        ['ask-resources.json']: {
          profiles: {
            dev: {
              skillMetadata: { src: './skill-package' },
            },
          },
        },
        ['skill-package/']: {
          ['skill.json']: {
            manifest: {
              apis: {
                custom: {
                  endpoint: {
                    uri: 'https://webhook.jovo.cloud/test',
                    sslCertificateType: 'Wildcard',
                  },
                },
              },
            },
          },
        },
      },
      'platform.alexa',
    );
  });

  describe('skill.json', () => {
    describe('endpoint', () => {
      test('should not set endpoint if already set', () => {
        const hook: BuildHook = new BuildHook();
        hook.$plugin.config.files = {
          ['skill-package/']: {
            ['skill.json']: {
              manifest: {
                apis: {
                  custom: {
                    endpoint: {
                      uri: 'https://webhook.jovo.cloud/dev',
                      sslCertificateType: 'Wildcard',
                    },
                  },
                },
              },
            },
          },
        };
        hook.$context.alexa.askProfile = 'dev';
        hook.buildProjectFiles();

        expect(FileBuilder.buildDirectory).toBeCalledTimes(1);
        expect(FileBuilder.buildDirectory).toBeCalledWith(
          {
            ['ask-resources.json']: {
              profiles: {
                dev: {
                  skillMetadata: { src: './skill-package' },
                },
              },
            },
            ['skill-package/']: {
              ['skill.json']: {
                manifest: {
                  apis: {
                    custom: {
                      endpoint: {
                        uri: 'https://webhook.jovo.cloud/dev',
                        sslCertificateType: 'Wildcard',
                      },
                    },
                  },
                },
              },
            },
          },
          'platform.alexa',
        );
      });

      test('should not set wildcard certificate if endpoint is lambda arn', () => {
        const endpoint = 'arn:aws:lambda:us-east-1:xxx';
        jest.spyOn(BuildHook.prototype, 'getPluginEndpoint').mockReturnValue(endpoint);

        const hook: BuildHook = new BuildHook();
        hook.$context.alexa.askProfile = 'dev';
        hook.buildProjectFiles();

        expect(FileBuilder.buildDirectory).toBeCalledTimes(1);
        expect(FileBuilder.buildDirectory).toBeCalledWith(
          {
            ['ask-resources.json']: {
              profiles: {
                dev: {
                  skillMetadata: { src: './skill-package' },
                },
              },
            },
            ['skill-package/']: {
              ['skill.json']: {
                manifest: {
                  apis: { custom: { endpoint: { uri: endpoint, sslCertificateType: null } } },
                },
              },
            },
          },
          'platform.alexa',
        );
      });

      test('should set endpoint', () => {
        const endpoint = 'https://webhook.jovo.cloud/dev';
        jest.spyOn(BuildHook.prototype, 'getPluginEndpoint').mockReturnValue(endpoint);

        const hook: BuildHook = new BuildHook();
        hook.$context.alexa.askProfile = 'dev';
        hook.buildProjectFiles();

        expect(FileBuilder.buildDirectory).toBeCalledTimes(1);
        expect(FileBuilder.buildDirectory).toBeCalledWith(
          {
            ['ask-resources.json']: {
              profiles: {
                dev: {
                  skillMetadata: { src: './skill-package' },
                },
              },
            },
            ['skill-package/']: {
              ['skill.json']: {
                manifest: {
                  apis: { custom: { endpoint: { uri: endpoint, sslCertificateType: 'Wildcard' } } },
                },
              },
            },
          },
          'platform.alexa',
        );
      });
    });

    describe('dialogManagement', () => {
      test('should not set dialogManagement if current skill is not using AC', () => {
        const hook: BuildHook = new BuildHook();
        hook.$context.alexa.isACSkill = false;
        hook.buildProjectFiles();

        expect(FileBuilder.buildDirectory).toBeCalledTimes(1);
        expect(FileBuilder.buildDirectory).toBeCalledWith(
          {
            ['ask-resources.json']: {
              profiles: {
                dev: {
                  skillMetadata: { src: './skill-package' },
                },
              },
            },
            ['skill-package/']: {
              ['skill.json']: {
                manifest: {
                  apis: {
                    custom: {
                      endpoint: {
                        uri: 'https://webhook.jovo.cloud/test',
                        sslCertificateType: 'Wildcard',
                      },
                    },
                  },
                },
              },
            },
          },
          'platform.alexa',
        );
      });

      test('should not set dialogManagement if already set', () => {
        const hook: BuildHook = new BuildHook();
        ('skill-package/["skill.json"].manifest.apis.custom.dialogManagement');
        hook.$plugin.config.files = {
          'skill-package/': {
            'skill.json': {
              manifest: {
                apis: {
                  custom: {
                    dialogManagement: {
                      sessionStartDelegationStrategy: {
                        target: 'skill',
                      },
                      dialogManagers: [
                        {
                          type: 'AMAZON.Conversations',
                        },
                      ] as unknown as Files,
                    },
                  },
                },
              },
            },
          },
        };
        hook.buildProjectFiles();

        expect(FileBuilder.buildDirectory).toBeCalledTimes(1);
        expect(FileBuilder.buildDirectory).toBeCalledWith(
          {
            ['ask-resources.json']: {
              profiles: {
                dev: {
                  skillMetadata: { src: './skill-package' },
                },
              },
            },
            ['skill-package/']: {
              ['skill.json']: {
                manifest: {
                  apis: {
                    custom: {
                      dialogManagement: {
                        sessionStartDelegationStrategy: {
                          target: 'skill',
                        },
                        dialogManagers: [
                          {
                            type: 'AMAZON.Conversations',
                          },
                        ] as unknown as Files,
                      },
                      endpoint: {
                        uri: 'https://webhook.jovo.cloud/test',
                        sslCertificateType: 'Wildcard',
                      },
                    },
                  },
                },
              },
            },
          },
          'platform.alexa',
        );
      });

      test('should set dialogManagement', () => {
        const hook: BuildHook = new BuildHook();
        hook.$plugin.config.conversations = {
          enabled: true,
          sessionStartDelegationStrategy: {
            target: 'AMAZON.Conversations',
          },
        };
        hook.buildProjectFiles();

        expect(FileBuilder.buildDirectory).toBeCalledTimes(1);
        expect(FileBuilder.buildDirectory).toBeCalledWith(
          {
            ['ask-resources.json']: {
              profiles: {
                dev: {
                  skillMetadata: { src: './skill-package' },
                },
              },
            },
            ['skill-package/']: {
              ['skill.json']: {
                manifest: {
                  apis: {
                    custom: {
                      dialogManagement: {
                        sessionStartDelegationStrategy: {
                          target: 'AMAZON.Conversations',
                        },
                        dialogManagers: [
                          {
                            type: 'AMAZON.Conversations',
                          },
                        ] as unknown as Files,
                      },
                      endpoint: {
                        uri: 'https://webhook.jovo.cloud/test',
                        sslCertificateType: 'Wildcard',
                      },
                    },
                  },
                },
              },
            },
          },
          'platform.alexa',
        );
      });
    });

    describe('manifest.publishingInformation', () => {
      test('should not set publishingInformation if already set', () => {
        jest.spyOn(JovoCliCore, 'getResolvedLocales').mockReturnValue(['en']);

        const hook: BuildHook = new BuildHook();
        hook.$plugin.config.files = {
          ['skill-package/']: {
            ['skill.json']: {
              manifest: {
                publishingInformation: {
                  locales: {
                    en: {
                      foo: 'bar',
                    },
                  },
                },
              },
            },
          },
        };
        hook.$context.locales = ['en'];
        hook.buildProjectFiles();

        expect(FileBuilder.buildDirectory).toBeCalledTimes(1);
        expect(FileBuilder.buildDirectory).toBeCalledWith(
          {
            ['ask-resources.json']: {
              profiles: {
                dev: {
                  skillMetadata: { src: './skill-package' },
                },
              },
            },
            ['skill-package/']: {
              ['skill.json']: {
                manifest: {
                  publishingInformation: {
                    locales: {
                      en: {
                        foo: 'bar',
                      },
                    },
                  },
                  apis: {
                    custom: {
                      endpoint: {
                        uri: 'https://webhook.jovo.cloud/test',
                        sslCertificateType: 'Wildcard',
                      },
                    },
                  },
                },
              },
            },
          },
          'platform.alexa',
        );
      });

      test('should set publishingInformation', () => {
        jest.spyOn(Project.prototype, 'getProjectName').mockReturnValue('test');
        jest.spyOn(JovoCliCore, 'getResolvedLocales').mockReturnValue(['en', 'de']);

        const hook: BuildHook = new BuildHook();
        hook.$context.locales = ['en'];
        hook.buildProjectFiles();

        expect(FileBuilder.buildDirectory).toBeCalledTimes(1);
        expect(FileBuilder.buildDirectory).toBeCalledWith(
          {
            ['ask-resources.json']: {
              profiles: {
                dev: {
                  skillMetadata: { src: './skill-package' },
                },
              },
            },
            ['skill-package/']: {
              ['skill.json']: {
                manifest: {
                  publishingInformation: {
                    locales: {
                      en: {
                        summary: 'Sample Short Description',
                        examplePhrases: ['Alexa open hello world'],
                        keywords: ['hello', 'world'],
                        name: 'test',
                        description: 'Sample Full Description',
                        smallIconUri: 'https://via.placeholder.com/108/09f/09f.png',
                        largeIconUri: 'https://via.placeholder.com/512/09f/09f.png',
                      },
                    },
                    de: {
                      summary: 'Sample Short Description',
                      examplePhrases: ['Alexa open hello world'],
                      keywords: ['hello', 'world'],
                      name: 'test',
                      description: 'Sample Full Description',
                      smallIconUri: 'https://via.placeholder.com/108/09f/09f.png',
                      largeIconUri: 'https://via.placeholder.com/512/09f/09f.png',
                    },
                  },
                  apis: {
                    custom: {
                      endpoint: {
                        uri: 'https://webhook.jovo.cloud/test',
                        sslCertificateType: 'Wildcard',
                      },
                    },
                  },
                },
              },
            },
          },
          'platform.alexa',
        );
      });
    });

    describe('manifest.privacyAndCompliance', () => {
      test('should not set privacyAndCompliance if already set', () => {
        const hook: BuildHook = new BuildHook();
        hook.$plugin.config.conversations = {
          enabled: true,
          sessionStartDelegationStrategy: {
            target: 'AMAZON.Conversations',
          },
        };
        hook.buildProjectFiles();

        expect(FileBuilder.buildDirectory).toBeCalledTimes(1);
        expect(FileBuilder.buildDirectory).toBeCalledWith(
          {
            ['ask-resources.json']: {
              profiles: {
                dev: {
                  skillMetadata: { src: './skill-package' },
                },
              },
            },
            ['skill-package/']: {
              ['skill.json']: {
                manifest: {
                  apis: {
                    custom: {
                      dialogManagement: {
                        sessionStartDelegationStrategy: {
                          target: 'AMAZON.Conversations',
                        },
                        dialogManagers: [
                          {
                            type: 'AMAZON.Conversations',
                          },
                        ] as unknown as Files,
                      },
                      endpoint: {
                        uri: 'https://webhook.jovo.cloud/test',
                        sslCertificateType: 'Wildcard',
                      },
                    },
                  },
                },
              },
            },
          },
          'platform.alexa',
        );
      });

      test('should set privacyAndCompliance', () => {
        const hook: BuildHook = new BuildHook();
        hook.$plugin.config.conversations = {
          enabled: true,
          sessionStartDelegationStrategy: {
            target: 'AMAZON.Conversations',
          },
        };
        hook.buildProjectFiles();

        expect(FileBuilder.buildDirectory).toBeCalledTimes(1);
        expect(FileBuilder.buildDirectory).toBeCalledWith(
          {
            ['ask-resources.json']: {
              profiles: {
                dev: {
                  skillMetadata: { src: './skill-package' },
                },
              },
            },
            ['skill-package/']: {
              ['skill.json']: {
                manifest: {
                  apis: {
                    custom: {
                      dialogManagement: {
                        sessionStartDelegationStrategy: {
                          target: 'AMAZON.Conversations',
                        },
                        dialogManagers: [
                          {
                            type: 'AMAZON.Conversations',
                          },
                        ] as unknown as Files,
                      },
                      endpoint: {
                        uri: 'https://webhook.jovo.cloud/test',
                        sslCertificateType: 'Wildcard',
                      },
                    },
                  },
                },
              },
            },
          },
          'platform.alexa',
        );
      });
    });
  });

  describe('ask-resources.json', () => {
    describe('profiles', () => {
      test('should not set profile if already set', () => {
        const hook: BuildHook = new BuildHook();
        hook.$plugin.config.conversations = {
          enabled: true,
          sessionStartDelegationStrategy: {
            target: 'AMAZON.Conversations',
          },
        };
        hook.buildProjectFiles();

        expect(FileBuilder.buildDirectory).toBeCalledTimes(1);
        expect(FileBuilder.buildDirectory).toBeCalledWith(
          {
            ['ask-resources.json']: {
              profiles: {
                dev: {
                  skillMetadata: { src: './skill-package' },
                },
              },
            },
            ['skill-package/']: {
              ['skill.json']: {
                manifest: {
                  apis: {
                    custom: {
                      dialogManagement: {
                        sessionStartDelegationStrategy: {
                          target: 'AMAZON.Conversations',
                        },
                        dialogManagers: [
                          {
                            type: 'AMAZON.Conversations',
                          },
                        ] as unknown as Files,
                      },
                      endpoint: {
                        uri: 'https://webhook.jovo.cloud/test',
                        sslCertificateType: 'Wildcard',
                      },
                    },
                  },
                },
              },
            },
          },
          'platform.alexa',
        );
      });

      test('should set profile', () => {
        const hook: BuildHook = new BuildHook();
        hook.$plugin.config.conversations = {
          enabled: true,
          sessionStartDelegationStrategy: {
            target: 'AMAZON.Conversations',
          },
        };
        hook.buildProjectFiles();

        expect(FileBuilder.buildDirectory).toBeCalledTimes(1);
        expect(FileBuilder.buildDirectory).toBeCalledWith(
          {
            ['ask-resources.json']: {
              profiles: {
                dev: {
                  skillMetadata: { src: './skill-package' },
                },
              },
            },
            ['skill-package/']: {
              ['skill.json']: {
                manifest: {
                  apis: {
                    custom: {
                      dialogManagement: {
                        sessionStartDelegationStrategy: {
                          target: 'AMAZON.Conversations',
                        },
                        dialogManagers: [
                          {
                            type: 'AMAZON.Conversations',
                          },
                        ] as unknown as Files,
                      },
                      endpoint: {
                        uri: 'https://webhook.jovo.cloud/test',
                        sslCertificateType: 'Wildcard',
                      },
                    },
                  },
                },
              },
            },
          },
          'platform.alexa',
        );
      });
    });
  });

  describe('.ask/ask-states.json', () => {
    describe('profiles', () => {
      test('should not set profile if skillId is not defined', () => {
        const hook: BuildHook = new BuildHook();
        hook.$context.alexa.askProfile = 'dev';
        hook.$plugin.config.conversations = {
          enabled: true,
          sessionStartDelegationStrategy: {
            target: 'AMAZON.Conversations',
          },
        };
        hook.buildProjectFiles();

        expect(FileBuilder.buildDirectory).toBeCalledTimes(1);
        expect(FileBuilder.buildDirectory).toBeCalledWith(
          {
            ['ask-resources.json']: {
              profiles: {
                dev: {
                  skillMetadata: { src: './skill-package' },
                },
              },
            },
            ['skill-package/']: {
              ['skill.json']: {
                manifest: {
                  apis: {
                    custom: {
                      dialogManagement: {
                        sessionStartDelegationStrategy: {
                          target: 'AMAZON.Conversations',
                        },
                        dialogManagers: [
                          {
                            type: 'AMAZON.Conversations',
                          },
                        ] as unknown as Files,
                      },
                      endpoint: {
                        uri: 'https://webhook.jovo.cloud/test',
                        sslCertificateType: 'Wildcard',
                      },
                    },
                  },
                },
              },
            },
          },
          'platform.alexa',
        );
      });

      test('should not set profile if already set', () => {
        const hook: BuildHook = new BuildHook();
        hook.$context.alexa.askProfile = 'dev';
        hook.$plugin.config.conversations = {
          enabled: true,
          sessionStartDelegationStrategy: {
            target: 'AMAZON.Conversations',
          },
        };
        hook.buildProjectFiles();

        expect(FileBuilder.buildDirectory).toBeCalledTimes(1);
        expect(FileBuilder.buildDirectory).toBeCalledWith(
          {
            ['ask-resources.json']: {
              profiles: {
                dev: {
                  skillMetadata: { src: './skill-package' },
                },
              },
            },
            ['skill-package/']: {
              ['skill.json']: {
                manifest: {
                  apis: {
                    custom: {
                      dialogManagement: {
                        sessionStartDelegationStrategy: {
                          target: 'AMAZON.Conversations',
                        },
                        dialogManagers: [
                          {
                            type: 'AMAZON.Conversations',
                          },
                        ] as unknown as Files,
                      },
                      endpoint: {
                        uri: 'https://webhook.jovo.cloud/test',
                        sslCertificateType: 'Wildcard',
                      },
                    },
                  },
                },
              },
            },
          },
          'platform.alexa',
        );
      });

      test('should set profile', () => {
        const hook: BuildHook = new BuildHook();
        hook.$context.alexa.askProfile = 'dev';
        hook.$plugin.config.conversations = {
          enabled: true,
          sessionStartDelegationStrategy: {
            target: 'AMAZON.Conversations',
          },
        };
        hook.buildProjectFiles();

        expect(FileBuilder.buildDirectory).toBeCalledTimes(1);
        expect(FileBuilder.buildDirectory).toBeCalledWith(
          {
            ['ask-resources.json']: {
              profiles: {
                dev: {
                  skillMetadata: { src: './skill-package' },
                },
              },
            },
            ['skill-package/']: {
              ['skill.json']: {
                manifest: {
                  apis: {
                    custom: {
                      dialogManagement: {
                        sessionStartDelegationStrategy: {
                          target: 'AMAZON.Conversations',
                        },
                        dialogManagers: [
                          {
                            type: 'AMAZON.Conversations',
                          },
                        ] as unknown as Files,
                      },
                      endpoint: {
                        uri: 'https://webhook.jovo.cloud/test',
                        sslCertificateType: 'Wildcard',
                      },
                    },
                  },
                },
              },
            },
          },
          'platform.alexa',
        );
      });
    });
  });
});
