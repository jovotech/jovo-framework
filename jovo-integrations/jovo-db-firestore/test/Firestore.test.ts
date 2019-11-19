import { BaseApp, JovoError } from 'jovo-core';
import _set = require('lodash.set'); // tslint:disable-line:no-implicit-dependencies

import { Firestore } from '../src/Firestore';

beforeEach(() => {
  jest.resetModules();
});

describe('test install()', () => {
  describe('test firebaseAdmin initialization', () => {
    test('should call initializeFirebaseAdmin()', () => {
      const app = new BaseApp();
      const firestore = new Firestore();
      jest.spyOn(firestore, 'initializeFirebaseAdmin').mockReturnValue();
      firestore.initializeFirestore = jest.fn();

      firestore.install(app);

      expect(firestore.initializeFirebaseAdmin).toHaveBeenCalledTimes(1);
    });

    describe('test initializeFirebaseAdmin()', () => {
      test(`should throw error because it couldn't import firebase-admin package`, () => {
        jest.doMock('firebase-admin', () => '');
        const firestore = new Firestore();

        expect(() => {
          firestore.initializeFirebaseAdmin();
        }).toThrowError(JovoError);
      });

      test('should call firebase-admin.initializeApp', () => {
        const mockInitializeApp = jest.fn();
        jest.doMock('firebase-admin', () => {
          return {
            credential: {
              cert: jest.fn(),
            },
            initializeApp: mockInitializeApp,
          };
        });
        const firestore = new Firestore();

        firestore.initializeFirebaseAdmin();

        expect(mockInitializeApp).toHaveBeenCalledTimes(1);
      });

      test('should assign firebase-admin package to firebaseAdmin property', () => {
        const mockFirebaseAdmin = {
          credential: {
            cert: jest.fn(),
          },
          initializeApp: jest.fn(),
        };
        jest.doMock('firebase-admin', () => mockFirebaseAdmin);
        const firestore = new Firestore();

        firestore.initializeFirebaseAdmin();

        expect(firestore.firebaseAdmin).toEqual(mockFirebaseAdmin);
      });
    });

    describe('test initializeFirestore()', () => {
      test('should throw JovoError because firebaseAdmin.firestore() returned a falsy object', () => {
        const mockFirebaseAdmin = {
          firestore: jest.fn().mockReturnValue(''),
        };
        const firestore = new Firestore();

        expect(() => {
          firestore.initializeFirestore(mockFirebaseAdmin);
        }).toThrowError(JovoError);
      });

      test('should call firestore.settings with timestampsInSnapshots set to true', () => {
        const mockSettings = jest.fn();
        const mockFirebaseAdmin = {
          firestore: () => {
            return {
              settings: mockSettings,
            };
          },
        };
        const firestore = new Firestore();

        firestore.initializeFirestore(mockFirebaseAdmin);

        expect(mockSettings).toHaveBeenCalledWith({
          timestampsInSnapshots: true,
        });
      });

      test('should assign the value of firebaseAdmin.firestore() to firestore property', () => {
        const mockSettings = jest.fn();
        const mockFirebaseAdmin = {
          firestore: () => {
            return {
              settings: mockSettings,
            };
          },
        };
        const firestore = new Firestore();

        firestore.initializeFirestore(mockFirebaseAdmin);

        expect(firestore.firestore).toEqual(mockFirebaseAdmin.firestore());
      });
    });
  });

  test('should call initializeFirestore()', () => {
    const app = new BaseApp();
    const firestore = new Firestore();
    jest.spyOn(firestore, 'initializeFirestore').mockReturnValue();
    firestore.initializeFirebaseAdmin = jest.fn();

    firestore.install(app);

    expect(firestore.initializeFirestore).toHaveBeenCalledTimes(1);
  });

  describe('test install() setting app.$db', () => {
    let firestore: Firestore;

    beforeEach(() => {
      firestore = new Firestore();
      firestore.initializeFirebaseAdmin = jest.fn();
      firestore.initializeFirestore = jest.fn();
    });

    test('test should set app.$db to be Firestore if no default db was set in config', () => {
      const app = new BaseApp();

      firestore.install(app);

      expect(app.$db).toBeInstanceOf(Firestore);
    });

    test('test app.$db should not be an instance of Firestore if default db set in config is not Firestore', () => {
      const app = new BaseApp();
      _set(app.config, 'db.default', 'test');

      firestore.install(app);

      expect(app.$db).not.toBeInstanceOf(Firestore);
    });

    test('test app.$db should be an instance Firestore if default db is set to Firestore', () => {
      const app = new BaseApp();
      _set(app.config, 'db.default', 'Firestore');

      firestore.install(app);

      expect(app.$db).toBeInstanceOf(Firestore);
    });
  });
});

describe('test errorHandling()', () => {
  let firestore: Firestore;

  beforeEach(() => {
    firestore = new Firestore();
  });

  test('should throw JovoError because collectionName is undefined', () => {
    const config = {
      credential: 'xyz',
      databaseURL: 'xyz',
    };
    _set(firestore, 'config', config);

    expect(() => {
      firestore.errorHandling();
    }).toThrowError(JovoError);
  });

  test('should throw JovoError because credential is undefined', () => {
    const config = {
      collectionName: 'xyz',
      databaseURL: 'xyz',
    };
    _set(firestore, 'config', config);

    expect(() => {
      firestore.errorHandling();
    }).toThrowError(JovoError);
  });

  test('should throw JovoError because databaseURL is undefined', () => {
    const config = {
      collectionName: 'xyz',
      credential: 'xyz',
    };
    _set(firestore, 'config', config);

    expect(() => {
      firestore.errorHandling();
    }).toThrowError(JovoError);
  });
});

describe('test database operations', () => {
  let firestore: Firestore;

  beforeEach(() => {
    firestore = new Firestore();
  });

  describe('test load()', () => {
    test('should call errorHandling()', async () => {
      jest.spyOn(firestore, 'errorHandling').mockImplementation(() => '');
      const mockFirestore = {
        collection: jest.fn().mockImplementation(() => {
          return {
            doc: jest.fn().mockImplementation(() => {
              return {
                get: jest.fn().mockImplementation(() => {
                  return {
                    data: jest.fn(),
                  };
                }),
              };
            }),
          };
        }),
      };
      _set(firestore, 'firestore', mockFirestore);

      await firestore.load('id');

      expect(firestore.errorHandling).toHaveBeenCalled();
    });

    test('should call firestore.collection() with config.collectionName', async () => {
      firestore.errorHandling = jest.fn();
      const mockCollection = jest.fn();
      const mockFirestore = {
        collection: mockCollection.mockImplementation(() => {
          return {
            doc: jest.fn().mockImplementation(() => {
              return {
                get: jest.fn().mockImplementation(() => {
                  return {
                    data: jest.fn(),
                  };
                }),
              };
            }),
          };
        }),
      };
      _set(firestore, 'firestore', mockFirestore);

      await firestore.load('id');

      expect(mockCollection).toHaveBeenCalledWith(firestore.config.collectionName);
    });

    test('should call firestore.collection().doc() with primaryKey', async () => {
      firestore.errorHandling = jest.fn();
      const mockDoc = jest.fn();
      const mockFirestore = {
        collection: jest.fn().mockImplementation(() => {
          return {
            doc: mockDoc.mockImplementation(() => {
              return {
                get: jest.fn().mockImplementation(() => {
                  return {
                    data: jest.fn(),
                  };
                }),
              };
            }),
          };
        }),
      };
      _set(firestore, 'firestore', mockFirestore);

      await firestore.load('id');

      expect(mockDoc).toHaveBeenCalledWith('id');
    });

    test('should return the value returned by firestore.collection().doc().get().data()', async () => {
      firestore.errorHandling = jest.fn();
      const mockFirestore = {
        collection: jest.fn().mockImplementation(() => {
          return {
            doc: jest.fn().mockImplementation(() => {
              return {
                get: jest.fn().mockImplementation(() => {
                  return {
                    data: jest.fn().mockResolvedValue('data'),
                  };
                }),
              };
            }),
          };
        }),
      };
      _set(firestore, 'firestore', mockFirestore);

      const result = await firestore.load('id');

      expect(result).toBe('data');
    });
  });

  describe('test save()', () => {
    test('should call errorHandling()', async () => {
      jest.spyOn(firestore, 'errorHandling').mockImplementation(() => '');
      const mockFirestore = {
        collection: jest.fn().mockImplementation(() => {
          return {
            doc: jest.fn().mockImplementation(() => {
              return {
                set: jest.fn(),
              };
            }),
          };
        }),
      };
      _set(firestore, 'firestore', mockFirestore);

      await firestore.save('id', 'key', 'value');

      expect(firestore.errorHandling).toHaveBeenCalled();
    });

    test('should call firestore.collection() with config.collectionName', async () => {
      firestore.errorHandling = jest.fn();
      const mockCollection = jest.fn();
      const mockFirestore = {
        collection: mockCollection.mockImplementation(() => {
          return {
            doc: jest.fn().mockImplementation(() => {
              return {
                set: jest.fn(),
              };
            }),
          };
        }),
      };
      _set(firestore, 'firestore', mockFirestore);

      await firestore.save('id', 'key', 'value');

      expect(mockCollection).toHaveBeenCalledWith(firestore.config.collectionName);
    });

    test('should call firestore.collection().doc() with primaryKey', async () => {
      firestore.errorHandling = jest.fn();
      const mockDoc = jest.fn();
      const mockFirestore = {
        collection: jest.fn().mockImplementation(() => {
          return {
            doc: mockDoc.mockImplementation(() => {
              return {
                set: jest.fn(),
              };
            }),
          };
        }),
      };
      _set(firestore, 'firestore', mockFirestore);

      await firestore.save('id', 'key', 'value');

      expect(mockDoc).toHaveBeenCalledWith('id');
    });

    test('should call firestore.collection().doc().set() with {[key]: data} and {merge: true}', async () => {
      firestore.errorHandling = jest.fn();
      const mockSet = jest.fn();
      const mockFirestore = {
        collection: jest.fn().mockImplementation(() => {
          return {
            doc: jest.fn().mockImplementation(() => {
              return {
                set: mockSet,
              };
            }),
          };
        }),
      };
      _set(firestore, 'firestore', mockFirestore);

      await firestore.save('id', 'key', 'value');

      expect(mockSet).toHaveBeenCalledWith({ key: 'value' }, { merge: true });
    });
  });

  describe('test delete()', () => {
    test('should call errorHandling()', async () => {
      jest.spyOn(firestore, 'errorHandling').mockImplementation(() => '');
      const mockFirestore = {
        collection: jest.fn().mockImplementation(() => {
          return {
            doc: jest.fn().mockImplementation(() => {
              return {
                delete: jest.fn(),
              };
            }),
          };
        }),
      };
      _set(firestore, 'firestore', mockFirestore);

      await firestore.delete('id');

      expect(firestore.errorHandling).toHaveBeenCalled();
    });

    test('should call firestore.collection() with config.collectionName', async () => {
      firestore.errorHandling = jest.fn();
      const mockCollection = jest.fn();
      const mockFirestore = {
        collection: mockCollection.mockImplementation(() => {
          return {
            doc: jest.fn().mockImplementation(() => {
              return {
                delete: jest.fn(),
              };
            }),
          };
        }),
      };
      _set(firestore, 'firestore', mockFirestore);

      await firestore.delete('id');

      expect(mockCollection).toHaveBeenCalledWith(firestore.config.collectionName);
    });

    test('should call firestore.collection().doc() with primaryKey', async () => {
      firestore.errorHandling = jest.fn();
      const mockDoc = jest.fn();
      const mockFirestore = {
        collection: jest.fn().mockImplementation(() => {
          return {
            doc: mockDoc.mockImplementation(() => {
              return {
                delete: jest.fn(),
              };
            }),
          };
        }),
      };
      _set(firestore, 'firestore', mockFirestore);

      await firestore.delete('id');

      expect(mockDoc).toHaveBeenCalledWith('id');
    });

    test('should call firestore.collection().doc().delete()', async () => {
      firestore.errorHandling = jest.fn();
      const mockDelete = jest.fn();
      const mockFirestore = {
        collection: jest.fn().mockImplementation(() => {
          return {
            doc: jest.fn().mockImplementation(() => {
              return {
                delete: mockDelete,
              };
            }),
          };
        }),
      };
      _set(firestore, 'firestore', mockFirestore);

      await firestore.delete('id');

      expect(mockDelete).toHaveBeenCalled();
    });
  });
});
