"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Card_1 = require("../../src/response/visuals/Card");
const SimpleCard_1 = require("../../src/response/visuals/SimpleCard");
const StandardCard_1 = require("../../src/response/visuals/StandardCard");
const LinkAccountCard_1 = require("../../src/response/visuals/LinkAccountCard");
const AskForPermissionsConsentCard_1 = require("../../src/response/visuals/AskForPermissionsConsentCard");
const AskForListPermissionsCard_1 = require("../../src/response/visuals/AskForListPermissionsCard");
const AskForLocationPermissionsCard_1 = require("../../src/response/visuals/AskForLocationPermissionsCard");
const AskForContactPermissionsCard_1 = require("../../src/response/visuals/AskForContactPermissionsCard");
const AskForRemindersPermissionsCard_1 = require("../../src/response/visuals/AskForRemindersPermissionsCard");
const jovo_framework_1 = require("jovo-framework");
const src_1 = require("../../src");
const _get = require("lodash.get");
process.env.NODE_ENV = 'TEST';
process.env.NODE_ENV = 'UNIT_TEST';
let app;
let t;
jest.setTimeout(550);
class CardImpl extends Card_1.Card {
    constructor() {
        super('Card');
    }
}
test('test setType', () => {
    const card = new CardImpl();
    card.setType('CardImpl');
    expect(card.type).toBe('CardImpl');
});
test('test SimpleCard', () => {
    const card = new SimpleCard_1.SimpleCard();
    card.setTitle('Title');
    card.setContent('Content');
    expect(card.type).toBe('Simple');
    expect(card.title).toBe('Title');
    expect(card.content).toBe('Content');
    const card2 = new SimpleCard_1.SimpleCard({
        title: 'Title',
        content: 'Content',
    });
    expect(card2.type).toBe('Simple');
    expect(card2.title).toBe('Title');
    expect(card2.content).toBe('Content');
});
test('test StandardCard', () => {
    const card = new StandardCard_1.StandardCard();
    card.setTitle('Title');
    card.setText('Text');
    card.setImage({
        largeImageUrl: 'largeImageUrl',
        smallImageUrl: 'smallImageUrl',
    });
    expect(card.type).toBe('Standard');
    expect(card.title).toBe('Title');
    expect(card.text).toBe('Text');
    expect(card.image).toEqual({
        largeImageUrl: 'largeImageUrl',
        smallImageUrl: 'smallImageUrl',
    });
    const card2 = new StandardCard_1.StandardCard({
        title: 'Title',
        text: 'Text',
        image: {
            largeImageUrl: 'largeImageUrl',
            smallImageUrl: 'smallImageUrl',
        },
    });
    expect(card2.type).toBe('Standard');
    expect(card2.title).toBe('Title');
    expect(card2.text).toBe('Text');
    expect(card2.image).toEqual({
        largeImageUrl: 'largeImageUrl',
        smallImageUrl: 'smallImageUrl',
    });
    const card3 = new StandardCard_1.StandardCard();
    card3.setSmallImageUrl('smallImageUrl');
    card3.setLargeImageUrl('largeImageUrl');
    expect(card3.image).toEqual({
        largeImageUrl: 'largeImageUrl',
        smallImageUrl: 'smallImageUrl',
    });
});
test('test LinkAccountCard', () => {
    const card = new LinkAccountCard_1.LinkAccountCard();
    expect(card.type).toBe('LinkAccount');
});
test('test AskForPermissionConsentCard', () => {
    const card = new AskForPermissionsConsentCard_1.AskForPermissionsConsentCard();
    card.addPermission('perm1');
    card.addPermission('perm2');
    expect(card.type).toBe('AskForPermissionsConsent');
    expect(card.permissions).toEqual(['perm1', 'perm2']);
    card.permissions = [];
    card.setPermissions(['perm3', 'perm4']);
    expect(card.permissions).toEqual(['perm3', 'perm4']);
});
test('test AskForListPermissionsCard', () => {
    const card = new AskForListPermissionsCard_1.AskForListPermissionsCard(['read', 'write']);
    expect(card.type).toBe('AskForPermissionsConsent');
    expect(card.permissions).toEqual(['read::alexa:household:list', 'write::alexa:household:list']);
    card.permissions = [];
    card.addReadPermission();
    expect(card.permissions).toEqual(['read::alexa:household:list']);
    card.addWritePermission();
    expect(card.permissions).toEqual(['read::alexa:household:list', 'write::alexa:household:list']);
    const card2 = new AskForListPermissionsCard_1.AskForListPermissionsCard();
    card2.addFullPermission();
    expect(card2.permissions).toEqual(['read::alexa:household:list', 'write::alexa:household:list']);
    expect(() => new AskForListPermissionsCard_1.AskForListPermissionsCard(['foo', 'bar'])).toThrow('Invalid permission type');
});
test('test AskForLocationPermissionsCard', () => {
    const card = new AskForLocationPermissionsCard_1.AskForLocationPermissionsCard('address');
    expect(card.type).toBe('AskForPermissionsConsent');
    expect(card.permissions).toEqual(['read::alexa:device:all:address']);
    card.permissions = [];
    card.setAskForAddressPermission();
    expect(card.permissions).toEqual(['read::alexa:device:all:address']);
    card.permissions = [];
    card.setAskForCountryAndPostalCodePermission();
    expect(card.permissions).toEqual(['read::alexa:device:all:address:country_and_postal_code']);
    const card2 = new AskForLocationPermissionsCard_1.AskForLocationPermissionsCard('country_and_postal_code');
    expect(card2.permissions).toEqual(['read::alexa:device:all:address:country_and_postal_code']);
    const card3 = new AskForLocationPermissionsCard_1.AskForLocationPermissionsCard();
    card3.setAskForCountryAndPostalCodePermission();
    expect(card3.permissions).toEqual(['read::alexa:device:all:address:country_and_postal_code']);
    const card4 = new AskForLocationPermissionsCard_1.AskForLocationPermissionsCard('geolocation');
    expect(card4.permissions).toEqual(['alexa::devices:all:geolocation:read']);
    card4.permissions = [];
    card4.setAskForGeoLocationPermission();
    expect(card4.permissions).toEqual(['alexa::devices:all:geolocation:read']);
    expect(() => new AskForLocationPermissionsCard_1.AskForLocationPermissionsCard('foo')).toThrow('Invalid permission type');
});
test('test AskForContactPermissionsCard', () => {
    const card = new AskForContactPermissionsCard_1.AskForContactPermissionsCard();
    card.setAskForContactPermission(['name', 'email']);
    expect(card.permissions).toEqual(['alexa::profile:name:read', 'alexa::profile:email:read']);
    const card2 = new AskForContactPermissionsCard_1.AskForContactPermissionsCard(['name', 'email']);
    expect(card2.permissions).toEqual(['alexa::profile:name:read', 'alexa::profile:email:read']);
    const card3 = new AskForContactPermissionsCard_1.AskForContactPermissionsCard('name');
    expect(card3.permissions).toEqual(['alexa::profile:name:read']);
    const card4 = new AskForContactPermissionsCard_1.AskForContactPermissionsCard();
    card4.setAskForContactPermission('email');
    expect(card4.permissions).toEqual(['alexa::profile:email:read']);
    expect(() => new AskForContactPermissionsCard_1.AskForContactPermissionsCard('foo')).toThrow('Invalid permission type');
});
test('test AskForRemindersPermissionsCard', () => {
    const card = new AskForRemindersPermissionsCard_1.AskForRemindersPermissionsCard();
    expect(card.permissions).toEqual(['alexa::alerts:reminders:skill:readwrite']);
});
test('test showSimpleCard', async (done) => {
    app = new jovo_framework_1.App();
    const alexa = new src_1.Alexa();
    app.use(alexa);
    t = alexa.makeTestSuite();
    app.setHandler({
        LAUNCH() {
            this.showSimpleCard('title', 'content').tell('Hello');
        },
    });
    const launchRequest = await t.requestBuilder.launch();
    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    app.on('response', (handleRequest) => {
        const response = handleRequest.jovo.$response;
        expect(_get(response, 'response.card.type')).toEqual('Simple');
        expect(_get(response, 'response.card.title')).toEqual('title');
        expect(_get(response, 'response.card.content')).toEqual('content');
        done();
    });
});
test('test showImageCard', async (done) => {
    app = new jovo_framework_1.App();
    const alexa = new src_1.Alexa();
    app.use(alexa);
    t = alexa.makeTestSuite();
    app.setHandler({
        LAUNCH() {
            this.showImageCard('title', 'content', 'https://url.to/image.jpg').tell('Hello');
        },
    });
    const launchRequest = await t.requestBuilder.launch();
    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    app.on('response', (handleRequest) => {
        const response = handleRequest.jovo.$response;
        expect(_get(response, 'response.card.type')).toEqual('Standard');
        expect(_get(response, 'response.card.title')).toEqual('title');
        expect(_get(response, 'response.card.text')).toEqual('content');
        expect(_get(response, 'response.card.image.smallImageUrl')).toEqual('https://url.to/image.jpg');
        expect(_get(response, 'response.card.image.largeImageUrl')).toEqual('https://url.to/image.jpg');
        done();
    });
});
test('test this.$alexaSkill.showStandardCard', async (done) => {
    app = new jovo_framework_1.App();
    const alexa = new src_1.Alexa();
    app.use(alexa);
    t = alexa.makeTestSuite();
    app.setHandler({
        LAUNCH() {
            this.$alexaSkill.showStandardCard('title', 'content', {
                smallImageUrl: 'https://url.to/image_small.jpg',
                largeImageUrl: 'https://url.to/image_large.jpg',
            }).tell('Hello');
        },
    });
    const launchRequest = await t.requestBuilder.launch();
    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    app.on('response', (handleRequest) => {
        const response = handleRequest.jovo.$response;
        expect(_get(response, 'response.card.type')).toEqual('Standard');
        expect(_get(response, 'response.card.title')).toEqual('title');
        expect(_get(response, 'response.card.text')).toEqual('content');
        expect(_get(response, 'response.card.image.smallImageUrl')).toEqual('https://url.to/image_small.jpg');
        expect(_get(response, 'response.card.image.largeImageUrl')).toEqual('https://url.to/image_large.jpg');
        done();
    });
});
test('test this.$alexaSkill.showAskForAddressCard', async (done) => {
    app = new jovo_framework_1.App();
    const alexa = new src_1.Alexa();
    app.use(alexa);
    t = alexa.makeTestSuite();
    app.setHandler({
        LAUNCH() {
            this.$alexaSkill.showAskForAddressCard();
            this.tell('Hello');
        },
    });
    const launchRequest = await t.requestBuilder.launch();
    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    app.on('response', (handleRequest) => {
        const response = handleRequest.jovo.$response;
        expect(_get(response, 'response.card.type')).toEqual('AskForPermissionsConsent');
        expect(_get(response, 'response.card.permissions[0]')).toEqual('read::alexa:device:all:address');
        done();
    });
});
test('test showAccountLinkingCard', async (done) => {
    app = new jovo_framework_1.App();
    const alexa = new src_1.Alexa();
    app.use(alexa);
    t = alexa.makeTestSuite();
    app.setHandler({
        LAUNCH() {
            this.showAccountLinkingCard();
            this.tell('Hello');
        },
    });
    const launchRequest = await t.requestBuilder.launch();
    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    app.on('response', (handleRequest) => {
        const response = handleRequest.jovo.$response;
        expect(_get(response, 'response.card.type')).toEqual('LinkAccount');
        done();
    });
});
test('test this.$alexaSkill.showAskForCountryAndPostalCodeCard', async (done) => {
    app = new jovo_framework_1.App();
    const alexa = new src_1.Alexa();
    app.use(alexa);
    t = alexa.makeTestSuite();
    app.setHandler({
        LAUNCH() {
            this.$alexaSkill.showAskForCountryAndPostalCodeCard();
            this.tell('Hello');
        },
    });
    const launchRequest = await t.requestBuilder.launch();
    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    app.on('response', (handleRequest) => {
        const response = handleRequest.jovo.$response;
        expect(_get(response, 'response.card.type')).toEqual('AskForPermissionsConsent');
        expect(_get(response, 'response.card.permissions[0]')).toEqual('read::alexa:device:all:address:country_and_postal_code');
        done();
    });
});
test('test this.$alexaSkill.showAskForListPermissionCard', async (done) => {
    app = new jovo_framework_1.App();
    const alexa = new src_1.Alexa();
    app.use(alexa);
    t = alexa.makeTestSuite();
    app.setHandler({
        LAUNCH() {
            this.$alexaSkill.showAskForListPermissionCard(['write', 'read']);
            this.tell('Hello');
        },
    });
    const launchRequest = await t.requestBuilder.launch();
    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    app.on('response', (handleRequest) => {
        const response = handleRequest.jovo.$response;
        expect(_get(response, 'response.card.type')).toEqual('AskForPermissionsConsent');
        expect(_get(response, 'response.card.permissions[0]')).toEqual('write::alexa:household:list');
        expect(_get(response, 'response.card.permissions[1]')).toEqual('read::alexa:household:list');
        done();
    });
});
test('test this.$alexaSkill.showAskForContactPermissionCard', async (done) => {
    app = new jovo_framework_1.App();
    const alexa = new src_1.Alexa();
    app.use(alexa);
    t = alexa.makeTestSuite();
    app.setHandler({
        LAUNCH() {
            this.$alexaSkill.showAskForContactPermissionCard(['given_name', 'email', 'mobile_number']);
            this.tell('Hello');
        },
    });
    const launchRequest = await t.requestBuilder.launch();
    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    app.on('response', (handleRequest) => {
        const response = handleRequest.jovo.$response;
        expect(_get(response, 'response.card.type')).toEqual('AskForPermissionsConsent');
        expect(_get(response, 'response.card.permissions[0]')).toEqual('alexa::profile:given_name:read');
        expect(_get(response, 'response.card.permissions[1]')).toEqual('alexa::profile:email:read');
        expect(_get(response, 'response.card.permissions[2]')).toEqual('alexa::profile:mobile_number:read');
        done();
    });
});
test('test this.$alexaSkill.showAskForRemindersPermissionCard', async (done) => {
    app = new jovo_framework_1.App();
    const alexa = new src_1.Alexa();
    app.use(alexa);
    t = alexa.makeTestSuite();
    app.setHandler({
        LAUNCH() {
            this.$alexaSkill.showAskForRemindersPermissionCard();
            this.tell('Hello');
        },
    });
    const launchRequest = await t.requestBuilder.launch();
    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    app.on('response', (handleRequest) => {
        const response = handleRequest.jovo.$response;
        expect(_get(response, 'response.card.type')).toEqual('AskForPermissionsConsent');
        expect(_get(response, 'response.card.permissions[0]')).toEqual('alexa::alerts:reminders:skill:readwrite');
        done();
    });
});
test('test showAskForAmazonPayPermissionCard', async (done) => {
    app = new jovo_framework_1.App();
    const alexa = new src_1.Alexa();
    app.use(alexa);
    t = alexa.makeTestSuite();
    app.setHandler({
        LAUNCH() {
            this.$alexaSkill.showAskForAmazonPayPermissionCard();
        },
    });
    const launchRequest = await t.requestBuilder.launch();
    app.handle(jovo_framework_1.ExpressJS.dummyRequest(launchRequest));
    app.on('response', (handleRequest) => {
        const response = handleRequest.jovo.$response;
        expect(_get(response, 'response.card.type')).toEqual('AskForPermissionsConsent');
        expect(_get(response, 'response.card.permissions[0]')).toEqual('payments:autopay_consent');
        done();
    });
});
//# sourceMappingURL=Cards.test.js.map