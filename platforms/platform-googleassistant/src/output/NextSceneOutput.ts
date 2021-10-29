import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';

export interface NextSceneOptions extends OutputOptions {
  name: string;
  slots?: Record<string, unknown>;
}

@Output()
export class NextSceneOutput extends BaseOutput<NextSceneOptions> {
  build(): OutputTemplate | OutputTemplate[] {
    return {
      message: this.options.message,
      platforms: {
        googleAssistant: {
          nativeResponse: {
            scene: {
              name: this.jovo.$googleAssistant?.$request.scene?.name,
              slots: this.options.slots || {},
              next: {
                name: this.options.name,
              },
            },
          },
        },
      },
    };
  }
}
