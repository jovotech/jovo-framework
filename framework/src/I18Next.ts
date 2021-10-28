import i18next, { InitOptions, Resource, TFunctionResult, TOptionsBase } from 'i18next';
import _merge from 'lodash.merge';
import type { A, F, O, S, U } from 'ts-toolbelt';
import { AnyObject, OmitIndex } from './index';

// Make an explicit string literal out of a passed string. If T equals string return never
export type StringLiteral<T> = T extends string ? (string extends T ? never : T) : never;

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

// Type that returns the full path joined by a dot limiter
export type I18NextFullPath<
  PATH extends string,
  LANGUAGE extends I18NextResourcesLanguageKeys | string,
  NAMESPACE extends I18NextResourcesNamespaceKeysOfLanguage<LANGUAGE> | string,
> = S.Join<[LANGUAGE, A.Cast<NAMESPACE, string>, PATH], '.'>;

// Type that returns the actual value in I18NextResources relative to the given path, language and namespace
export type I18NextResult<
  PATH extends string,
  LANGUAGE extends I18NextResourcesLanguageKeys | string,
  NAMESPACE extends I18NextResourcesNamespaceKeysOfLanguage<LANGUAGE> | string,
  RESULT = O.Path<
    NonIndexedI18NextResources,
    S.Split<I18NextFullPath<PATH, LANGUAGE, NAMESPACE>, '.'>
  >,
> = RESULT extends undefined ? I18NextTFunctionResult : RESULT;

// Custom init-options for i18next in case some custom properties are used in the future.
export interface I18NextOptions extends InitOptions {}
export type I18NextTFunctionResult = TFunctionResult;
export type I18NextTFunctionOptions = TOptionsBase;

// Custom t-options for i18next, needed in order to interfere passed language and namespace.
export interface I18NextTOptions<
  LANGUAGE extends I18NextResourcesLanguageKeys | string,
  NAMESPACE extends
    | I18NextResourcesNamespaceKeysOfLanguage<LANGUAGE>
    | string = I18NextResourcesNamespaceKeysOfLanguage<LANGUAGE>,
> extends TOptionsBase,
    AnyObject {
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
      returnObjects: true,
    };
  }

  async initialize(): Promise<void> {
    await this.i18n.init(this.options);
  }

  // The first signature only allows string literals
  t<
    PATH extends string,
    LANGUAGE extends I18NextResourcesLanguageKeys | string = I18NextResourcesLanguageKeys,
    NAMESPACE extends
      | I18NextResourcesNamespaceKeysOfLanguage<LANGUAGE>
      | string = I18NextResourcesNamespaceKeysOfLanguage<LANGUAGE>,
    LITERAL_PATH extends string = StringLiteral<PATH>,
  >(
    path:
      | I18NextAutoPath<LITERAL_PATH, LANGUAGE, NAMESPACE>
      | LITERAL_PATH
      | Array<I18NextAutoPath<LITERAL_PATH, LANGUAGE, NAMESPACE> | LITERAL_PATH>,
    options?: I18NextTOptions<LANGUAGE, NAMESPACE>,
  ): I18NextResult<LITERAL_PATH, LANGUAGE, NAMESPACE>;
  t<RESULT extends I18NextTFunctionResult = string>(
    path: string | string[],
    options?: I18NextTFunctionOptions,
  ): RESULT;
  t(path: string | string[], options?: I18NextTFunctionOptions): I18NextTFunctionResult {
    return this.i18n.t(path, options);
  }
}
