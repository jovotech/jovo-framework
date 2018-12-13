'use strict';
const { App, Util } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');
jest.setTimeout(500);

for (const p of [new Alexa(), new GoogleAssistant()]) {
    const testSuite = p.makeTestSuite();

    describe(`PLATFORM: ${p.constructor.name} INTENTS` , () => {
        test('should return a welcome message and ask for the name at "LAUNCH"', async () => {
            const conversation = testSuite.conversation();

            const launchRequest = await testSuite.requestBuilder.launch();

            const responseLaunchRequest = await conversation.send(launchRequest);

            expect(
                responseLaunchRequest.isAsk('Hello World! What\'s your name?', 'Please tell me your name.')
            ).toBe(true);

        });

        test('should return a welcome message and ask for the name at "HelloWorldIntent"', async () => {
            const conversation = testSuite.conversation();

            const intentRequest = await testSuite.requestBuilder.intent();

            intentRequest.setIntentName('HelloWorldIntent');
            intentRequest.setNewSession(true);

            const responseIntentRequest = await conversation.send(intentRequest);

            expect(
                responseIntentRequest.isAsk('Hello World! What\'s your name?', 'Please tell me your name.')
            ).toBe(true);
            await conversation.clearDb();

        });

        test('should greet the user with their name at "MyNameIsIntent"', async () => {
            const conversation = testSuite.conversation();

            // MyNameIsIntent (one shot) => name=Joe
            const intentRequest = await testSuite.requestBuilder.intent('MyNameIsIntent', { name: 'Joe' });
            intentRequest.setNewSession(true);
            const responseIntentRequest = await conversation.send(intentRequest);
            expect(
                responseIntentRequest.isTell('Hey Joe, nice to meet you!')
            ).toBe(true);
            await conversation.clearDb();

        });
    });
    describe(`PLATFORM: ${p.constructor.name} CONVERSATIONS` , () => {
        test('should run the whole conversation flow and greet the user with the correct name', async () => {
            const conversation = testSuite.conversation();

            // LAUNCH
            const launchRequest = await testSuite.requestBuilder.launch();
            const responseLaunchRequest = await conversation.send(launchRequest);
            expect(
                responseLaunchRequest.isAsk('Hello World! What\'s your name?', 'Please tell me your name.')
            ).toBe(true);

            // MyNameIsIntent => name=Joe
            const intentRequest = await testSuite.requestBuilder.intent('MyNameIsIntent', { name: 'Joe' });
            const responseIntentRequest = await conversation.send(intentRequest);
            expect(
                responseIntentRequest.isTell('Hey Joe, nice to meet you!')
            ).toBe(true);


        });


        test('should ask for the name again if user responds with something else', async () => {
            const conversation = testSuite.conversation();

            // LAUNCH
            const launchRequest = await testSuite.requestBuilder.launch();
            const responseLaunchRequest = await conversation.send(launchRequest);
            expect(
                responseLaunchRequest.isAsk('Hello World! What\'s your name?', 'Please tell me your name.')
            ).toBe(true);

            // HelloWorldIntent
            const intentRequest = await testSuite.requestBuilder.intent('HelloWorldIntent');
            const responseIntentRequest = await conversation.send(intentRequest);
            expect(
                responseIntentRequest.isAsk('Hello World! What\'s your name?', 'Please tell me your name.')
            ).toBe(true);

        });

    });
}
