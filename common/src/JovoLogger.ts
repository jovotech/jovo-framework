import {
  Logger as TsLogger,
  ISettingsParam,
  TLogLevelName,
  TUtilsInspectColors,
  ILogObject,
} from 'tslog';
import _merge from 'lodash.merge';
import { JovoError } from './JovoError';
import { inspect } from 'util';
import { AnyObject } from './index';
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
      minLevel: (process.env.JOVO_LOG_LEVEL as TLogLevelName) || 'info',
    };
  }
  private static getNoStyleConfig(): ISettingsParam {
    return {
      exposeErrorCodeFrame: false,
      displayDateTime: false,
      displayFilePath: 'hidden',
      displayLogLevel: false,
      displayFunctionName: false,
      displayTypes: false,
      delimiter: '',
    };
  }

  error(...args: unknown[]): ILogObject {
    for (let i = 0; i < args.length; i++) {
      if (args[i] instanceof JovoError) {
        return this.jovoError(args[i] as JovoError);
      }
    }
    return super.error(...args);
  }

  jovoError(error: JovoError, settings?: ISettingsParam): ILogObject {
    const jovoErrorSettings = settings || {};

    const noStyleLogger = this.getChildLogger({
      ...JovoLogger.getNoStyleConfig(),
      ...jovoErrorSettings,
    });

    const lowStyleWithStackLogger = noStyleLogger.getChildLogger({
      ...JovoLogger.getNoStyleConfig(),
      exposeErrorCodeFrame: false,
      exposeStack: true,
      displayLogLevel: false,
      ignoreStackLevels: 6,
    });

    noStyleLogger.error(
      this.style('JOVO ERROR', 'redBright') +
        ' ' +
        this.style(' ' + error.name + ' ', 'bgRedBright'),
    );

    if (error.package) {
      noStyleLogger.error('\nPackage: ');
      noStyleLogger.error(error.package);
    }

    if (error.message) {
      noStyleLogger.error(`\n${this.style('message:', 'underline')}`);
      noStyleLogger.error(`${this.style(error.message, 'whiteBright')}`);
    }

    if (error.context) {
      noStyleLogger.error(`\n${this.style('context:', 'underline')}`);

      const removeUndefined = (obj: AnyObject) => {
        const nObj: AnyObject = {};
        Object.keys(obj).forEach((key) => {
          if (obj[key] === Object(obj[key])) {
            nObj[key] = removeUndefined(obj[key]);
          } else if (obj[key] !== undefined) {
            nObj[key] = obj[key];
          }
        });
        return nObj;
      };

      noStyleLogger.error(removeUndefined(error.context));
    }

    if (error.stack) {
      lowStyleWithStackLogger.error('');
    }
    if (error.hint) {
      noStyleLogger.error(`\n${this.style('hint:', 'underline')}`);
      noStyleLogger.error(`${this.style(error.hint, 'whiteBright')}`);
    }

    if (error.learnMore) {
      noStyleLogger.error(`\n${this.style('learn more:', 'underline')}`);
      noStyleLogger.error(`${this.style(error.learnMore, 'whiteBright')}`);
    }

    return noStyleLogger.error('\n');
  }

  style(str: string, style: TUtilsInspectColors | TUtilsInspectColors[]): string {
    const styles = Array.isArray(style) ? style : [style];

    return this.settings.colorizePrettyLogs
      ? styles.reduce((str: string, style: TUtilsInspectColors) => {
          const color: [number, number] = inspect.colors[style] ?? [0, 0];
          return `\u001b[${color[0]}m${str}\u001b[${color[1]}m`;
        }, str)
      : str;
  }
}
