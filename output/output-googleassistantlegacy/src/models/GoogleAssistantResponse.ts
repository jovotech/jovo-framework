import {
  IsOptional,
  IsBoolean,
  Type,
  ValidateNested,
  IsArray,
  JovoResponse,
} from '@jovotech/output';
import { SystemIntent } from './common/SystemIntent';
import { RichResponse } from './RichResponse';
import { SimpleResponse } from './simple-response/SimpleResponse';

export class GoogleAssistantResponse extends JovoResponse {
  [key: string]: unknown;

  @IsOptional()
  @IsBoolean()
  expectUserResponse?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => SystemIntent)
  systemIntent?: SystemIntent;

  @ValidateNested()
  @Type(() => RichResponse)
  richResponse: RichResponse;

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => SimpleResponse)
  noInputPrompts?: SimpleResponse[];

  hasSessionEnded(): boolean {
    return !this.expectUserResponse;
  }
}
