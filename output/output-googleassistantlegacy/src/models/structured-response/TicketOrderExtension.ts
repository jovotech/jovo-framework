import { Type, ValidateNested } from '@jovotech/output';
import { TicketEvent } from './TicketEvent';

export class TicketOrderExtension {
  @ValidateNested()
  @Type(() => TicketEvent)
  ticketEvent: TicketEvent;
}
