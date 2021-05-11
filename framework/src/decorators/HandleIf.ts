import { BaseComponent } from '../BaseComponent';
import { JovoConditionFunction } from '../interfaces';
import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export const HandleIf = <
  COMPONENT extends BaseComponent = BaseComponent,
  KEY extends keyof COMPONENT = keyof COMPONENT
>(
  conditionFunction: JovoConditionFunction,
) => createHandlerOptionDecorator<COMPONENT, KEY>({ if: conditionFunction });
