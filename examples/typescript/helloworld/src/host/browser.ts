import {app} from '../app';

export {app};


export function foo() {
console.log('bar');
}

// @ts-ignore
window.app = app;
