import { IsArray, ValidateNested, IsIn } from '@jovotech/output';
import { TransformAction } from '../../decorators/transformation/TransformAction';
import { ActionType, Action } from './Action';

export class ContainerAction extends Action<
  ActionType.SequenceContainer | ActionType.ParallelContainer
> {
  @IsIn([ActionType.SequenceContainer, ActionType.ParallelContainer])
  type: ActionType.SequenceContainer | ActionType.ParallelContainer;

  @IsArray()
  @ValidateNested({ each: true })
  @TransformAction()
  actions: Action[];
}
