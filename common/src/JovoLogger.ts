import { Logger as TsLogger, ISettingsParam } from 'tslog';
import _merge from 'lodash.merge';
export class JovoLogger extends TsLogger {
  constructor(settings?: ISettingsParam) {
    super();
    this.setSettings(_merge(this.settings, this.getDefaultConfig(), settings));
  }

  getDefaultConfig(): ISettingsParam {
    return {
      prettyInspectOptions: { depth: 3 },
      prefix: [''],
      displayDateTime: false,
    };
  }
}
