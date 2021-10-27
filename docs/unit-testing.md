---
title: 'Unit Testing'
excerpt: 'Learn more about unit testing conversational apps with Jovo.'
---

# Unit Testing

The Jovo TestSuite allows you to create and run unit tests that work across voice and chat platforms.

## Introduction

Unit Testing is a testing method that helps you make sure individual units of software work as expected. This way you don't have to manually test every potential interaction of your Jovo app after any change you do to the code.

The Jovo TestSuite builds on top of [Jest](https://jestjs.io/), a popular Javascript testing framework. It offers a set of features that helps you test your Jovo apps, both individual interactions as well as full conversational sequences.

Each Jovo project comes with a `test` folder and at least a `sample.test.ts` file that looks like this:

```typescript
import { TestSuite, InputType } from '@jovotech/framework';

const testSuite = new TestSuite();

test('should ask the user if they like pizza', async () => {
  const { output } = await testSuite.run({
    type: InputType.Launch, // or 'LAUNCH'
  });

  expect(output).toEqual([
    {
      message: 'Do you like pizza?',
      quickReplies: ['yes', 'no'],
      listen: true,
    },
  ]);
});
```

To run all tests, use the following command in your terminal:

```sh
$ npm test
```

In the following sections, we're going to dive deeper into writing unit tests for the Jovo Framework. First, we're going to take a look at the [structure of a unit test](#structure-of-a-unit-test). After that, we'll dive into the [TestSuite configuration](#testsuite-configuration).

The TestSuite is based on the [RIDR lifecycle](./ridr-lifecycle.md) and allows you to either test native platform request and response objects as well as the abstracted Jovo `$input` and `$output` properties. Learn more in the [different ways of testing](#different-ways-of-testing) section.

For more advanced testing, we will then take a look at [sequences](#text-sequences) and [context](#text-context).

## Structure of a Unit Test

Unit test files are usually located in a `test` folder of your Jovo project and are called `<name>.test.ts`.

Here is a full example of a test file with one unit test:

```typescript
import { TestSuite, InputType } from '@jovotech/framework';

const testSuite = new TestSuite();

test('should ask the user if they like pizza', async () => {
  const { output } = await testSuite.run({
    type: InputType.Launch, // or 'LAUNCH'
  });

  expect(output).toEqual([
    {
      message: 'Do you like pizza?',
      quickReplies: ['yes', 'no'],
      listen: true,
    },
  ]);
});
```

A test file consists of the following elements:

- [`TestSuite` initialization](#testsuite-initialization): The TestSuite gets configured here.
- [`test`](#test): Each unit test is added as a callback function inside this method.
- [`run`](#run): This method takes either an input object or a native request object and returns output and a native response.
- [`expect`](#expect): This and other Jest methods are used to test if the result from `run` looks as expected.

### TestSuite Initialization

The `TestSuite` is used to simulate a conversational request-response lifecycle that can then be tested using the Jest [`expect` method](#expect).

In most cases, the suite is initialized globally before all tests:

```typescript
import { TestSuite } from '@jovotech/framework';
// ...

const testSuite = new TestSuite({
  /* options */
});
```

It is also possible to initialize the `TestSuite` inside a `describe` block. This way, you can have differing configurations for different groups of tests. Learn more about [`describe` in the official Jest docs](https://jestjs.io/docs/api#describename-fn).

```typescript
describe(`...` , async () => {

  const testSuite = new TestSuite({ /* options */ });

  test('first ...', async () => { /* ... */ });
  test('second ...', async () => { /* ... */ });
  // ...
}
```

There are various options like `platform` that can be added to the constructor. Learn more in the [TestSuite configuration section](#testsuite-configuration).

### test

A test file is separated into multiple unit tests that are all defined using a `test` method. The first parameter is the `name` of the test (which will be displayed when executing the tests) and the second is a callback function that includes the test logic. Learn more about [`test` in the official Jest docs](https://jestjs.io/docs/api#testname-fn-timeout).

```typescript
test('should ...', async () => {
  // ...
});
```

If you want to group tests, you can also use [`describe`](#describe). Learn more about [`describe` in the official Jest docs](https://jestjs.io/docs/api#describename-fn).

```typescript
describe(`...` , async () => {

  test('first ...', async () => { /* ... */ });
  test('second ...', async () => { /* ... */ });
  // ...
}
```

### run

The `run` method either takes an [input object](#input) or a [request](#request), executes the [RIDR lifecycle](./ridr-lifecycle.md), and returns both [`output`](#output) and a [`response`](#response):

```typescript
import { TestSuite, InputType } from '@jovotech/framework';
// ...

test('should ask the user if they like pizza', async () => {
  const testSuite = new TestSuite();

  const { output, response } = await testSuite.run({
    type: InputType.Launch, // or 'LAUNCH'
  });

  // ...
});
```

The following results are returned by `run`:

- `output`: The Jovo [`$output` array](./output.md) as the result of the handler execution. Useful for cross-platform testing.
- `response`: The native platform response that the `$output` gets translated to. Useful for platform-specific testing.

It is also possible to [test sequences](#sequence-testing) by either using the `run` command multiple times or by passing an array. The below example first simulates a `LAUNCH` input and then a `YesIntent`:

```typescript
import { TestSuite, InputType } from '@jovotech/framework';
// ...

const testSuite = new TestSuite();

test('should respond in a positive way if user likes pizza', async () => {
  const { output } = await testSuite.run([
    {
      type: InputType.Launch,
    },
    {
      intent: 'YesIntent',
    },
  ]);

  // ...
});
```

Learn more in the [sequence testing](#test-sequences) section.

### expect

The `output` and `response` from `run` can be tested using `expect`.

Below is an example that tests if the resulting `output` equals an output template:

```typescript
test('should ask the user if they like pizza', async () => {
  // ...

  expect(output).toEqual([
    {
      message: 'Hello World! Do you like pizza?',
    },
  ]);
});
```

Jest offers many methods like `toEqual` in the example above. Learn more [in the official Jest docs](https://jestjs.io/docs/expect).

For example, you can also test `output` elements like this:

```typescript
test('should accept an input object, should return an output object', async () => {
  // ...

  expect(output).toHaveLength(1);
  expect(output[0].message).toBeDefined();
  expect(output[0].message).toMatch('Hello World! Do you like pizza?');
});
```

## TestSuite Configuration

When the [`TestSuite` gets initialized](#testsuite-initialization), you can add configuration options to the constructor:

```typescript
import { TestSuite } from '@jovotech/framework';
// ...

const testSuite = new TestSuite({
  /* options */
});
```

The following options are available:

- [`platform`](#platform): The platform (e.g. Alexa) the TestSuite should simulate.
- [`userId`](#userid): The user ID that should be used. Default: Random user ID.
- [`locale`](#locale): The language that should be used. Default: `en`.
- [`data`](#data): Configurations for data persistence. Default: Delete data after each test.
- [`stage`](#stage): Which app stage should be used. Default: `dev`.
- [`app`](#app): If you want to build your own `app` instance and pass it to the TestSuite, you can do it here.

### platform

The `platform` property accepts a constructor of a Jovo [platform integration](./platforms.md).

Here is an example for Alexa:

```typescript
import { AlexaPlatform } from '@jovotech/platform-alexa';

// ...

const testSuite = new TestSuite({ platform: AlexaPlatform });
```

If you want to test multiple platforms, you can use a `for` loop like this:

```typescript
import { TestSuite } from '@jovotech/framework';
import { AlexaPlatform } from '@jovotech/platform-alexa';
import { GoogleAssistantPlatform } from '@jovotech/platform-googleassistant';

// ...

for (const Platform of [AlexaPlatform, GoogleAssistantPlatform]) {
  const testSuite = new TestSuite({ platform: Platform });

  test('should...', async () => {
    /* ... */
  });
  test('should...', async () => {
    /* ... */
  });
}
```

### userId

If you want to define your own user IDs for unit tests, you can do so using the `userId` property:

```typescript
const testSuite = new TestSuite({ userId: 'test-user' });
```

By default, a random user ID will be generated.

### locale

The `locale` property lets you define which language should be tested:

```typescript
const testSuite = new TestSuite({ locale: 'en' });
```

The default value is `en`.

### data

The TestSuite instance stores [different types of data](./data.md) like session data and user data in-memory, so there is no database integration needed to test data persistence.

By default, Jovo deletes the data after each test to make sure that there are no side effects between tests.

You can also modify this behavior in the `data` property:

```typescript
const testSuite = new TestSuite({
  data: {
    deleteAfterEach: true;
    deleteAfterAll: true;
  }
});
```

The properties follow the [Jest setup and teardown](https://jestjs.io/docs/setup-teardown) conventions:

- `deleteAfterEach`: Data should be deleted after each test.
- `deleteAfterAll`: Data should be deleted after all tests in this scope, which means either after all tests in this `describe` group or after all global tests.

### stage

The `stage` property defines which [app configuration](./app-config.md) should be used for the unit tests. [Learn more about staging here](./staging.md).

```typescript
const testSuite = new TestSuite({ stage: 'dev' });
```

By default, `dev` will be used.

### app

Potentially, there are different ways how you can set up the Jovo `app` instance. [Learn more about app configuration here](./app-config.md).

For more advanced or custom use cases, the `app` property allows you to build your own instance and pass it to the TestSuite.

```typescript
import app from '../src/myApp';

// ...

const testSuite = new TestSuite({ app });
```

By default, the Jovo `app.ts` and the stage defined in [`stage`](#stage) will be used.

## Different Ways of Testing

The TestSuite utilizes the [RIDR lifecycle](./ridr-lifecycle.md) and potentially involves all the [RIDR properties](./jovo-properties.md#ridr-properties):

- [Request](#request): The native JSON request being sent by a platform.
- [Input](#input): An abstracted object that contains structured data that is derived from a request.
- [Output](#output): An array that contains structured output objects.
- [Response](#response): The native JSON response that is returned to the platform.

The TestSuite's [`run` method](#run) method accepts either a request or an input object, and returns both output and a response:

```typescript
const { output, response } = await testSuite.run(/* request or input */);
```

We recommend using [input](#input) and [output](#output) for most flows that don't rely on any heavy platform-specific features. For flows that go beyond that, you can use [request](#request) and [response](#response).

### Request

You can use JSON requests to test the flow in the same way as if a platform sends a request to your app. For most use cases, we recommend [input testing](#input).

Below, you can find an example that imports a request JSON file and passes it to the [`run` method](#run):

```typescript
import CustomRequest from './requests/CustomRequest';
// ...

test('should accept a custom request', async () => {
  // ...

  const { output, response } = await testSuite.run(CustomRequest);

  // ...
});
```

### Input

The Jovo `$input` property contains structured data that is derived from a request. Since it is an abstracted object that works across platforms, we recommend using the input object for running unit tests for most use cases. [Learn more about the `$input` property here](./input.md).

You can pass an input object to the [`run` method](#run) like this:

```typescript
import { TestSuite, InputType } from '@jovotech/framework';
// ...

test('should ask the user if they like pizza', async () => {
  // ...

  const { output, response } = await testSuite.run({
    type: InputType.Launch, // or 'LAUNCH'
  });

  // ...
});
```

By default, the input is of the type `INTENT`. You can add intents and entities to the object like this:

```typescript
const { output, response } = await testSuite.run({
  intent: 'MyNameIsIntent',
  entities: {
    name: {
      value: 'Max',
    },
  },
});
```

You can find all input types and properties in the [`$input` documentation](./input.md).

### Output

The `$output` array is assembled by the handlers that return output using the `$send` method. This structured output is then turned into a native platform response. [Learn more about the `$output` property here](./output.md).

Since the `$output` property is an array of abstracted [output templates](./output-templates.md) that work across platforms, we recommend using this method over [response testing](#response) for most use cases.

For example, you can use `toEqual` (see the [`expect` section](#expect) above) to test if the tested and desired `output` arrays match:

```typescript
const { output } = await testSuite.run(/* request or input */);

expect(output).toEqual([
  {
    message: 'Hello World! Do you like pizza?',
  },
]);
```

### Response

As part of the [RIDR lifecycle](./ridr-lifecycle.md), the [`$output`](#output) array is turned into a native platform response which is then returned to the platform.

We recommend testing with output for most flows. For experiences that heavily rely on platform-specific response features, you can also test the response object. Below, you can find an example for Alexa:

```typescript
import { TestSuite } from '@jovotech/framework';
import { AlexaPlatform } from '@jovotech/platform-alexa';

test('should accept an Alexa request, should return an Alexa response', async () => {
  const testSuite = new TestSuite({ platform: AlexaPlatform });
  // ...

  const { response } = await testSuite.run(/* request or input */);

  expect(response.hasSessionEnded()).toBeFalsy();
  expect(response.response.outputSpeech).toBeDefined();
  expect(response.response.outputSpeech!.ssml).toMatch(
    '<speak>Hello World! Do you like pizza?</speak>',
  );
});
```

The TestSuite automatically infers the types depending on the platform. In the example above, `response` is of type `AlexaResponse`.

## Test Sequences

For conversations that include multiple interactions, you can use the [`run` method](#run) multiple times in one test:

```typescript
import { TestSuite, InputType } from '@jovotech/framework';
// ...

const testSuite = new TestSuite();

test('should respond in a positive way if user likes pizza', async () => {
  // First interaction
  await testSuite.run({
    type: InputType.Launch,
  });

  // Second interaction
  const { output } = await testSuite.run({
    intent: 'YesIntent',
  });

  // ...
});
```

You can also pass an array to the `run` method:

```typescript
import { TestSuite, InputType } from '@jovotech/framework';
// ...

const testSuite = new TestSuite();

test('should respond in a positive way if user likes pizza', async () => {
  const { output } = await testSuite.run([
    {
      type: InputType.Launch,
    },
    {
      intent: 'YesIntent',
    },
  ]);

  // ...
});
```

If you want to test the steps along the way, you can also do something like this:

```typescript
import { TestSuite, InputType } from '@jovotech/framework';
// ...

const testSuite = new TestSuite();

test('should respond in a positive way if user likes pizza', async () => {
  // First interaction
  const { output: launchOutput } = await testSuite.run({
    type: InputType.Launch,
  });
  expect(launchOutput).toEqual([
    {
      message: 'Hello World! Do you like pizza?',
    },
  ]);

  // Second interaction
  const { output: yesOutput } = await testSuite.run({
    intent: 'YesIntent',
  });
  expect(yesOutput).toEqual([
    {
      message: 'Yes! I love pizza, too.',
    },
  ]);
});
```

## Test Context

The TestSuite allows you to access [Jovo properties](./jovo-properties.md) in order to modify certain elements before the [`run` method](#run) is executed.

This is especially relevant for [different types of data](./data.md), for example user data that needs to be set before running a test:

```typescript
import { TestSuite, InputType } from '@jovotech/framework';
// ...

const testSuite = new TestSuite();

test('...', async () => {
  testSuite.$user.data = {
    /* ... */
  };

  // ...
});
```
