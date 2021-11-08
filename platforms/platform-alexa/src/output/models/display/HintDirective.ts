import { Equals, Type, ValidateNested } from '@jovotech/output';
import { Directive } from '../Directive';
import { TextContentItem } from './TextContentItem';

export class HintDirective extends Directive<'Hint'> {
  @Equals('Hint')
  type!: 'Hint';

  @ValidateNested()
  @Type(() => TextContentItem)
  hint!: TextContentItem;
}
