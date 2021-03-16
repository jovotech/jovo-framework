import { Equals, IsArray, IsObject } from '@jovotech/output';
import { AplDirective } from './AplDirective';

export class AplExecuteCommandsDirective extends AplDirective<'Alexa.Presentation.APL.ExecuteCommands'> {
  @Equals('Alexa.Presentation.APL.ExecuteCommands')
  type: 'Alexa.Presentation.APL.ExecuteCommands';

  @IsArray()
  @IsObject({ each: true })
  commands: Record<string, unknown>[];
}
