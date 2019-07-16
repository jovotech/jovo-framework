import { App } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';

for (const p of [new Alexa()]) {
    const testSuite = p.makeTestSuite();

    describe('GA Test Session validation for refLaunchRequests', () => {
        test('should excact generate one session in GA', async () => {
            const conversation = testSuite.conversation(
                //{ userId: }
            );
            const refLaunchRequest = await testSuite.requestBuilder.intent(require(`/home/anjovo/github/ownRepos/jovo-framework-private/packages/jovo-analytics-googleanalytics/test/LaunchReferrer.json`));

            refLaunchRequest.setNewSession(true);
            //refLaunchRequest.
            
            const startGameRequest = await testSuite.requestBuilder.intent('StartGameIntent');            
            const trueRequest = await testSuite.requestBuilder.intent('TrueIntent');
            const falseRequest = await testSuite.requestBuilder.intent('FalseIntent');
            const stopIntent = await testSuite.requestBuilder.intent('StopIntent');


            const launchResponse = await conversation.send(refLaunchRequest);
            await conversation.send(startGameRequest);
            await conversation.send(trueRequest);
            await conversation.send(falseRequest);
            await conversation.send(stopIntent);
        });
    })
}