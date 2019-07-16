import { App } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { GoogleAssistant } from 'jovo-platform-googleassistant';

for (const p of [new GoogleAssistant()]) {
    const testSuite = p.makeTestSuite();

    describe('Health check for Assistant', () => {
        test('should not send data to GA', async () => {
            const conversation = testSuite.conversation(
                //{ userId: }
            );
            const refLaunchRequest = await testSuite.requestBuilder.intent(require(`/home/anjovo/github/ownRepos/jovo-framework-private/packages/jovo-analytics-googleanalytics/test/health.json`));
            await conversation.send(refLaunchRequest);

            /* refLaunchRequest.setNewSession(true);
            //refLaunchRequest.
            
            const startGameRequest = await testSuite.requestBuilder.intent('StartGameIntent');   */
        });
    });
}