import { App, EntityMap, HandleRequest, Jovo } from '@jovotech/framework';
import { AlexaDevice } from './AlexaDevice';
import { AlexaPlatform } from './AlexaPlatform';
import { AlexaRequest } from './AlexaRequest';
import { AlexaResponse } from './AlexaResponse';
import { AlexaUser } from './AlexaUser';
import { AlexaEntity } from './interfaces';
import { AlexaIsp } from './AlexaIsp';

export class Alexa extends Jovo<
  AlexaRequest,
  AlexaResponse,
  Alexa,
  AlexaUser,
  AlexaDevice,
  AlexaPlatform
> {
  $entities!: EntityMap<AlexaEntity>;
  isp: AlexaIsp;

  constructor($app: App, $handleRequest: HandleRequest, $platform: AlexaPlatform) {
    super($app, $handleRequest, $platform);
    this.isp = new AlexaIsp(this);
  }
  getSkillId(): string | undefined {
    return (
      this.$request.session?.application?.applicationId ||
      this.$request.context?.System?.application?.applicationId
    );
  }
}
