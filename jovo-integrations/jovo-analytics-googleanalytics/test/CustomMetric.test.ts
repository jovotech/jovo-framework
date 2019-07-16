import { App } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { GoogleAssistant } from 'jovo-platform-googleassistant';
import * as util from 'util';


for (const p of [new Alexa(), new GoogleAssistant()]) {
    const testSuite = p.makeTestSuite();

    describe(`PLATFORM: ${p.constructor.name} Check if custom metrics are set correctly`, () => {
        test('should set gamesPlay and correct/false metric', async () => {
            const conversation = testSuite.conversation(
                {
                    runtime: 'app',
                    locale: 'keys-only'
                }
                //{ userId: }
            );
            const launchRequest = await testSuite.requestBuilder.launch();
            const responeLaunchRequest = await conversation.send(launchRequest);
            const startRequest = await testSuite.requestBuilder.intent('StartIntent');
            const responseStartRequest = await conversation.send(startRequest);
            const trueRequest = await testSuite.requestBuilder.intent('TrueIntent');
            const responseTrueIntent = await conversation.send(trueRequest);
            console.log(`data is ${util.inspect(trueRequest)}`);
            //conversation.
            expect(conversation.$user.$data.cm1).toBe(1);
            //if(responseTrueIntent.getSpeech().toMatch(new RegExp('')))


            /* refLaunchRequest.setNewSession(true);
            //refLaunchRequest.
            
            const startGameRequest = await testSuite.requestBuilder.intent('StartGameIntent');   */
        });
    });
}