test('dummy test', () => {
    expect(true).toBe(true);
});


// import {Middleware} from "../src/Middleware";
// import {Extensible, ExtensibleConfig} from "../src/Extensible";
//
// class Parent extends Extensible {
// }
//
//
// test('test Middleware class initialization', () => {
//
//     const middleware = new Middleware('name', new Parent());
//     expect(middleware.fns.length).toBe(0);
// });
//
// test('test Middleware class use()', () => {
//     const middleware = new Middleware('name', new Parent());
//
//     const fn: Function = () => {
//         // do stuff
//     };
//
//     middleware.use(fn);
//
//     expect(middleware.fns.length).toBe(1);
//     expect(middleware.fns[0]).toBe(fn);
//     expect(middleware.use(fn)).toBe(middleware);
//
// });
//
//
//
// test('test multiple use() calls', () => {
//     const middleware = new Middleware('name', new Parent());
//
//     const fn: Function = () => {
//         // do stuff
//     };
//
//     middleware.use(fn);
//     middleware.use(fn);
//     middleware.use(fn);
//     middleware.use(fn);
//
//     expect(middleware.fns.length).toBe(4);
//
// });
//
// test('test run with multiple functions', async () => {
//     const parent = new Parent();
//     const middleware = new Middleware('name', new Parent());
//
//     const test = {
//         fn1() {
//             return this.test;
//         },
//         context1: {
//             test: 'abc'
//         }
//     };
//
//     const test2 = {
//         fn1() {
//             return this.test;
//         },
//         context1: {
//             test: 'def'
//         }
//     };
//
//     const spy = jest.spyOn(test, 'fn1');
//     const spy2 = jest.spyOn(test2, 'fn1');
//
//     middleware.use(test.fn1.bind(test.context1));
//     middleware.use(test2.fn1.bind(test2.context1));
//
//     await middleware.run(undefined);
//
//     expect(spy).toBeCalled();
//     expect(spy.mock.results[0].value).toBe('abc');
//
//     expect(spy2).toBeCalled();
//     expect(spy2.mock.results[0].value).toBe('def');
// });
