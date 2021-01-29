import { App, ComponentDeclaration, InternalSessionProperty, SessionData } from 'jovo-core';
import { Alexa, AlexaRequest, AlexaRequestJSON, Session } from 'jovo-platform-alexa';
import { MenuComponent } from './components/MenuComponent';
import { MenuComponent as MenuComponent2 } from './components/MenuComponent2';
import { StandardComponent } from './components/StandardComponent';

const app = new App();
app.use(new Alexa());

app.useComponents(
  MenuComponent,
  new ComponentDeclaration(MenuComponent2, { name: 'MenuComponent2' }),
  StandardComponent,
);

beforeAll(async () => {
  await app.initialize();
});

test('AlexaRequest', async () => {
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
        [InternalSessionProperty.STATE]: {
          stack: [
            {
              component: 'MenuComponent',
            },
          ],
        },
      } as unknown) as SessionData,
    } as unknown) as Session,
  };

  const response = await app.handle(request);
  console.log(response);
  expect(true).toBe(true);
});
