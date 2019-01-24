import {App} from './../src/App';
let app: App;
jest.setTimeout(250);
process.env.NODE_ENV = 'UNIT_TEST';


app = new App();
test('test onRequest', (done) => {

    app.onRequest(() => {
       done();
    });

    app.emit('request');
});


test('test onResponse', (done) => {

    app.onResponse(() => {
        done();
    });

    app.emit('response');
});

test('test onFail', (done) => {

    app.onFail(() => {
        done();
    });

    app.emit('fail');
});
test('test onError', (done) => {

    app.onError(() => {
        done();
    });

    app.emit('fail');
});
