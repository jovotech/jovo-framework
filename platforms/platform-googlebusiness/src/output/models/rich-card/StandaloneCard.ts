import { Card, Type, ValidateNested } from '@jovotech/output';
import { CardContent } from './CardContent';

export class StandaloneCard {
  @ValidateNested()
  @Type(() => CardContent)
  cardContent!: CardContent;

  toCard?(): Card {
    return this.cardContent.toCard!();
  }
}
