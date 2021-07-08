import { JovoConditionFunction } from '../interfaces';
import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export const If = (conditionFunction: JovoConditionFunction) =>
  createHandlerOptionDecorator({ if: conditionFunction });
