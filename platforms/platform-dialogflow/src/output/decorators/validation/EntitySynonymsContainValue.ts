import { registerDecorator, ValidationArguments, ValidationOptions } from '@jovotech/output';
import { Entity } from '../../models/SessionEntityType';

export function EntitySynonymsContainValue(options?: ValidationOptions): PropertyDecorator {
  return function (target, propertyKey) {
    registerDecorator({
      name: 'entitySynonymsContainValue',
      target: target.constructor,
      propertyName: propertyKey.toString(),
      constraints: [],
      options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const entityValue = (args.object as Entity).value;
          if (!value.includes(entityValue)) {
            args.constraints[0] = '$property must contain exactly one synonym equal to value';
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments): string {
          return args.constraints[0];
        },
      },
    });
  };
}
