import { IsOptional, JovoResponse, Type, ValidateNested } from '@jovotech/output';
import { Device, Expected, Home, Prompt, Scene, Session, User } from './output';

export class GoogleAssistantResponse extends JovoResponse {
  [key: string]: unknown;

  @IsOptional()
  @ValidateNested()
  @Type(() => Prompt)
  prompt?: Prompt;

  @IsOptional()
  @ValidateNested()
  @Type(() => Scene)
  scene?: Scene;

  @IsOptional()
  @ValidateNested()
  @Type(() => Session)
  session?: Session;

  @IsOptional()
  @ValidateNested()
  @Type(() => User)
  user?: User;

  @IsOptional()
  @ValidateNested()
  @Type(() => Home)
  home?: Home;

  @IsOptional()
  @ValidateNested()
  @Type(() => Device)
  device?: Device;

  @IsOptional()
  @ValidateNested()
  @Type(() => Expected)
  expected?: Expected;

  hasSessionEnded(): boolean {
    return this.scene?.next?.name === 'actions.scene.END_CONVERSATION';
  }

  getSpeech(): string | undefined {
    // We're currently only returning firstSimple
    // tbd what should be done if lastSimple is available
    return this.prompt?.firstSimple?.speech;
  }

  getReprompt(): string | undefined {
    // There are 3 reprompts supported, but since currently they are the same by default,
    // we're only returning NO_INPUT_1
    return this.session?.params._GOOGLE_ASSISTANT_REPROMPTS_?.NO_INPUT_1;
  }

  setSpeech(speech: string): void {
    if (this.prompt?.firstSimple) {
      this.prompt.firstSimple.speech = speech;
    }
  }

  setReprompt(speech: string): void {
    // Currently, we're setting the same value for all reprompts, similar to
    // how it's done in the GoogleAssistantOutputTemplateConverterStrategy
    if (this.session) {
      this.session.params._GOOGLE_ASSISTANT_REPROMPTS_ = {
        NO_INPUT_1: speech,
        NO_INPUT_2: speech,
        NO_INPUT_FINAL: speech,
      };
    }
  }
}
