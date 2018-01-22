'use strict';
const expect = require('chai').expect;
const AlexaSkill = require('../../../lib/platforms/alexaSkill/alexaSkill').AlexaSkill;
const Template = require('../../../lib/platforms/alexaSkill/response/renderTemplate/template').Template;
const BodyTemplate1 = require('../../../lib/platforms/alexaSkill/response/renderTemplate/bodyTemplate1').BodyTemplate1;
const BodyTemplate2 = require('../../../lib/platforms/alexaSkill/response/renderTemplate/bodyTemplate2').BodyTemplate2;
const BodyTemplate3 = require('../../../lib/platforms/alexaSkill/response/renderTemplate/bodyTemplate3').BodyTemplate3;
const BodyTemplate6 = require('../../../lib/platforms/alexaSkill/response/renderTemplate/bodyTemplate6').BodyTemplate6;
const ListTemplate1 = require('../../../lib/platforms/alexaSkill/response/renderTemplate/listTemplate1').ListTemplate1;
const ListTemplate2 = require('../../../lib/platforms/alexaSkill/response/renderTemplate/listTemplate2').ListTemplate2;
const ListTemplate3 = require('../../../lib/platforms/alexaSkill/response/renderTemplate/listTemplate3').ListTemplate3;


describe('Tests for render templates', function() {
    describe('template(type)', function() {
        it('should return an instance of the specific template', () => {
            expect(AlexaSkill.templateBuilder('BodyTemplate1')).to.be.an.instanceOf(BodyTemplate1);
            expect(AlexaSkill.templateBuilder('BodyTemplate2')).to.be.an.instanceOf(BodyTemplate2);
            expect(AlexaSkill.templateBuilder('BodyTemplate3')).to.be.an.instanceOf(BodyTemplate3);
            expect(AlexaSkill.templateBuilder('BodyTemplate6')).to.be.an.instanceOf(BodyTemplate6);
            expect(AlexaSkill.templateBuilder('ListTemplate1')).to.be.an.instanceOf(ListTemplate1);
            expect(AlexaSkill.templateBuilder('ListTemplate2')).to.be.an.instanceOf(ListTemplate2);
            expect(AlexaSkill.templateBuilder('ListTemplate3')).to.be.an.instanceOf(ListTemplate3);
        });
    });

    describe('Template base class', function() {
       it('should return a valid template base response', () => {
           let template = (new Template())
               .setTitle('Hello World')
               .setToken('tokenXYZ')
               .setBackButton('VISIBLE')
               .setBackgroundImage('https://www.example.com/image.jpg')
               ;
           expect(template.title).to.equal('Hello World');
           expect(template.token).to.equal('tokenXYZ');
           expect(template.backButton).to.equal('VISIBLE');
           expect(template.backgroundImage).to.deep.include({
               sources: [
                   {
                       url: 'https://www.example.com/image.jpg',
                   },
               ],
           });
       });
        it('should throw error on invalid backButton behaviour ', () => {
            let template = (new Template());
            expect(() => {
              template.setBackButton('FooBar');
            }).to.throw('Invalid visibility type');
        });
       it('should make a valid makeRichText object', () => {
           expect(Template.makeRichText('Any Text')).to.deep.include(
               {
                   text: 'Any Text',
                   type: 'RichText',
               });
           expect(Template.makeRichText(
               {
                   text: 'Any Text 2',
                   type: 'RichText',
               }
           )).to.deep.include(
               {
                   text: 'Any Text 2',
                   type: 'RichText',
               });
       });
       it('should make a valid makePlainText object', () => {
            expect(Template.makePlainText('Any Text')).to.deep.include(
                {
                    text: 'Any Text',
                    type: 'PlainText',
                });

           expect(Template.makePlainText(
               {
                   text: 'Any Text 2',
                   type: 'PlainText',
               }
           )).to.deep.include(
               {
                   text: 'Any Text 2',
                   type: 'PlainText',
               });
        });

        it('should make a valid makeTextContent object', () => {
            let textContent1 = Template.makeTextContent('Primary');
            expect(textContent1).to.deep.include(
                {
                    primaryText: {
                        text: 'Primary',
                        type: 'RichText',
                    },
                });

            let textContent2 = Template.makeTextContent('Primary', 'Secondary');
            expect(textContent2).to.deep.include(
                {
                    primaryText: {
                        text: 'Primary',
                        type: 'RichText',
                    },
                    secondaryText: {
                        text: 'Secondary',
                        type: 'RichText',
                    },
                });

            let textContent3 = Template.makeTextContent('Primary', 'Secondary', 'Tertiary');
            expect(textContent3).to.deep.include(
                {
                    primaryText: {
                        text: 'Primary',
                        type: 'RichText',
                    },
                    secondaryText: {
                        text: 'Secondary',
                        type: 'RichText',
                    },
                    tertiaryText: {
                        text: 'Tertiary',
                        type: 'RichText',
                    },
                });
        });
        it('should make a valid image with url as parameter', () => {
            let image = Template.makeImage('https://www.example.com/image.jpg');

            expect(image).to.deep.include(
                {
                    sources: [
                        {
                            url: 'https://www.example.com/image.jpg',
                        },
                    ],
                }
            );
        });
        it('should make a valid image with {url: x, description: y} as parameter', () => {
            let image = Template.makeImage({
                url: 'https://www.example.com/image.jpg',
                description: 'image description',
            });

            expect(image).to.deep.include(
                {
                    contentDescription: 'image description',
                    sources: [
                        {
                            url: 'https://www.example.com/image.jpg',
                        },
                    ],
                }
            );
            // no description
            let image2 = Template.makeImage({
                url: 'https://www.example.com/image.jpg',
            });

            expect(image2).to.deep.include(
                {
                    sources: [
                        {
                            url: 'https://www.example.com/image.jpg',
                        },
                    ],
                }
            );
        });

        it('should make a valid image with image object as parameter', () => {
            let image = Template.makeImage({
                contentDescription: 'image description',
                sources: [
                    {
                        url: 'https://www.example.com/imageSmall.jpg',
                        size: 'X_SMALL',
                        widthPixels: 480,
                        heightPixels: 320,
                    },
                    {
                        url: 'https://www.example.com/imageMedium.jpg',
                        size: 'MEDIUM',
                        widthPixels: 960,
                        heightPixels: 640,
                    },
                ],
            });

            expect(image).to.deep.include(
                {
                    contentDescription: 'image description',
                    sources: [
                        {
                            url: 'https://www.example.com/imageSmall.jpg',
                            size: 'X_SMALL',
                            widthPixels: 480,
                            heightPixels: 320,
                        },
                        {
                            url: 'https://www.example.com/imageMedium.jpg',
                            size: 'MEDIUM',
                            widthPixels: 960,
                            heightPixels: 640,
                        },
                    ],
                }
            );
        });
    });

    describe('BodyTemplate1', function() {
       it('should return a valid BodyTemplate1 response', () => {
           let bodyTemplate1 = new BodyTemplate1()
               .setTextContent('primary', 'secondary');
           expect(bodyTemplate1.type).to.equal('BodyTemplate1');
           expect(bodyTemplate1.textContent).to.deep.include(
               {
                   primaryText: {
                       type: 'RichText',
                       text: 'primary',
                   },
                   secondaryText: {
                       type: 'RichText',
                       text: 'secondary',
                   },
               }
           );
       });
    });

    describe('BodyTemplate2', function() {
        it('should return a valid BodyTemplate2 response', () => {
            let bodyTemplate2 = (new BodyTemplate2())
                .setTextContent('primary', 'secondary')
                .setImage('https://www.example.com/image.jpg')
                ;
            expect(bodyTemplate2.type).to.equal('BodyTemplate2');
            expect(bodyTemplate2.textContent).to.deep.include(
                {
                    primaryText: {
                        type: 'RichText',
                        text: 'primary',
                    },
                    secondaryText: {
                        type: 'RichText',
                        text: 'secondary',
                    },
                }
            );
            expect(bodyTemplate2.image).to.deep.include({
                sources: [
                    {
                        url: 'https://www.example.com/image.jpg',
                    },
                ],
            });

            let bodyTemplate2b = (new BodyTemplate2())
                .setRightImage('https://www.example.com/image2.jpg')
                ;
            expect(bodyTemplate2b.image).to.deep.include({
                sources: [
                    {
                        url: 'https://www.example.com/image2.jpg',
                    },
                ],
            });
        });
    });

    describe('BodyTemplate3', function() {
        it('should return a valid BodyTemplate3 response', () => {
            let bodyTemplate3 = (new BodyTemplate3())
                .setTextContent('primary', 'secondary')
                .setLeftImage('https://www.example.com/image.jpg')
                ;
            expect(bodyTemplate3.type).to.equal('BodyTemplate3');
            expect(bodyTemplate3.textContent).to.deep.include(
                {
                    primaryText: {
                        type: 'RichText',
                        text: 'primary',
                    },
                    secondaryText: {
                        type: 'RichText',
                        text: 'secondary',
                    },
                }
            );
            expect(bodyTemplate3.image).to.deep.include({
                sources: [
                    {
                        url: 'https://www.example.com/image.jpg',
                    },
                ],
            });
        });
    });
    describe('BodyTemplate6', function() {
        it('should return a valid BodyTemplate6 response', () => {
            let bodyTemplate6 = (new BodyTemplate6())
                .setTextContent('primary', 'secondary')
                .setFullScreenImage('https://www.example.com/image.jpg')
                ;
            expect(bodyTemplate6.type).to.equal('BodyTemplate6');
            expect(bodyTemplate6.textContent).to.deep.include(
                {
                    primaryText: {
                        type: 'RichText',
                        text: 'primary',
                    },
                    secondaryText: {
                        type: 'RichText',
                        text: 'secondary',
                    },
                }
            );
            expect(bodyTemplate6.image).to.deep.include({
                sources: [
                    {
                        url: 'https://www.example.com/image.jpg',
                    },
                ],
            });
        });
    });
    describe('ListTemplate1', function() {
        it('should return a valid ListTemplate1 response', () => {
            let listTemplate1 = (new ListTemplate1());
            expect(listTemplate1.type).to.equal('ListTemplate1');

            listTemplate1.addItem(
                'item1',
                'https://www.example.com/image.jpg',
                'primary text',
                'secondary text',
                'tertiary text'
            );

            expect(listTemplate1.listItems[0]).to.deep.include(
                {
                    token: 'item1',
                    image: {
                        sources: [
                            {
                                url: 'https://www.example.com/image.jpg',
                            },
                        ],
                    },
                    textContent: {
                        primaryText: {
                            type: 'RichText',
                            text: 'primary text',
                        },
                        secondaryText: {
                            type: 'RichText',
                            text: 'secondary text',
                        },
                        tertiaryText: {
                            type: 'RichText',
                            text: 'tertiary text',
                        },
                    },
                }
            );

            // another item

            listTemplate1.addItem(
                'item2',
                'https://www.example.com/image2.jpg',
                'primary text2',
                'secondary text2',
                'tertiary text2'
            );

            expect(listTemplate1.listItems[1]).to.deep.include(
                {
                    token: 'item2',
                    image: {
                        sources: [
                            {
                                url: 'https://www.example.com/image2.jpg',
                            },
                        ],
                    },
                    textContent: {
                        primaryText: {
                            type: 'RichText',
                            text: 'primary text2',
                        },
                        secondaryText: {
                            type: 'RichText',
                            text: 'secondary text2',
                        },
                        tertiaryText: {
                            type: 'RichText',
                            text: 'tertiary text2',
                        },
                    },
                }
            );
        });
        it('should set an array of items correctly', () => {
            let listTemplate1 = (new ListTemplate1());
            let items = [
                {
                    token: 'item1',
                    image: {
                        sources: [
                            {
                                url: 'https://www.example.com/image.jpg',
                            },
                        ],
                    },
                    textContent: {
                        primaryText: {
                            type: 'RichText',
                            text: 'primary text',
                        },
                        secondaryText: {
                            type: 'RichText',
                            text: 'secondary text',
                        },
                        tertiaryText: {
                            type: 'RichText',
                            text: 'tertiary text',
                        },
                    },
                },
                {
                    token: 'item2',
                    image: {
                        sources: [
                            {
                                url: 'https://www.example.com/image2.jpg',
                            },
                        ],
                    },
                    textContent: {
                        primaryText: {
                            type: 'RichText',
                            text: 'primary text2',
                        },
                        secondaryText: {
                            type: 'RichText',
                            text: 'secondary text2',
                        },
                        tertiaryText: {
                            type: 'RichText',
                            text: 'tertiary text2',
                        },
                    },
                },
            ];

            listTemplate1.setItems(items);
            expect(listTemplate1.listItems[0]).to.deep.include(
                {
                    token: 'item1',
                    image: {
                        sources: [
                            {
                                url: 'https://www.example.com/image.jpg',
                            },
                        ],
                    },
                    textContent: {
                        primaryText: {
                            type: 'RichText',
                            text: 'primary text',
                        },
                        secondaryText: {
                            type: 'RichText',
                            text: 'secondary text',
                        },
                        tertiaryText: {
                            type: 'RichText',
                            text: 'tertiary text',
                        },
                    },
                }
            );
            expect(listTemplate1.listItems[1]).to.deep.include(
                {
                    token: 'item2',
                    image: {
                        sources: [
                            {
                                url: 'https://www.example.com/image2.jpg',
                            },
                        ],
                    },
                    textContent: {
                        primaryText: {
                            type: 'RichText',
                            text: 'primary text2',
                        },
                        secondaryText: {
                            type: 'RichText',
                            text: 'secondary text2',
                        },
                        tertiaryText: {
                            type: 'RichText',
                            text: 'tertiary text2',
                        },
                    },
                }
            );
        });
    });
    describe('ListTemplate2', function() {
        it('should return a valid ListTemplate2 response', () => {
            let listTemplate2 = (new ListTemplate2());
            expect(listTemplate2.type).to.equal('ListTemplate2');
        });
    });
    describe('ListTemplate3', function() {
        it('should return a valid ListTemplate3 response', () => {
            let listTemplate3 = (new ListTemplate3());
            expect(listTemplate3.type).to.equal('ListTemplate3');
        });
    });
});

