import {
  IsArray,
  IsNotEmpty,
  IsString,
  JovoResponse,
  OutputTemplate,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { Context } from './Context';

// TODO: Find better names for output and repromptOutputs!
export class CoreResponse extends JovoResponse {
  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OutputTemplate)
  output: OutputTemplate[];

  @ValidateNested()
  @Type(() => Context)
  context: Context;
}
