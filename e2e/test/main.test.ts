import { App, ComponentDeclaration, SessionData } from '@jovotech/framework';
import { Alexa, AlexaRequestJSON, Session } from '@jovotech/platform-alexa';
import { inspect } from 'util';
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
  console.log(inspect(response, { depth: null, compact: true, colors: true }));

  expect(true).toBe(true);
});
