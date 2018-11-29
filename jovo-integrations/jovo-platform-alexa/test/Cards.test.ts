test('dummy test', () => {
    expect(true).toBe(true);
});
//
//
// import {Card} from "../src/response/visuals/Card";
// import {SimpleCard} from "../src/response/visuals/SimpleCard";
// import {StandardCard} from "../src/response/visuals/StandardCard";
// import {LinkAccountCard} from "../src/response/visuals/LinkAccountCard";
// import {AskForPermissionConsentCard} from "../src/response/visuals/AskForPermissionConsentCard";
// import {AskForListPermissionsCard} from "../src/response/visuals/AskForListPermissionsCard";
// import {AskForLocationPermissionsCard} from "../src/response/visuals/AskForLocationPermissionsCard";
// import {AskForContactPermissionsCard} from "../src/response/visuals/AskForContactPermissionsCard";
//
// process.env.NODE_ENV = 'TEST';
//
//
// class CardImpl extends Card {
//     constructor() {
//         super('Card');
//     }
// }
//
// test('test setType', () => {
//     const card = new CardImpl();
//     card.setType('CardImpl');
//     expect(card.type).toBe('CardImpl');
// });
//
// test('test SimpleCard', () => {
//     const card = new SimpleCard();
//     card.setTitle('Title');
//     card.setContent('Content');
//
//     expect(card.type).toBe('Simple');
//     expect(card.title).toBe('Title');
//     expect(card.content).toBe('Content');
//
//
//     const card2 = new SimpleCard({
//         title: 'Title',
//         content: 'Content',
//     });
//
//     expect(card2.type).toBe('Simple');
//     expect(card2.title).toBe('Title');
//     expect(card2.content).toBe('Content');
// });
//
// test('test StandardCard', () => {
//     const card = new StandardCard();
//     card.setTitle('Title');
//     card.setText('Text');
//     card.setImage({
//         largeImageUrl: 'largeImageUrl',
//         smallImageUrl: 'smallImageUrl',
//     });
//
//     expect(card.type).toBe('Standard');
//     expect(card.title).toBe('Title');
//     expect(card.text).toBe('Text');
//     expect(card.image).toEqual({
//         largeImageUrl: 'largeImageUrl',
//         smallImageUrl: 'smallImageUrl',
//     });
//
//     const card2 = new StandardCard({
//         title: 'Title',
//         text: 'Text',
//         image: {
//             largeImageUrl: 'largeImageUrl',
//             smallImageUrl: 'smallImageUrl',
//         }
//     });
//     expect(card2.type).toBe('Standard');
//     expect(card2.title).toBe('Title');
//     expect(card2.text).toBe('Text');
//     expect(card2.image).toEqual({
//         largeImageUrl: 'largeImageUrl',
//         smallImageUrl: 'smallImageUrl',
//     });
//
//     const card3 = new StandardCard();
//     card3.setSmallImageUrl('smallImageUrl');
//     card3.setLargeImageUrl('largeImageUrl');
//     expect(card3.image).toEqual({
//         largeImageUrl: 'largeImageUrl',
//         smallImageUrl: 'smallImageUrl',
//     });
// });
//
// test('test LinkAccountCard', () => {
//     const card = new LinkAccountCard();
//     expect(card.type).toBe('LinkAccount');
// });
//
//
// test('test AskForPermissionConsentCard', () => {
//     const card = new AskForPermissionConsentCard();
//     card.addPermission('perm1');
//     card.addPermission('perm2');
//
//     expect(card.type).toBe('AskForPermissionsConsent');
//     expect(card.permissions).toEqual(['perm1', 'perm2']);
//
//     card.permissions = [];
//
//     card.setPermissions(['perm3', 'perm4']);
//     expect(card.permissions).toEqual(['perm3', 'perm4']);
//
// });
//
//
// test('test AskForListPermissionsCard', () => {
//     const card = new AskForListPermissionsCard(['read', 'write']);
//
//     expect(card.type).toBe('AskForPermissionsConsent');
//     expect(card.permissions).toEqual(['read::alexa:household:list', 'write::alexa:household:list']);
//
//     card.permissions = [];
//     card.addReadPermission();
//     expect(card.permissions).toEqual(['read::alexa:household:list']);
//     card.addWritePermission();
//     expect(card.permissions).toEqual(['read::alexa:household:list', 'write::alexa:household:list']);
//
//
//     const card2 = new AskForListPermissionsCard();
//
//     card2.addFullPermission();
//     expect(card2.permissions).toEqual(['read::alexa:household:list', 'write::alexa:household:list']);
//
//     expect(() => new AskForListPermissionsCard(['foo', 'bar'])).toThrow('Invalid permission type');
//
// });
//
//
// test('test AskForLocationPermissionsCard', () => {
//     const card = new AskForLocationPermissionsCard('address');
//
//     expect(card.type).toBe('AskForPermissionsConsent');
//     expect(card.permissions).toEqual(['read::alexa:device:all:address']);
//
//     card.permissions = [];
//     card.setAskForAddressPermission();
//     expect(card.permissions).toEqual(['read::alexa:device:all:address']);
//
//     card.permissions = [];
//     card.setAskForCountryAndPostalCodePermission();
//     expect(card.permissions).toEqual(['read::alexa:device:all:address:country_and_postal_code']);
//
//
//
//     const card2 = new AskForLocationPermissionsCard('country_and_postal_code');
//     expect(card2.permissions).toEqual(['read::alexa:device:all:address:country_and_postal_code']);
//
//     const card3 = new AskForLocationPermissionsCard();
//     card3.setAskForCountryAndPostalCodePermission();
//     expect(card3.permissions).toEqual(['read::alexa:device:all:address:country_and_postal_code']);
//
//
//     expect(() => new AskForLocationPermissionsCard('foo')).toThrow('Invalid permission type');
//
// });
//
//
// test('test AskForContactPermissionsCard', () => {
//     const card = new AskForContactPermissionsCard();
//     card.setAskForContactPermission(['name', 'email']);
//
//     expect(card.permissions).toEqual(['alexa::profile:name:read', 'alexa::profile:email:read']);
//
//     const card2 = new AskForContactPermissionsCard(['name', 'email']);
//     expect(card2.permissions).toEqual(['alexa::profile:name:read', 'alexa::profile:email:read']);
//
//     const card3 = new AskForContactPermissionsCard('name');
//     expect(card3.permissions).toEqual(['alexa::profile:name:read']);
//
//
//     const card4 = new AskForContactPermissionsCard();
//     card4.setAskForContactPermission('email');
//     expect(card4.permissions).toEqual(['alexa::profile:email:read']);
//
//
//     expect(() => new AskForContactPermissionsCard('foo')).toThrow('Invalid permission type');
//
// });
