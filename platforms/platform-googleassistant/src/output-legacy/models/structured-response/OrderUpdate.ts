import { IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { Order } from './Order';
import { UserNotification } from './UserNotification';

export class OrderUpdate {
  @ValidateNested()
  @Type(() => Order)
  order!: Order;

  @IsString()
  @IsNotEmpty()
  updateMask!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserNotification)
  userNotification?: UserNotification;

  @IsString()
  @IsNotEmpty()
  reason!: string;
}
