import { BaseComponent, Global, Intents } from '@jovotech/framework';
import { GoogleAssistantSystemIntent } from './enums';

@Global()
export class GoogleAssistantRepromptComponent extends BaseComponent {
  @Intents(
    GoogleAssistantSystemIntent.NoInput1,
    GoogleAssistantSystemIntent.NoInput2,
    GoogleAssistantSystemIntent.NoInputFinal,
  )
  async googleAssistantNoInput(): Promise<void> {
    // could be improved to only the the string that is related to the current intent
    const prompt =
      this.$session._GOOGLE_ASSISTANT_REPROMPTS_?.NO_INPUT_1 ||
      this.$session._GOOGLE_ASSISTANT_REPROMPTS_?.NO_INPUT_2 ||
      this.$session._GOOGLE_ASSISTANT_REPROMPTS_?.NO_INPUT_FINAL;
    if (prompt) {
      await this.$send({
        message: prompt,
      });
      // only delete reprompts on final reprompt
      if (this.$input.getIntentName() === GoogleAssistantSystemIntent.NoInputFinal) {
        delete this.$session._GOOGLE_ASSISTANT_REPROMPTS_;
      }
    }
  }
}
