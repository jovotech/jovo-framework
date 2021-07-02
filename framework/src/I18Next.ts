import i18next, { InitOptions, Resource, TOptionsBase } from 'i18next';
import _merge from 'lodash.merge';
import type { A, F, U } from 'ts-toolbelt';
import { OmitIndex } from './index';

// Provide an interface that can be augmented in order to provide code-completion for translation-keys.
export interface I18NextResources extends Resource {}

// Construct a new type without the index-signature that is inherited from Resource.
// Otherwise keyof would only return string instead of the explicit keys.
export type NonIndexedI18NextResources = OmitIndex<I18NextResources, string>;

// If KEYS is empty after excluding the number- and symbol-key, string is returned, otherwise KEYS without the number- and symbol-key is returned.
export type TransformI18NextKeys<KEYS> = Exclude<KEYS, number> extends never
  ? string
  : Exclude<KEYS, number>;

// Type that references all explicit language-keys in I18NextResources or string if I18NextResources was not augmented.
export type I18NextResourcesLanguageKeys = TransformI18NextKeys<keyof NonIndexedI18NextResources>;

// Type that references all explicit namespace-keys in I18NextResources based on the given language-keys.
export type I18NextResourcesNamespaceKeysOfLanguage<
  LANGUAGE extends I18NextResourcesLanguageKeys | string,
> = keyof U.Merge<I18NextResources[LANGUAGE]>;

// Type that retrieves the available path by using AutoPath of ts-toolbelt.
// All available objects for the given language-keys in I18NextResources get merged to a single object.
// This object is then used with AutoPath and the input-path to retrieve available paths.
export type I18NextAutoPath<
  PATH extends string,
  LANGUAGE extends I18NextResourcesLanguageKeys | string,
  NAMESPACE extends I18NextResourcesNamespaceKeysOfLanguage<LANGUAGE> | string,
  MERGED = U.Merge<I18NextResources[LANGUAGE]>,
> = F.AutoPath<MERGED[A.Cast<NAMESPACE, keyof MERGED>], PATH>;

// Custom init-options for i18next in case some custom properties are used in the future.
export interface I18NextOptions extends InitOptions {}

// Custom t-options for i18next, needed in order to interfere passed language and namespace.
export interface I18NextTOptions<
  LANGUAGE extends I18NextResourcesLanguageKeys | string,
  NAMESPACE extends
    | I18NextResourcesNamespaceKeysOfLanguage<LANGUAGE>
    | string = I18NextResourcesNamespaceKeysOfLanguage<LANGUAGE>,
> extends TOptionsBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  lng?: LANGUAGE;
  ns?: A.Cast<
    | NAMESPACE
    | I18NextResourcesNamespaceKeysOfLanguage<LANGUAGE>
    | Array<NAMESPACE | I18NextResourcesNamespaceKeysOfLanguage<LANGUAGE>>,
    string | string[]
  >;
}

export class I18Next {
  readonly i18n = i18next;
  readonly options: I18NextOptions;

  constructor(options: I18NextOptions = {}) {
    this.options = _merge(this.getDefaultOptions(), options);
  }

  getDefaultOptions(): I18NextOptions {
    return {
      interpolation: {
        escapeValue: false,
      },
    };
  }

  async initialize(): Promise<void> {
    await this.i18n.init(this.options);
  }

  t<
    PATH extends string,
    LANGUAGE extends I18NextResourcesLanguageKeys | string = I18NextResourcesLanguageKeys,
    NAMESPACE extends
      | I18NextResourcesNamespaceKeysOfLanguage<LANGUAGE>
      | string = I18NextResourcesNamespaceKeysOfLanguage<LANGUAGE>,
  >(
    path:
      | I18NextAutoPath<PATH, LANGUAGE, NAMESPACE>
      | PATH
      | Array<I18NextAutoPath<PATH, LANGUAGE, NAMESPACE> | PATH>,
    options?: I18NextTOptions<LANGUAGE, NAMESPACE>,
  ): string {
    // "Type argument cannot be inferred from usage"-warning can be ignored, it will be inferred, at least in ts 4.2.4.
    return this.i18n.t(path, options);
  }
}
