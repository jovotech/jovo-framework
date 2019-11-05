import { BaseApp, Host } from "jovo-core";
import {MessengerBot} from '../src';

process.env.NODE_ENV = 'UNIT_TEST';

let messengerBot: MessengerBot;
const app = {} as unknown as BaseApp; // hack so we don't have to implement the interface
const host = {} as unknown as Host;

beforeEach(() => {
    messengerBot = new MessengerBot(app, host);
});
