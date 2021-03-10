import { App, ComponentDeclaration, SessionData } from 'jovo-core';
import { Alexa, AlexaRequest, AlexaRequestJSON, Session } from 'jovo-platform-alexa';
import { ReusableComponent } from './components/ReusableComponent';
import { StandardComponent } from './components/StandardComponent';

test('AlexaRequest', async () => {
  const app = new App();
  app.use(new Alexa());

  app.useComponents(
    new ComponentDeclaration(StandardComponent, { name: 'DeclarationRoot' }),
    ReusableComponent,
  );

  await app.initialize();

  const request: AlexaRequestJSON = {
    version: '1.0',
    request: {
      requestId: 'abc',
      type: 'IntentRequest',
      timestamp: new Date().toISOString(),
      locale: 'en-US',
      events: [],
      intent: {
        name: 'MenuIntent',
      },
    },
    session: ({
      attributes: ({
        // [InternalSessionProperty.State]: {},
      } as unknown) as SessionData,
    } as unknown) as Session,
  };

  const response = await app.handle(request);
  console.log('-'.repeat(200));
  // console.log(response);
  await app.handle(request);

  expect(true).toBe(true);
});
