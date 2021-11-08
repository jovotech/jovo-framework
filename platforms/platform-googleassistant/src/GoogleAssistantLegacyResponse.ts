import {
  IsOptional,
  IsBoolean,
  Type,
  ValidateNested,
  IsArray,
  JovoResponse,
} from '@jovotech/output';
import { RichResponse, SimpleResponse, SystemIntent } from './output-legacy';

export class GoogleAssistantLegacyResponse extends JovoResponse {
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
  richResponse!: RichResponse;

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
