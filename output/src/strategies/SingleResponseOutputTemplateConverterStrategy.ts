import {
  mergeInstances,
  Message,
  NullableOutputTemplateBase,
  OutputTemplate,
  OutputTemplateBase,
  OutputTemplateConverterStrategyConfig,
  plainToClass,
  PlatformOutputTemplate,
} from '..';
import { OutputTemplateConverterStrategy } from '../OutputTemplateConverterStrategy';

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
      const mergeText = typeof message === 'string' ? message : (message as Message).text;
      target.message = target.message ? [target.message, mergeText].join(' ') : mergeText;
    }

    const reprompt = mergeWith.reprompt;
    if (reprompt) {
      const mergeText = typeof reprompt === 'string' ? reprompt : (reprompt as Message).text;
      target.reprompt = target.reprompt ? [target.reprompt, mergeText].join(' ') : mergeText;
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

    // if new listen is an object and not null
    const listen = mergeWith.listen;
    if (typeof listen === 'object' && listen) {
      target.listen = { ...listen };
      // if current listen is not an object and new listen is not undefined
    } else if (typeof target.listen !== 'object' && typeof listen !== 'undefined') {
      target.listen = listen;
    }
  }
}
