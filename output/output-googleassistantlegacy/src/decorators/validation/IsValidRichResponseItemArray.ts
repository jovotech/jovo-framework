import { registerDecorator, ValidationArguments, ValidationOptions } from '@jovotech/output';
import { RichResponseItem } from '../../models';

export function IsValidRichResponseItemArray(options?: ValidationOptions): PropertyDecorator {
  return function (object: any, propertyKey: string | symbol) {
    registerDecorator({
      name: 'isValidRichResponseItemArray',
      target: object.constructor,
      propertyName: propertyKey.toString(),
      constraints: [],
      options,
      async: true,
      validator: {
        async validate(value: RichResponseItem[], args: ValidationArguments) {
          if (!Array.isArray(value)) {
            args.constraints[0] = '$property has to be an array';
            return false;
          }

          if (!value.length) {
            args.constraints[0] = '$property has to contain at least one element';
            return false;
          }

          if (!value[0].simpleResponse) {
            args.constraints[0] = 'The first item of $property has to be SimpleResponse';
            return false;
          }
          if (value.filter((item) => item.simpleResponse).length > 2) {
            args.constraints[0] = 'There can be two SimpleResponses at most in $property';
            return false;
          }
          if (
            value.filter(
              (item) =>
                item.basicCard ||
                item.structuredResponse ||
                item.mediaResponse ||
                item.htmlResponse,
            ).length > 1
          ) {
            args.constraints[0] =
              'There can be at most one rich response item. (BasicCard, StructuredResponse, MediaResponse or HtmlResponse)';
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return args.constraints[0];
        },
      },
    });
  };
}
