import { A, Test } from 'ts-toolbelt';
import { PartialDeep } from 'type-fest';
import {
  AnyObject,
  ArrayElement,
  Constructor,
  DeepPartial,
  OmitWhere,
  FilterKey,
  PickWhere,
  RequiredOnly,
  UnknownObject,
  OmitIndex,
  IndexSignature,
} from '../src';

{
  // ##### AnyObject #####
  Test.checks([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Test.check<AnyObject, Record<string, any>, Test.Pass>(),
    Test.check<AnyObject, Record<string, number>, Test.Fail>(),
  ]);
}

{
  // UnknownObject
  Test.checks([
    Test.check<UnknownObject, Record<string, unknown>, Test.Pass>(),
    Test.check<UnknownObject, Record<string, number>, Test.Fail>(),
  ]);
}

{
  // ##### ArrayElement<[...]> #####
  type StringArray = Array<string>;
  type ObjectArray = Array<number | UnknownObject>;

  Test.checks([
    // Should work with primitive types
    Test.check<ArrayElement<StringArray>, string, Test.Pass>(),
    // Should work with complex types
    Test.check<ArrayElement<ObjectArray>, number | UnknownObject, Test.Pass>(),
    // True negative testing
    Test.check<ArrayElement<StringArray>, number, Test.Fail>(),
  ]);
}

{
  // ##### DeepPartial #####
  type SomeType = {
    required: boolean;
    optional?: boolean;
    nested: {
      required: boolean;
      optional?: boolean;
    };
  };

  Test.checks([Test.check<DeepPartial<SomeType>, PartialDeep<SomeType>, Test.Pass>()]);
}

{
  // ##### Constructor<T, ARGS> #####
  type SomeType = {
    required: boolean;
    optional?: boolean;
    nested: {
      required: boolean;
      optional?: boolean;
    };
  };
  type SomeTypeConstructor = new (...args: string[]) => SomeType;

  Test.checks([Test.check<Constructor<SomeType, string[]>, SomeTypeConstructor, Test.Pass>()]);
}

{
  // ##### PickWhere<T, U> #####
  type SomeType = {
    validString: 'string';
    validBoolean: 'boolean';
    validOptional?: 'optional';
  };

  Test.checks([
    // Should correctly filter out any elements where the type does not match
    Test.check<PickWhere<SomeType, 'string'>, { validString: 'string' }, Test.Pass>(),
    // Should correctly pick elements for union types
    Test.check<
      PickWhere<SomeType, 'string' | 'boolean'>,
      { validString: 'string'; validBoolean: 'boolean' },
      Test.Pass
    >(),
    // Should keep type access property
    Test.check<
      PickWhere<SomeType, 'string' | 'optional'>,
      { validString: 'string'; validOptional?: 'optional' },
      Test.Pass
    >(),
    // True negative testing
    Test.check<PickWhere<SomeType, 'string'>, { invalid: number }, Test.Fail>(),
  ]);
}

{
  // ##### OmitWhere<T, U> #####
  type SomeType = {
    validString: 'string';
    validBoolean: 'boolean';
    validOptional?: 'optional';
  };

  Test.checks([
    // Should correctly filter out any elements where the type does not match
    Test.check<
      OmitWhere<SomeType, 'optional'>,
      { validString: 'string'; validBoolean: 'boolean' },
      Test.Pass
    >(),
    // Should correctly omit elements for union types
    Test.check<
      OmitWhere<SomeType, 'string' | 'optional'>,
      { validBoolean: 'boolean' },
      Test.Pass
    >(),
    // Should keep type access property
    Test.check<
      OmitWhere<SomeType, 'string' | 'boolean'>,
      { validOptional?: 'optional' },
      Test.Pass
    >(),
    // True negative testing
    Test.check<OmitWhere<SomeType, 'string'>, { invalid: number }, Test.Fail>(),
  ]);
}

{
  // ##### FilterKey<K, I> #####
  Test.checks([
    // Should return never if keys are equal
    Test.check<FilterKey<string, string>, never, Test.Pass>(),
    // Should return K if types are not equal
    Test.check<FilterKey<string, boolean>, string, Test.Pass>(),
    // True negative testing
    Test.check<FilterKey<string, boolean>, unknown, Test.Fail>(),
  ]);
}

{
  // ##### OmitIndex<T> #####
  type TypeWithIndexSignature = {
    [key: string]: string;
    required: string;
    optional?: string;
  };
  type TypeWithoutIndexSignature = {
    required: boolean;
    optional?: boolean;
  };

  Test.checks([
    // Should remove index signature of SomeType
    Test.check<
      OmitIndex<TypeWithIndexSignature>,
      { required: string; optional?: string },
      Test.Pass
    >(),
    // Should not alter object if no index signature is provided
    Test.check<
      OmitIndex<TypeWithoutIndexSignature>,
      { required: boolean; optional?: boolean },
      Test.Pass
    >(),
    // True negative testing
    Test.check<OmitIndex<TypeWithIndexSignature>, { invalid: string }, Test.Fail>(),
  ]);
}

{
  // ##### IndexSignature<T> #####
  type TypeWithIndexSignature = {
    [key: string]: string;
    required: string;
    optional?: string;
  };
  type TypeWithoutIndexSignature = {
    required: boolean;
    optional?: boolean;
  };

  Test.checks([
    // Should return index signature
    Test.check<IndexSignature<TypeWithIndexSignature>, string, Test.Pass>(),
    // Should return index signature of object without an explicit index signature
    Test.check<IndexSignature<TypeWithoutIndexSignature>, 'required' | 'optional', Test.Pass>(),
    // True negative testing
    Test.check<IndexSignature<TypeWithIndexSignature>, boolean, Test.Fail>(),
  ]);
}

{
  // ##### RequiredOnly<T> #####
  type SomeType = {
    required: boolean;
    optional?: boolean;
    nested: {
      required: boolean;
      optional?: boolean;
    };
    nestedOptional?: {
      required: boolean;
      optional?: boolean;
    };
  };

  Test.checks([
    // Should correctly filter out any elements that are optional
    Test.check<
      RequiredOnly<SomeType>,
      { required: boolean; nested: { required: boolean } },
      Test.Pass
    >(),
  ]);
}
