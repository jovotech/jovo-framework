import { IsInstance, IsOptional, Type, ValidateNested } from '..';
import { OutputTemplateBase } from './OutputTemplateBase';
import { OutputTemplatePlatforms } from './OutputTemplatePlatforms';

export class OutputTemplate extends OutputTemplateBase {
  static getKeys(): Array<keyof OutputTemplate> {
    return ['message', 'reprompt', 'listen', 'quickReplies', 'card', 'carousel', 'platforms'];
  }

  @IsOptional()
  @IsInstance(OutputTemplatePlatforms)
  @ValidateNested()
  @ValidateNested({ each: true })
  @Type(() => OutputTemplatePlatforms)
  platforms?: OutputTemplatePlatforms;
}
