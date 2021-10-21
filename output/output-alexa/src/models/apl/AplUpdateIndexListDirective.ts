import { Equals, IsArray, IsInt, Min, Type, ValidateNested } from '@jovotech/output';
import { APL_LIST_VERSION_MIN } from '../../constants';
import { AplIndexListDirective } from './AplIndexListDirective';
import { AplOperation, AplOperationType } from './AplOperation';
import { AplDeleteItemOperation } from './operations/AplDeleteItemOperation';
import { AplDeleteItemsOperation } from './operations/AplDeleteItemsOperation';
import { AplInsertItemOperation } from './operations/AplInsertItemOperation';
import { AplInsertItemsOperation } from './operations/AplInsertItemsOperation';
import { AplSetItemOperation } from './operations/AplSetItemOperation';

export class AplUpdateIndexListDirective extends AplIndexListDirective<'Alexa.Presentation.APL.UpdateIndexListData'> {
  @Equals('Alexa.Presentation.APL.UpdateIndexListData')
  type: 'Alexa.Presentation.APL.UpdateIndexListData';

  @IsInt()
  @Min(APL_LIST_VERSION_MIN)
  listVersion: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AplOperation, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [
        { value: AplInsertItemOperation, name: AplOperationType.InsertItem },
        { value: AplInsertItemsOperation, name: AplOperationType.InsertItems },
        { value: AplSetItemOperation, name: AplOperationType.SetItem },
        { value: AplDeleteItemOperation, name: AplOperationType.DeleteItem },
        { value: AplDeleteItemsOperation, name: AplOperationType.DeleteItems },
      ],
    },
  })
  operations: AplOperation[];
}
