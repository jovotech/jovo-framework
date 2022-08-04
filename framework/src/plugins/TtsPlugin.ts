import { SsmlUtilities } from '@jovotech/common';

import { AudioUtilities, InvalidParentError, JovoResponse } from '..';
import { Extensible } from '../Extensible';
import { Jovo } from '../Jovo';
import { Platform } from '../Platform';
import { Plugin, PluginConfig } from '../Plugin';

import { Md5 } from 'ts-md5';
import { TtsCachePlugin } from './TtsCachePlugin';
import { TtsData } from './TtsData';

export enum TtsTextType {
  Text = 'text',
  Ssml = 'ssml',
}

export interface TtsPluginConfig extends PluginConfig {
  cache?: TtsCachePlugin;
  outputFormat: string;
  fallbackLocale: string;
}

// Provide basic functionality that will then be used by all TTS plugins
export abstract class TtsPlugin<
  CONFIG extends TtsPluginConfig = TtsPluginConfig,
> extends Plugin<CONFIG> {
  abstract supportedSsmlTags: string[];
  abstract processTts(
    jovo: Jovo,
    text: string,
    textType: TtsTextType,
  ): Promise<TtsData | undefined>;
  abstract getKeyPrefix?(jovo: Jovo): string | undefined;

  mount(parent: Extensible): Promise<void> | void {
    if (!(parent instanceof Platform)) {
      throw new InvalidParentError(this.name, 'Platform');
    }

    parent.middlewareCollection.use('response.tts', (jovo: Jovo) => {
      return this.tts(jovo);
    });
  }

  protected async tts(jovo: Jovo): Promise<void> {
    const response = jovo.$response as JovoResponse;
    // if this plugin is not able to process tts, skip
    if (!this.processTts || !response) {
      return;
    }
    if (response.getSpeech) {
      const speech = response.getSpeech();
      const replaceList = await this.processSpeech(jovo, speech);

      if (replaceList && response.replaceSpeech) {
        response.replaceSpeech(replaceList);
      }
    }

    if (response.getReprompt) {
      const speech = response.getReprompt();
      const replaceList = await this.processSpeech(jovo, speech);

      if (replaceList && response.replaceReprompt) {
        response.replaceReprompt(replaceList);
      }
    }
  }

  private async processSpeech(
    jovo: Jovo,
    speech: string | string[] | undefined,
  ): Promise<string[] | undefined> {
    const replaceList: string[] = [];

    if (speech) {
      const speechList = Array.isArray(speech) ? speech : [speech];
      for (const text of speechList) {
        const result = await this.getTtsData(jovo, text);

        if (result) {
          if (result.url) {
            replaceList.push(SsmlUtilities.buildAudioTag(result.url));
          } else if (result.encodedAudio && result.contentType) {
            replaceList.push(
              SsmlUtilities.buildAudioTag(
                AudioUtilities.buildBase64Uri(result.encodedAudio, result.contentType),
              ),
            );
          }
        }
      }
    }

    if (replaceList.length === 0) {
      return;
    }

    return replaceList;
  }

  private async getTtsData(jovo: Jovo, text: string): Promise<TtsData | undefined> {
    if (!text) {
      return;
    }

    const textType = SsmlUtilities.isPlainText(text) ? TtsTextType.Text : TtsTextType.Ssml;

    let prefix;
    if (this.getKeyPrefix) {
      prefix = this.getKeyPrefix(jovo);
    }
    const audioKey = this.buildKey(text, prefix);

    const locale = this.getLocale(jovo);
    let ttsResponse;

    if (this.config.cache) {
      ttsResponse = await this.config.cache.getItem(audioKey, locale, this.config.outputFormat);
      if (ttsResponse) {
        if (!ttsResponse.text) {
          ttsResponse.text = text;
        }
      }
    }

    if (!ttsResponse) {
      ttsResponse = await this.processTts(jovo, text, textType);

      if (ttsResponse) {
        ttsResponse.key = audioKey;

        if (this.config.cache) {
          const url = await this.config.cache.storeItem(audioKey, locale, ttsResponse);
          if (url) {
            ttsResponse.url = url;
          }
        }
      }
    }

    return ttsResponse;
  }

  protected buildKey(text: string, prefix?: string): string {
    const hash = Md5.hashStr(text);
    return prefix ? `${prefix}-${hash}` : hash;
  }

  protected getLocale(jovo: Jovo): string {
    return jovo.$request.getLocale() || this.config.fallbackLocale;
  }
}
