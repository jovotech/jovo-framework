import {
  Equals,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from '@jovotech/output';
import { APL_LIST_VERSION_MIN } from '../../constants';
import { AplIndexListDirective } from './AplIndexListDirective';

export class AplSendIndexListDataDirective extends AplIndexListDirective<'Alexa.Presentation.APL.SendIndexListData'> {
  @Equals('Alexa.Presentation.APL.SendIndexListData')
  type: 'Alexa.Presentation.APL.SendIndexListData';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  correlationToken?: string;

  @IsOptional()
  @IsInt()
  @Min(APL_LIST_VERSION_MIN)
  listVersion?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  minimumInclusiveIndex?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  maximumExclusiveIndex?: string;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  items?: Record<string, unknown>[];
}
