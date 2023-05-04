import { Output, BaseOutput, OutputTemplate, OutputOptions } from '@jovotech/framework';
import { AplRenderDocumentDirective } from '../models';

interface AplRenderDocumentOutputOptions extends OutputOptions {
  document: AplRenderDocumentDirective['document'];
  sources?: AplRenderDocumentDirective['sources'];
  datasources?: AplRenderDocumentDirective['datasources'];
  token?: AplRenderDocumentDirective['token'];
}

@Output()
export class AplRenderDocumentOutput extends BaseOutput<AplRenderDocumentOutputOptions> {
  async build(): Promise<OutputTemplate> {
    const aplRenderDocDirective: AplRenderDocumentDirective = {
      type: 'Alexa.Presentation.APL.RenderDocument',
      document: this.options.document,
      datasources: this.options.datasources,
      sources: this.options.sources,
      token: this.options.token || 'token',
    };

    return {
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              directives: [aplRenderDocDirective],
            },
          },
        },
      },
    };
  }
}
