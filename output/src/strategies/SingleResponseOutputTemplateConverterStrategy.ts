import {
  isSSML,
  mergeInstances,
  mergeListen,
  MessageValue,
  NullableOutputTemplateBase,
  OutputTemplate,
  OutputTemplateBase,
  OutputTemplateConverterStrategyConfig,
  PlainObjectType,
  plainToClass,
  PlatformOutputTemplate,
  removeSSML,
  removeSSMLSpeakTags,
  SpeechMessage,
  TextMessage,
  toSSML,
} from '..';
import { OutputTemplateConverterStrategy } from '../OutputTemplateConverterStrategy';

/**
 * Strategy that merges multiple OutputTemplates into a single OutputTemplate and only converts the merged OutputTemplate to a response.
 * - Strings get concatenated and separated by a whitespace.
 * - Quick Replies get merged into a single array.
 * - Card/Carousel the last in the array is used.
 * - NativeResponses get merged.
 * - Listen gets merged.
 */
export abstract class SingleResponseOutputTemplateConverterStrategy<
  RESPONSE extends Record<string, unknown>,
  CONFIG extends OutputTemplateConverterStrategyConfig,
> extends OutputTemplateConverterStrategy<RESPONSE, CONFIG> {
  prepareOutput(output: OutputTemplate | OutputTemplate[]): OutputTemplate {
    output = super.prepareOutput(output);
    if (Array.isArray(output)) {
      output = this.mergeOutputTemplates(output);
    }
    return this.shouldSanitize() ? this.sanitizeOutput(output) : output;
  }

  prepareResponse(rawResponse: PlainObjectType<RESPONSE>): RESPONSE {
    return super.prepareResponse(rawResponse) as RESPONSE;
  }

  protected abstract sanitizeOutput(output: OutputTemplate): OutputTemplate;

  abstract toResponse(output: OutputTemplate): RESPONSE;
  abstract fromResponse(response: RESPONSE): OutputTemplate;

  protected mergeOutputTemplates(output: OutputTemplate[]): OutputTemplate {
    return plainToClass(
      OutputTemplate,
      output.reduce(
        (accumulator, current) => this.mergeOutputTemplateWith(accumulator, current),
        {},
      ),
    );
  }

  protected mergeOutputTemplateWith(
    target: OutputTemplate,
    mergeWith: OutputTemplate,
  ): OutputTemplate {
    this.mergeOutputTemplateBaseWith(target, mergeWith);

    const platformOutput = mergeWith.platforms?.[this.platformName];
    if (platformOutput) {
      if (!target.platforms) {
        target.platforms = {};
      }
      if (!target.platforms[this.platformName]) {
        target.platforms[this.platformName] = {};
      }
      const targetPlatformOutput = target.platforms[this.platformName] as PlatformOutputTemplate;

      if (platformOutput.nativeResponse) {
        if (!targetPlatformOutput.nativeResponse) {
          targetPlatformOutput.nativeResponse = {};
        }
        mergeInstances(targetPlatformOutput.nativeResponse, platformOutput.nativeResponse);
      }

      this.mergeOutputTemplateBaseWith(targetPlatformOutput, platformOutput);
    }
    return target;
  }

  protected mergeOutputTemplateBaseWith(
    target: OutputTemplateBase | NullableOutputTemplateBase,
    mergeWith: OutputTemplateBase | NullableOutputTemplateBase,
  ): void {
    const message = mergeWith.message;
    if (message) {
      target.message = this.mergeMessages(target.message, message);
    }

    const reprompt = mergeWith.reprompt;
    if (reprompt) {
      target.reprompt = this.mergeMessages(target.reprompt, reprompt);
    }

    const quickReplies = mergeWith.quickReplies;
    if (quickReplies) {
      if (!target.quickReplies) {
        target.quickReplies = [];
      }
      target.quickReplies.push(...quickReplies);
    }

    const card = mergeWith.card;
    if (card) {
      target.card = { ...card };
    }

    const carousel = mergeWith.carousel;
    if (carousel) {
      target.carousel = { ...carousel };
    }

    target.listen = mergeListen(target.listen, mergeWith.listen);
  }

  protected mergeMessages(
    target: MessageValue | null | undefined,
    mergeWith: MessageValue,
  ): MessageValue {
    if (!target) {
      return mergeWith;
    }
    if (typeof target === 'string' && typeof mergeWith === 'string') {
      return this.mergeSpeech(target, mergeWith) as string;
    }
    const targetSpeech = typeof target === 'string' ? target : target.speech;
    const mergeWithSpeech = typeof mergeWith === 'string' ? mergeWith : mergeWith.speech;
    const mergedSpeech = this.mergeSpeech(targetSpeech, mergeWithSpeech);

    const targetText = typeof target === 'string' ? target : target.text;
    const mergeWithText = typeof mergeWith === 'string' ? mergeWith : mergeWith.text;
    const mergedText = this.mergeText(targetText, mergeWithText);

    const message = {} as SpeechMessage | TextMessage;
    if (mergedSpeech) {
      message.speech = mergedSpeech;
    }
    if (mergedText) {
      message.text = mergedText;
    }
    return message;
  }

  protected mergeSpeech(
    target: string | undefined,
    mergeWith: string | undefined,
  ): string | undefined {
    if (!target && !mergeWith) {
      return;
    }
    if (!target && mergeWith) {
      return toSSML(mergeWith);
    }
    if (!mergeWith && target) {
      return toSSML(target);
    }
    const mergedText = [target as string, mergeWith as string].reduce((result, text) => {
      if (text) {
        result += `${result?.length ? ' ' : ''}${removeSSMLSpeakTags(text)}`;
      }
      return result;
    });
    return isSSML(target as string) || isSSML(mergeWith as string)
      ? toSSML(mergedText)
      : mergedText;
  }

  protected mergeText(
    target: string | undefined,
    mergeWith: string | undefined,
  ): string | undefined {
    if (!target && !mergeWith) {
      return;
    }
    if (!target && mergeWith) {
      return removeSSML(mergeWith);
    }
    if (!mergeWith && target) {
      return removeSSML(target);
    }
    return [target, mergeWith].reduce((result, text) => {
      if (text) {
        if (!result) {
          result = '';
        }
        result += `${result?.length ? ' ' : ''}${removeSSML(text)}`;
      }
      return result;
    }, undefined);
  }
}
