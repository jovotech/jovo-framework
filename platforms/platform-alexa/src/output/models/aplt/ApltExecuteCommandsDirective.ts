import { Equals, IsArray, IsObject } from '@jovotech/output';
import { AplDirective } from '../apl/AplDirective';

export class ApltExecuteCommandsDirective extends AplDirective<'Alexa.Presentation.APLT.ExecuteCommands'> {
  @Equals('Alexa.Presentation.APLT.ExecuteCommands')
  type!: 'Alexa.Presentation.APLT.ExecuteCommands';

  @IsArray()
  @IsObject({ each: true })
  commands!: Record<string, unknown>[];
}
