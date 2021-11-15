import { Equals, IsInt, IsNotEmpty, IsString, Min } from '@jovotech/output';
import { APL_OPERATION_COUNT_MIN } from '../../constants';
import { AplIndexListDirective } from './AplIndexListDirective';

export class AplLoadIndexListDataDirective extends AplIndexListDirective<'Alexa.Presentation.APL.LoadIndexListData'> {
  @Equals('Alexa.Presentation.APL.LoadIndexListData')
  type!: 'Alexa.Presentation.APL.LoadIndexListData';

  @IsString()
  @IsNotEmpty()
  correlationToken!: string;

  @IsInt()
  @Min(APL_OPERATION_COUNT_MIN)
  count!: number;
}
