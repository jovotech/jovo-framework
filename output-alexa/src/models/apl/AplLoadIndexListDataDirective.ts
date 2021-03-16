import { Equals, IsInt, IsNotEmpty, IsString, Min } from '@jovotech/output';
import { AplIndexListDirective } from './AplIndexListDirective';

export class AplLoadIndexListDataDirective extends AplIndexListDirective<'Alexa.Presentation.APL.LoadIndexListData'> {
  @Equals('Alexa.Presentation.APL.LoadIndexListData')
  type: 'Alexa.Presentation.APL.LoadIndexListData';

  @IsString()
  @IsNotEmpty()
  correlationToken: string;

  @IsInt()
  @Min(1)
  count: number;
}
