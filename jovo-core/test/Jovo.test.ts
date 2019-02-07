import {BaseApp, Host, Jovo, SessionConstants, SpeechBuilder} from "../src";

class JovoImpl extends Jovo {
    getDeviceId(): string | undefined {
        return 'deviceId';
    }

    getLocale(): string | undefined {
        return 'locale';
    }

    getPlatformType(): string {
        return "platformType";
    }

    getRawText(): string | undefined {
        return 'rawText';
    }

    getSelectedElementId(): string | undefined {
        return 'selectedElementId';
    }

    getSpeechBuilder(): SpeechBuilder | undefined {
        return new SpeechBuilder(this);
    }

    getTimestamp(): string | undefined {
        return new Date().toISOString();
    }

    getType(): string | undefined {
        return 'JovoImpl';
    }

    hasAudioInterface(): boolean {
        return true;
    }

    hasScreenInterface(): boolean {
        return true;
    }

    hasVideoInterface(): boolean {
        return true;
    }

    isNewSession(): boolean {
        return false;
    }

    speechBuilder(): SpeechBuilder | undefined {
        return new SpeechBuilder(this);
    }

}

class DummyHost implements Host {
    $request: any; // tslint:disable-line
    hasWriteFileAccess: boolean;
    headers: { [p: string]: string };

    constructor() {
        this.$request = {};
        this.hasWriteFileAccess = true;
        this.headers = {
            'test': ''
        };
    }

    getRequestObject(): any { // tslint:disable-line
        return {};
    }

    setResponse(obj: any): Promise<any> { // tslint:disable-line
        return new Promise((resolve, reject) => {});
    }

    fail(error: Error) {

    }

}


let baseApp: BaseApp;
let jovo: JovoImpl;


beforeEach(() => {
    baseApp = new BaseApp();
    jovo = new JovoImpl(baseApp, new DummyHost());
});

test('test getState', () => {

    jovo.$session = {
        $data: {
            [SessionConstants.STATE]: 'STATE1',
        }
    };
    expect(jovo.getState()).toBe('STATE1');
});


test('test setState', () => {
    jovo.setState('STATE1');
    expect(jovo.getState()).toBe('STATE1');
});


test('test removeState', () => {
    jovo.$session = {
        $data: {
            [SessionConstants.STATE]: 'STATE1',
        }
    };
    expect(jovo.getState()).toBe('STATE1');
    jovo.removeState();
    expect(jovo.getState()).toBeUndefined();
});

test('test getSessionData', () => {
    jovo.$session = {
        $data: {
            foo: 'bar',
            a: 'b'
        }
    };
    expect(jovo.getSessionData()).toEqual({
        foo: 'bar',
        a: 'b'
    });
    expect(jovo.getSessionData('foo')).toBe('bar');
});

test('test getSessionAttribute', () => {
    jovo.$session = {
        $data: {
            foo: 'bar',
        }
    };
    expect(jovo.getSessionAttribute('foo')).toBe('bar');
});

test('test getSessionAttributes', () => {
    jovo.$session = {
        $data: {
            foo: 'bar',
            a: 'b'
        }
    };
    expect(jovo.getSessionData()).toEqual({
        foo: 'bar',
        a: 'b'
    });
});


test('test setSessionData', () => {
    jovo.setSessionData({
        foo: 'bar',
        a: 'b'
    });
    expect(jovo.getSessionData()).toEqual({
        foo: 'bar',
        a: 'b'
    });

    jovo.setSessionData('foofoo', 'barbar');
    expect(jovo.getSessionData()).toEqual({
        foo: 'bar',
        a: 'b',
        foofoo: 'barbar',
    });

});
test('test setSessionAttribute', () => {
    jovo.setSessionAttribute('foofoo', 'barbar');
    expect(jovo.getSessionData()).toEqual({
        foofoo: 'barbar',
    });
});


test('test addSessionAttribute', () => {
    jovo.addSessionAttribute('foofoo', 'barbar');
    expect(jovo.getSessionData()).toEqual({
        foofoo: 'barbar',
    });
});

test('test addSessionData', () => {
    jovo.addSessionData('foofoo', 'barbar');
    expect(jovo.getSessionData()).toEqual({
        foofoo: 'barbar',
    });
});
test('test setSessionAttributes', () => {
    jovo.setSessionAttributes({
        foo: 'bar',
        a: 'b'
    });
    expect(jovo.getSessionData()).toEqual({
        foo: 'bar',
        a: 'b'
    });
});


test('test tell', () => {
    jovo.tell('Hello World');
    expect(jovo.$output).toEqual({
        tell: {
            speech: 'Hello World',
        },
    });
});

test('test tell (with SpeechBuilder)', () => {
    jovo.$speech.addText('Hello World');
    jovo.tell('Hello World');
    expect(jovo.$output).toEqual({
        tell: {
            speech: 'Hello World',
        },
    });
});



test('test ask without reprompt', () => {
    jovo.ask('Hello World');
    expect(jovo.$output).toEqual({
        ask: {
            speech: 'Hello World',
            reprompt: 'Hello World',
        },
    });
});

test('test ask with reprompt', () => {
    jovo.ask('Hello World', 'FooBar');
    expect(jovo.$output).toEqual({
        ask: {
            speech: 'Hello World',
            reprompt: 'FooBar',
        },
    });
});

test('test ask with reprompt (speechbuilder)', () => {
    jovo.$speech.addText('Hello World');
    jovo.$reprompt.addText('FooBar');


    jovo.ask(jovo.$speech, jovo.$reprompt);
    expect(jovo.$output).toEqual({
        ask: {
            speech: 'Hello World',
            reprompt: 'FooBar',
        },
    });
});


test('test mapInputs', () => {
    const inputMap = {
        inputA: 'inputB',
    };

    jovo.$inputs = {
        inputA: {
            name: 'inputA',
            value: 'foobar'
        }
    };

    expect(jovo.$inputs).toEqual({
        inputA: {
            name: 'inputA',
            value: 'foobar'
        }
    });
    jovo.mapInputs(inputMap);
    expect(jovo.$inputs).toEqual({
        inputB: {
            name: 'inputA',
            value: 'foobar'
        }
    });
});
test('test getInput', () => {

    jovo.$inputs = {
        inputA: {
            name: 'inputA',
            value: 'foobar'
        }
    };

    expect(jovo.getInput('inputA')).toEqual({
            name: 'inputA',
            value: 'foobar'
    });
});

test('test setOutput', () => {

    jovo.setOutput({
        tell: {
            speech: 'HelloWorld',
        }
    });

    expect(jovo.$output).toEqual({
        tell: {
            speech: 'HelloWorld',
        }
    });
});


test('test setResponseObject', () => {

    jovo.setResponseObject({
        foo: 'bar'
    });

    expect(jovo.$rawResponseJson).toEqual({
        foo: 'bar'
    });
});


test('test showSimpleCard', () => {

    jovo.showSimpleCard('title', 'content');

    expect(jovo.$output).toEqual({
        card: {
            SimpleCard: {
                title: 'title',
                content: 'content'
            }
        }
    });
});


test('test showImageCard', () => {

    jovo.showImageCard('title', 'content', 'imageUrl');

    expect(jovo.$output).toEqual({
        card: {
            ImageCard: {
                title: 'title',
                content: 'content',
                imageUrl: 'imageUrl'
            }
        }
    });
});

test('test showAccountLinkingCard', () => {

    jovo.showAccountLinkingCard();

    expect(jovo.$output).toEqual({
        card: {
            AccountLinkingCard: {
            }
        }
    });
});
