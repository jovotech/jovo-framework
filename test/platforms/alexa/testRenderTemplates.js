'use strict';
const expect = require('chai').expect;
const AlexaSkill = require('../../../lib/platforms/alexa/alexaSkill').AlexaSkill;
const RenderTemplateBuilder = require('../../../lib/platforms/alexa/renderTemplate/renderTemplateBuilder').RenderTemplateBuilder;
const BodyTemplate1Builder = require('../../../lib/platforms/alexa/renderTemplate/bodyTemplate1Builder').BodyTemplate1Builder;
const BodyTemplate2Builder = require('../../../lib/platforms/alexa/renderTemplate/bodyTemplate2Builder').BodyTemplate2Builder;
const BodyTemplate3Builder = require('../../../lib/platforms/alexa/renderTemplate/bodyTemplate3Builder').BodyTemplate3Builder;
const BodyTemplate6Builder = require('../../../lib/platforms/alexa/renderTemplate/bodyTemplate6Builder').BodyTemplate6Builder;
const ListTemplate1Builder = require('../../../lib/platforms/alexa/renderTemplate/listTemplate1Builder').ListTemplate1Builder;
const ListTemplate2Builder = require('../../../lib/platforms/alexa/renderTemplate/listTemplate2Builder').ListTemplate2Builder;
const ListTemplate3Builder = require('../../../lib/platforms/alexa/renderTemplate/listTemplate3Builder').ListTemplate3Builder;


describe('Tests for render templates', function() {
    describe('templateBuilder(type)', function() {
        it('should return an instance of the specific template', () => {
            let alexaSkill = new AlexaSkill();
            expect(alexaSkill.templateBuilder('BodyTemplate1')).to.be.an.instanceOf(BodyTemplate1Builder);
            expect(alexaSkill.templateBuilder('BodyTemplate2')).to.be.an.instanceOf(BodyTemplate2Builder);
            expect(alexaSkill.templateBuilder('BodyTemplate3')).to.be.an.instanceOf(BodyTemplate3Builder);
            expect(alexaSkill.templateBuilder('BodyTemplate6')).to.be.an.instanceOf(BodyTemplate6Builder);
            expect(alexaSkill.templateBuilder('ListTemplate1')).to.be.an.instanceOf(ListTemplate1Builder);
            expect(alexaSkill.templateBuilder('ListTemplate2')).to.be.an.instanceOf(ListTemplate2Builder);
            expect(alexaSkill.templateBuilder('ListTemplate3')).to.be.an.instanceOf(ListTemplate3Builder);
        });
    });

    describe('TemplateBuilder base class', function() {
       it('should return a valid template base response', () => {
           let templateBuilder = (new RenderTemplateBuilder())
               .setTitle('Hello World')
               .setToken('tokenXYZ')
               .setBackButton('VISIBLE')
               .setBackgroundImage('https://www.example.com/image.jpg')
               .build();
           expect(templateBuilder.title).to.equal('Hello World');
           expect(templateBuilder.token).to.equal('tokenXYZ');
           expect(templateBuilder.backButton).to.equal('VISIBLE');
           expect(templateBuilder.backgroundImage).to.deep.include({
               sources: [
                   {
                       url: 'https://www.example.com/image.jpg',
                   },
               ],
           });
       });
        it('should throw error on invalid backButton behaviour ', () => {
            let templateBuilder = (new RenderTemplateBuilder());
            expect(() => {
              templateBuilder.setBackButton('FooBar');
            }).to.throw('Invalid visibility type');
        });
       it('should make a valid makeRichText object', () => {
           expect(RenderTemplateBuilder.makeRichText('Any Text')).to.deep.include(
               {
                   text: 'Any Text',
                   type: 'RichText',
               });
           expect(RenderTemplateBuilder.makeRichText(
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
            expect(RenderTemplateBuilder.makePlainText('Any Text')).to.deep.include(
                {
                    text: 'Any Text',
                    type: 'PlainText',
                });

           expect(RenderTemplateBuilder.makePlainText(
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
            let textContent1 = RenderTemplateBuilder.makeTextContent('Primary');
            expect(textContent1).to.deep.include(
                {
                    primaryText: {
                        text: 'Primary',
                        type: 'RichText',
                    },
                });

            let textContent2 = RenderTemplateBuilder.makeTextContent('Primary', 'Secondary');
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

            let textContent3 = RenderTemplateBuilder.makeTextContent('Primary', 'Secondary', 'Tertiary');
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
            let image = RenderTemplateBuilder.makeImage('https://www.example.com/image.jpg');

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
            let image = RenderTemplateBuilder.makeImage({
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
            let image2 = RenderTemplateBuilder.makeImage({
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
            let image = RenderTemplateBuilder.makeImage({
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

    describe('BodyTemplate1Builder', function() {
       it('should return a valid BodyTemplate1 response', () => {
           let bodyTemplate1 = (new BodyTemplate1Builder())
               .setTextContent('primary', 'secondary')
               .build();
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

    describe('BodyTemplate2Builder', function() {
        it('should return a valid BodyTemplate2 response', () => {
            let bodyTemplate2 = (new BodyTemplate2Builder())
                .setTextContent('primary', 'secondary')
                .setImage('https://www.example.com/image.jpg')
                .build();
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

            let bodyTemplate2b = (new BodyTemplate2Builder())
                .setRightImage('https://www.example.com/image2.jpg')
                .build();
            expect(bodyTemplate2b.image).to.deep.include({
                sources: [
                    {
                        url: 'https://www.example.com/image2.jpg',
                    },
                ],
            });
        });
    });

    describe('BodyTemplate3Builder', function() {
        it('should return a valid BodyTemplate3 response', () => {
            let bodyTemplate3 = (new BodyTemplate3Builder())
                .setTextContent('primary', 'secondary')
                .setLeftImage('https://www.example.com/image.jpg')
                .build();
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
    describe('BodyTemplate6Builder', function() {
        it('should return a valid BodyTemplate6 response', () => {
            let bodyTemplate6 = (new BodyTemplate6Builder())
                .setTextContent('primary', 'secondary')
                .setFullScreenImage('https://www.example.com/image.jpg')
                .build();
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
    describe('ListTemplate1Builder', function() {
        it('should return a valid ListTemplate1 response', () => {
            let listTemplate1 = (new ListTemplate1Builder());
            expect(listTemplate1.build().type).to.equal('ListTemplate1');

            listTemplate1.addItem(
                'item1',
                'https://www.example.com/image.jpg',
                'primary text',
                'secondary text',
                'tertiary text'
            );

            expect(listTemplate1.build().listItems[0]).to.deep.include(
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

            expect(listTemplate1.build().listItems[1]).to.deep.include(
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
            let listTemplate1 = (new ListTemplate1Builder());
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
            expect(listTemplate1.build().listItems[0]).to.deep.include(
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
            expect(listTemplate1.build().listItems[1]).to.deep.include(
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
    describe('ListTemplate2Builder', function() {
        it('should return a valid ListTemplate2 response', () => {
            let listTemplate2 = (new ListTemplate2Builder());
            expect(listTemplate2.build().type).to.equal('ListTemplate2');
        });
    });
    describe('ListTemplate3Builder', function() {
        it('should return a valid ListTemplate3 response', () => {
            let listTemplate3 = (new ListTemplate3Builder());
            expect(listTemplate3.build().type).to.equal('ListTemplate3');
        });
    });
});

