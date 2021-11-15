import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  NormalizedOutputTemplate,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { CoreResponse } from '../../CoreResponse';
import { CoreResponseContext } from './CoreResponseContext';

export class CoreOutputTemplateResponse implements Partial<CoreResponse> {
  [key: string]: unknown;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  version?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NormalizedOutputTemplate)
  output?: NormalizedOutputTemplate[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NormalizedOutputTemplate)
  repromptOutput?: NormalizedOutputTemplate[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CoreResponseContext)
  context?: CoreResponseContext;
}
