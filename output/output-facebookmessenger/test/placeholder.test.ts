import { plainToClass, validate, ValidationOptions } from '@jovotech/output';

function transformAndValidate<T extends Record<string, any> = Record<string, any>>(
  objClass: new () => T,
  obj: T,
  options?: ValidationOptions,
) {
  return validate(plainToClass(objClass, obj), options);
}

test('placeholder', async () => {
  expect(true).toBe(true);
});
