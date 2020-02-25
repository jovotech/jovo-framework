import * as fs from 'fs';
import i18next, { InitOptions } from 'i18next';
import i18n = require('i18next');
import {
  BaseApp,
  BaseCmsPlugin,
  Cms,
  HandleRequest,
  Jovo,
  Log,
  PluginConfig,
  SpeechBuilder,
} from 'jovo-core';
import _merge = require('lodash.merge');
import * as path from 'path';

import * as util from 'util';

export interface Config extends InitOptions, PluginConfig {
  filesDir?: string;
}

export class I18Next extends BaseCmsPlugin {
  // tslint:disable: object-literal-sort-keys
  config: Config = {
    filesDir: './i18n',

    // i18next
    load: 'all',
    returnObjects: true,
    interpolation: {
      escapeValue: false, // do not escape ssml tags
    },
    resources: undefined,
    debug: false,
    partialBundledLanguages: false,
    lng: undefined,
    fallbackLng: 'dev',
    whitelist: false,
    nonExplicitWhitelist: false,
    preload: false,
    lowerCaseLng: false,
    ns: ['translation', 'AlexaSkill', 'GoogleAction'],
    defaultNS: 'translation',
    fallbackNS: false,
    saveMissing: false,
    updateMissing: false,
    saveMissingTo: 'fallback',
    missingKeyHandler: false,
    parseMissingKeyHandler: undefined,
    appendNamespaceToMissingKey: false,
    missingInterpolationHandler: undefined,
    simplifyPluralSuffix: true,
    postProcess: false,
    returnNull: true,
    returnEmptyString: true,
    returnedObjectHandler: undefined,
    joinArrays: false,
    overloadTranslationOptionHandler: undefined,

    detection: undefined,
    backend: undefined,
    cache: undefined,
    i18nFormat: undefined,
    initImmediate: true,
    keySeparator: '.',
    nsSeparator: ':',
    pluralSeparator: '_',
    contextSeparator: '_',
    appendNamespaceToCIMode: false,
    compatibilityJSON: 'v3',
  };
  // tslint:enable:object-literal-sort-keys
  constructor(config?: Config) {
    super(config);
    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  install(app: BaseApp): void {
    super.install(app);
    app.middleware('setup')!.use(this.loadFiles.bind(this));

    Jovo.prototype.t = function() {
      return getSpeech.call(this, arguments);
    };

    SpeechBuilder.prototype.t = function() {
      return this.addText(getSpeech.call(this, arguments));
    };
    SpeechBuilder.prototype.addT = function() {
      return this.addText(getSpeech.call(this, arguments));
    };

    Cms.prototype.t = function() {
      if (!this.$jovo) {
        return;
      }
      return getSpeech.call(this, arguments);
    };
  }

  async loadFiles(handleRequest: HandleRequest) {
    if (!handleRequest.app.$cms.I18Next) {
      handleRequest.app.$cms.I18Next = { resources: {} };
    }

    const readdir = util.promisify(fs.readdir);

    const filesDir = this.config.filesDir || '';
    if (fs.existsSync(filesDir)) {
      const dir = await readdir(filesDir);

      Log.verbose(`Iterating i18n folder: ${filesDir}`);

      dir.forEach((file: string) => {
        const ext = file.substring(file.lastIndexOf('.') + 1);
        const validExtensions = ['js', 'json'];
        if (validExtensions.includes(ext)) {
          const locale = file.split('.')[0];
          Log.verbose(`- ${file}`);

          const pathToFile = path.join(process.cwd(), filesDir, file);
          const resource = _merge(
            handleRequest.app.$cms.I18Next.resources[locale],
            require(pathToFile),
          );

          handleRequest.app.$cms.I18Next.resources[locale] = resource;
        }
      });
    } else if (this.config.resources) {
      handleRequest.app.$cms.I18Next.resources = this.config.resources;
    }

    localeLoop: for (const locale in handleRequest.app.$cms.I18Next.resources) {
      if (!handleRequest.app.$cms.I18Next.resources.hasOwnProperty(locale)) {
        continue;
      }

      const resource = handleRequest.app.$cms.I18Next.resources[locale];
      for (const platform of handleRequest.app.getAppTypes()) {
        if (resource[platform]) {
          // @ts-ignore
          handleRequest.app.config.platformSpecificResponses = true;
          break localeLoop; // Flag has to be set only once
        }
      }
    }

    Log.debug(`Adding resources to $cms object:`);
    Log.debug(JSON.stringify(handleRequest.app.$cms.I18Next.resources, null, '\t'));
    // @ts-ignore
    i18n.init(
      _merge(
        {
          resources: handleRequest.app.$cms.I18Next.resources,
        },
        this.config,
      ),
    );
    handleRequest.app.$cms.I18Next.i18n = i18n;
  }
}

function getSpeech(this: any, args: any) {
  // tslint:disable-line
  let jovo = this; // tslint:disable-line
  if (this.jovo!) {
    jovo = this.jovo!;
  } else if (this.$jovo) {
    jovo = this.$jovo;
  }

  jovo.$app!.$cms.I18Next.i18n.changeLanguage(jovo.$request!.getLocale());

  if (jovo.$app.config.platformSpecificResponses) {
    const platform = jovo.getType();
    const key = args[0];
    args[0] = `${platform}:translation:${key}`;

    const keyExists = jovo.$app!.$cms.I18Next.i18n.exists.apply(jovo.$app!.$cms.I18Next.i18n, args);
    if (keyExists) {
      return jovo.$app!.$cms.I18Next.i18n.t.apply(jovo.$app!.$cms.I18Next.i18n, args);
    }
    args[0] = key;
  }
  return jovo.$app!.$cms.I18Next.i18n.t.apply(jovo.$app!.$cms.I18Next.i18n, args);
}
