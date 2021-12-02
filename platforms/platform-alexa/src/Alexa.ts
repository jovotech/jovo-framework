import { EntityMap, Jovo } from '@jovotech/framework';
import { AlexaDevice } from './AlexaDevice';
import { AlexaPlatform } from './AlexaPlatform';
import { AlexaRequest } from './AlexaRequest';
import { AlexaResponse } from './AlexaResponse';
import { AlexaUser } from './AlexaUser';
import { AlexaEntity } from './interfaces';

export class Alexa extends Jovo<
  AlexaRequest,
  AlexaResponse,
  Alexa,
  AlexaUser,
  AlexaDevice,
  AlexaPlatform
> {
  $entities!: EntityMap<AlexaEntity>;

  getSkillId(): string | undefined {
    return (
      this.$request.session?.application?.applicationId ||
      this.$request.context?.System?.application?.applicationId
    );
  }
}
