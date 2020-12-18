import { HandleRequest } from 'jovo-core';
import { CorePlatformCore } from 'jovo-platform-core';
import { WebApp, WebAppRequest, WebAppUser } from '..';

export class WebPlatformCore extends CorePlatformCore {
  async init(handleRequest: HandleRequest): Promise<void> {
    const requestObject = handleRequest.host.getRequestObject() as WebAppRequest;

    if (this.isCoreRequest(requestObject) && requestObject.type === 'jovo-platform-web') {
      handleRequest.jovo = new WebApp(handleRequest.app, handleRequest.host, handleRequest);
    }
  }

  async request(webApp: WebApp) {
    if (!webApp.$host) {
      throw new Error(`Couldn't access host object.`);
    }

    this.overwriteRequestAudioData(webApp.$host);

    webApp.$request = WebAppRequest.fromJSON(webApp.$host.getRequestObject()) as WebAppRequest;
    webApp.$user = new WebAppUser(webApp);
  }

  protected getPlatformType() {
    return 'WebPlatform';
  }
}
