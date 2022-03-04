import { DEFAULT_SESSION_EXPIRES_AFTER_SECONDS, JovoSession, PersistableSessionData } from '../src';

describe('setPersistableData', () => {
  test('is expired', () => {
    // expired at current time - session lifetime - one second to make sure it's before the actual expiration
    const expiredAtTimestamp =
      new Date().getTime() - DEFAULT_SESSION_EXPIRES_AFTER_SECONDS * 1000 - 1000;
    const persistableSessionData: PersistableSessionData = {
      id: 'foo',
      data: {
        foo: 'bar',
      },
      updatedAt: new Date(expiredAtTimestamp).toISOString(),
    };
    const session = new JovoSession();
    session.setPersistableData(persistableSessionData);
    expect(session.isNew).toBe(true);
    expect(session.data).toEqual({});
  });

  test('is not expired', () => {
    const persistableSessionData: PersistableSessionData = {
      id: 'foo',
      data: {
        foo: 'bar',
      },
      updatedAt: new Date().toISOString(),
    };
    const session = new JovoSession();
    session.setPersistableData(persistableSessionData);
    expect(session.isNew).toBe(false);
    expect(session.data).toEqual({
      foo: 'bar',
    });
  });
});
