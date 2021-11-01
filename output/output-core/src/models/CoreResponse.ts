import {
  IsArray,
  IsNotEmpty,
  IsString,
  JovoResponse,
  NormalizedOutputTemplate,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { Context } from './Context';

export class CoreResponse extends JovoResponse {
  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NormalizedOutputTemplate)
  output: NormalizedOutputTemplate[];

  @ValidateNested()
  @Type(() => Context)
  context: Context;

  hasSessionEnded(): boolean {
    return this.context.session.end;
  }
}
