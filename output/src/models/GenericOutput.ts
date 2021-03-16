import { Type } from 'class-transformer';
import { IsInstance, IsOptional, ValidateNested } from '../index';
import { GenericOutputBase } from './GenericOutputBase';
import { GenericOutputPlatforms } from './GenericOutputPlatforms';

export class GenericOutput extends GenericOutputBase {
  @IsOptional()
  @IsInstance(GenericOutputPlatforms)
  @ValidateNested()
  @Type(() => GenericOutputPlatforms)
  platforms?: GenericOutputPlatforms;
}
