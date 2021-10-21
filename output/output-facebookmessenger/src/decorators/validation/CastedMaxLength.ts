import { registerDecorator, ValidationArguments, ValidationOptions } from '@jovotech/output';

export function CastedMaxLength(max: number, options?: ValidationOptions): PropertyDecorator {
  return function (object, propertyKey) {
    registerDecorator({
      name: 'castedMaxLength',
      target: object.constructor,
      propertyName: propertyKey.toString(),
      constraints: [max],
      options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value.toString()) {
            return false;
          }
          return value.toString().length <= max;
        },
      },
    });
  };
}
