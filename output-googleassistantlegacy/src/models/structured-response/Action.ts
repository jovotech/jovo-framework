import { IsEnum, IsNotEmpty, MaxLength, IsString, Type, ValidateNested } from '@jovotech/output';
import { OpenUrlAction } from '../common/OpenUrlAction';
import { ActionMetadata } from './ActionMetadata';

export enum ActionType {
  Unspecified = 'TYPE_UNSPECIFIED',
  ViewDetails = 'VIEW_DETAILS',
  Modify = 'MODIFY',
  Cancel = 'CANCEL',
  Return = 'RETURN',
  Exchange = 'EXCHANGE',
  Reorder = 'REORDER',
  Review = 'REVIEW',
  CustomerService = 'CUSTOMER_SERVICE',
  FixIssue = 'FIX_ISSUE',
  Direction = 'DIRECTION',
}

export class Action {
  @IsEnum(ActionType)
  type: ActionType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ValidateNested()
  @Type(() => OpenUrlAction)
  openUrlAction: OpenUrlAction;

  @ValidateNested()
  @Type(() => ActionMetadata)
  actionMetadata: ActionMetadata;
}
