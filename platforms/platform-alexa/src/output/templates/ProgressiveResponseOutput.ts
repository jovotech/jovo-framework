import { axios, BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';

export interface ProgressiveResponseOutputOptions extends OutputOptions {
  speech: string;
}
@Output()
export class ProgressiveResponseOutput extends BaseOutput<ProgressiveResponseOutputOptions> {
  /*
    |--------------------------------------------------------------------------
    | Output Template
    |--------------------------------------------------------------------------
    |
    | This structured output is later turned into a native response
    | Learn more here: www.jovo.tech/docs/output
    |
    */
  async build(): Promise<OutputTemplate | OutputTemplate[]> {
    if (this.jovo.$alexa && this.jovo.$alexa.$request.request) {
      await this.progressiveResponse(
        this.options.speech,
        this.jovo.$alexa.$request.request.requestId,
        this.jovo.$alexa.$request.getApiEndpoint(),
        this.jovo.$alexa.$request.getApiAccessToken(),
      );
    }

    return {};
  }

  async progressiveResponse(
    speech: string,
    requestId: string,
    apiEndPoint: string,
    apiAccessToken: string,
  ): Promise<void> {
    const data = {
      header: {
        requestId,
      },
      directive: {
        type: 'VoicePlayer.Speak',
        speech: speech,
      },
    };

    const url = `${apiEndPoint}/v1/directives`;

    await axios.request({
      data,
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiAccessToken}`,
      },
    });
  }
}
