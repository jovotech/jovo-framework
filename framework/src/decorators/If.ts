import { JovoConditionFunction } from '../interfaces';
import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export const If: (conditionFunction: JovoConditionFunction) => MethodDecorator = (
  conditionFunction: JovoConditionFunction,
) => createHandlerOptionDecorator({ if: conditionFunction });
