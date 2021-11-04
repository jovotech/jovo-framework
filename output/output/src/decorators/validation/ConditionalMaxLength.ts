import { registerDecorator, ValidationArguments, ValidationOptions } from '../..';

export function ConditionalMaxLength<T = any>(
  conditionFn: (obj: T) => number,
  options?: ValidationOptions,
): PropertyDecorator {
  return function (object: any, propertyKey: string | symbol) {
    registerDecorator({
      name: 'conditionalMaxLength',
      target: object.constructor,
      propertyName: propertyKey.toString(),
      constraints: [conditionFn],
      options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) {
            return false;
          }
          const maxLength = args.constraints[0](args.object);
          return value.length <= maxLength;
        },
      },
    });
  };
}
