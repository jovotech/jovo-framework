import { IsInstance, IsOptional, Type, ValidateNested } from '..';
import { NormalizedOutputTemplatePlatforms } from './NormalizedOutputTemplatePlatforms';
import { OutputTemplateBase } from './OutputTemplateBase';

export class NormalizedOutputTemplate extends OutputTemplateBase {
  static getKeys(): Array<keyof NormalizedOutputTemplate> {
    return ['message', 'reprompt', 'listen', 'quickReplies', 'card', 'carousel', 'richAudio', 'platforms'];
  }

  @IsOptional()
  @IsInstance(NormalizedOutputTemplatePlatforms)
  @ValidateNested()
  @ValidateNested({ each: true })
  @Type(() => NormalizedOutputTemplatePlatforms)
  platforms?: NormalizedOutputTemplatePlatforms;
}
