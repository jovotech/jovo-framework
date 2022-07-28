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

  getSpeech(): string | string[] | undefined {
    // Usually, Google Assistant Jovo responses only contain firstSimple,
    // so in most cases, this method will return a string.
    // In case lastSimple is available as well, both values are returned as an array
    if (this.prompt?.firstSimple?.speech && this.prompt?.lastSimple?.speech) {
      return [this.prompt.firstSimple.speech, this.prompt.lastSimple.speech];
    }

    return this.prompt?.firstSimple?.speech;
  }

  getReprompt(): string | string[] | undefined {
    // In the GoogleAssistantOutputTemplateConverterStrategy, all 3 reprompt values are the same,
    // so in most cases, this will return a string of the common value.
    // If the values differ, the method returns an array with all strings
    if (
      // TODO: Clean this up a little
      this.session?.params._GOOGLE_ASSISTANT_REPROMPTS_?.NO_INPUT_1 &&
      this.session?.params._GOOGLE_ASSISTANT_REPROMPTS_?.NO_INPUT_1 ===
        this.session?.params._GOOGLE_ASSISTANT_REPROMPTS_?.NO_INPUT_2 &&
      this.session?.params._GOOGLE_ASSISTANT_REPROMPTS_?.NO_INPUT_1 ===
        this.session?.params._GOOGLE_ASSISTANT_REPROMPTS_?.NO_INPUT_FINAL
    ) {
      return [
        this.session.params._GOOGLE_ASSISTANT_REPROMPTS_.NO_INPUT_1,
        this.session.params._GOOGLE_ASSISTANT_REPROMPTS_.NO_INPUT_2,
        this.session.params._GOOGLE_ASSISTANT_REPROMPTS_.NO_INPUT_FINAL,
      ];
    }

    return this.session?.params._GOOGLE_ASSISTANT_REPROMPTS_?.NO_INPUT_1;
  }

  replaceSpeech(speech: string | string[]): void {
    // Usually, Google Assistant Jovo responses only contain firstSimple,
    // so in most cases, this method will accept a string and replace firstSimple.speech.
    // In case lastSimple is available as well, this method can accept an array
    const firstSimpleSpeech = Array.isArray(speech) ? speech[0] : speech;
    if (this.prompt?.firstSimple) {
      this.prompt.firstSimple.speech = firstSimpleSpeech;
    }

    const lastSimpleSpeech = Array.isArray(speech) && speech.length > 1 ? speech[1] : undefined;
    if (this.prompt?.lastSimple && lastSimpleSpeech) {
      this.prompt.lastSimple.speech = lastSimpleSpeech;
    }
  }

  replaceReprompt(reprompt: string | string[]): void {
    // In the GoogleAssistantOutputTemplateConverterStrategy, all 3 reprompt values are the same,
    // so the main use case is passing a single reprompt, which is then replacing all values.
    // However, if an array with 3 elements is passed, the values are replaced accordingly.
    if (this.session) {
      if (Array.isArray(reprompt) && reprompt.length > 2) {
        this.session.params._GOOGLE_ASSISTANT_REPROMPTS_ = {
          NO_INPUT_1: reprompt[0],
          NO_INPUT_2: reprompt[1],
          NO_INPUT_FINAL: reprompt[2],
        };
      }

      // TODO: Clean this up a little
      this.session.params._GOOGLE_ASSISTANT_REPROMPTS_ = {
        NO_INPUT_1: Array.isArray(reprompt) ? reprompt[0] : reprompt,
        NO_INPUT_2: Array.isArray(reprompt) ? reprompt[0] : reprompt,
        NO_INPUT_FINAL: Array.isArray(reprompt) ? reprompt[0] : reprompt,
      };
    }
  }
}
