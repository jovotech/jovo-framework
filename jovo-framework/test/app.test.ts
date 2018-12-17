import {App} from './../src/App';
let app: App;
jest.setTimeout(250);


app = new App();
test('dummy test', () => {
    expect(true).toBe(true);
});
