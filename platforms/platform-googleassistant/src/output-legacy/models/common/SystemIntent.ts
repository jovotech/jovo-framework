import { IsNotEmpty, IsString, Type, ValidateNested } from '@jovotech/output';
import { SystemIntentData } from './SystemIntentData';

export class SystemIntent {
  @IsString()
  @IsNotEmpty()
  intent!: string | 'actions.intent.OPTION';

  @ValidateNested()
  @Type(() => SystemIntentData)
  data!: SystemIntentData;
}
