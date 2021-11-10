import { IsNotEmpty, IsObject, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { AlexaResponse } from './AlexaResponse';
import { Response } from './Response';

export class AlexaOutputTemplateResponse implements Partial<AlexaResponse> {
  [key: string]: unknown;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  version?: string;

  @IsOptional()
  @IsObject()
  sessionAttributes?: Record<string, unknown>;

  @IsOptional()
  @ValidateNested()
  @Type(() => Response)
  response?: Response;
}
