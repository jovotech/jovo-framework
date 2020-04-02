import { AutopilotResponse } from '../src/core/AutopilotResponse';

process.env.NODE_ENV = 'UNIT_TEST';

describe('test hasSessionEnded()', () => {
  let response: AutopilotResponse;
  beforeEach(() => {
    response = new AutopilotResponse();
  });

  test('action contains Listen action', () => {
    response.actions = [
      {
        listen: true,
      },
    ];

    expect(response.hasSessionEnded()).toBe(false);
  });

  test('action contains Redirect action', () => {
    response.actions = [
      {
        redirect: 'test',
      },
    ];

    expect(response.hasSessionEnded()).toBe(false);
  });

  test('action contains Collect action', () => {
    response.actions = [
      {
        collect: {}, // actual content of the action is not important
      },
    ];

    expect(response.hasSessionEnded()).toBe(false);
  });

  test('action does not contain Listen, Redirect, or Collect action', () => {
    response.actions = [
      {
        say: 'hello World',
      },
    ];

    expect(response.hasSessionEnded()).toBe(true);
  });
});
