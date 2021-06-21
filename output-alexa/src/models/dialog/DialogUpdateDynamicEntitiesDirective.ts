import { Equals, IsEnum, Type } from '@jovotech/output';
import { IsValidDynamicEntitiesSlotTypesArray } from '../../decorators/validation/IsValidDynamicEntitiesSlotTypesArray';
import { SlotType } from '../common/SlotType';
import { Directive } from '../Directive';

export enum DynamicEntitiesUpdateBehavior {
  Replace = 'REPLACE',
  Clear = 'CLEAR',
}

export type DynamicEntitiesUpdateBehaviorLike =
  | DynamicEntitiesUpdateBehavior
  | `${DynamicEntitiesUpdateBehavior}`;

export class DialogUpdateDynamicEntitiesDirective<
  BEHAVIOR extends DynamicEntitiesUpdateBehaviorLike = DynamicEntitiesUpdateBehaviorLike,
> extends Directive<'Dialog.UpdateDynamicEntities'> {
  constructor() {
    super();
    this.type = 'Dialog.UpdateDynamicEntities';
  }

  @Equals('Dialog.UpdateDynamicEntities')
  type: 'Dialog.UpdateDynamicEntities';

  @IsEnum(DynamicEntitiesUpdateBehavior)
  updateBehavior: BEHAVIOR;

  @IsValidDynamicEntitiesSlotTypesArray()
  @Type(() => SlotType)
  types: BEHAVIOR extends DynamicEntitiesUpdateBehavior.Clear ? never : SlotType[];
}
