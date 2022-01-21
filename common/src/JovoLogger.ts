import chalk, { Chalk } from 'chalk';
import _mergeWith from 'lodash.mergewith';
import { getLogger, levels, Logger, LogLevelDesc } from 'loglevel';
import { JovoError } from './JovoError';

export interface JovoLoggerConfig {
  name: string | symbol;
  level: LogLevelDesc;
  disableStyling: boolean;
  // TODO determine name
  properties: Array<keyof JovoError>;
}

export class JovoLogger {
  readonly logger: Logger;
  config: JovoLoggerConfig;

  constructor(nameOrConfig?: string | Partial<JovoLoggerConfig>) {
    const defaultConfig = this.getDefaultConfig();
    // if a config is passed, merge the default config with either the passed config or name
    // otherwise just use the default config
    this.config = nameOrConfig
      ? _mergeWith(
          defaultConfig,
          typeof nameOrConfig === 'string' ? { name: nameOrConfig } : nameOrConfig,
          (value, srcValue) => {
            if (Array.isArray(value) && Array.isArray(srcValue)) {
              return srcValue;
            }
          },
        )
      : defaultConfig;

    // create the logger instance with the given name
    // if the name is used again, the same instance will be returned
    this.logger = getLogger(this.config.name);
    // set the level of the logger depending on the config
    this.logger.setLevel(this.config.level);
  }

  get level(): LogLevelDesc {
    return this.logger.getLevel();
  }

  set level(level: LogLevelDesc) {
    this.logger.setLevel(level);
  }

  getDefaultConfig(): JovoLoggerConfig {
    return {
      name: 'JovoLogger',
      disableStyling: false,
      level: (process.env.JOVO_LOG_LEVEL as LogLevelDesc | undefined) || levels.TRACE,
      properties: ['package', 'message', 'context', 'stack', 'hint', 'learnMore'],
    };
  }

  trace(...args: unknown[]): void {
    this.applyStyleIfEnabled(args, chalk.magenta);
    this.logger.trace(...args);
  }

  log(...args: unknown[]): void {
    this.applyStyleIfEnabled(args, chalk.white);
    this.logger.log(...args);
  }

  debug(...args: unknown[]): void {
    this.applyStyleIfEnabled(args, chalk.green);
    this.logger.debug(...args);
  }

  info(...args: unknown[]): void {
    this.applyStyleIfEnabled(args, chalk.blue);
    this.logger.info(...args);
  }

  warn(...args: unknown[]): void {
    this.applyStyleIfEnabled(args, chalk.yellow);
    this.logger.warn(...args);
  }

  error(...args: unknown[]): void {
    const logPart = (part: unknown[]) => {
      if (part.length) {
        this.applyStyleIfEnabled(part, chalk.red);
        this.logger.error(...part);
      }
    };

    // just looping args and using this.logger.error there would lead to more line breaks than expected,
    // therefore the logic beneath only adds line breaks when a JovoError was found as arg
    let currentPart: unknown[] = [];
    args.forEach((value) => {
      // if the value is a JovoError make sure to log the current part and reset it
      if (value instanceof JovoError) {
        logPart(currentPart);
        currentPart = [];
        // and also log the JovoError
        this.jovoError(value);
      } else {
        // otherwise just add to the current part
        currentPart.push(value);
      }
    });
    // if there's anything left in the current part, log it as well
    logPart(currentPart);
  }

  jovoError(error: JovoError): void {
    this.logger.error(
      this.style('\nJOVO ERROR', chalk.redBright),
      this.style(` ${error.name} `, chalk.bgRedBright),
    );
    // add empty line after error header
    this.logger.error();

    // function for logging a property of JovoError if it exists and is a string
    // an additional chalk method can be passed for customizing the value's text
    const logStringProperty = (property: keyof JovoError, style: Chalk = chalk.whiteBright) => {
      const value = error[property];
      if (!value || typeof value !== 'string') {
        return;
      }
      // format property: uppercase letters to lower case and add space before
      // example: learnMore -> learn more; helloWorld -> hello world
      const formattedProperty = property.replace(/([A-Z])/g, (text) => ' ' + text.toLowerCase());
      this.logger.error(this.style(`${formattedProperty}:`, chalk.underline));
      this.logger.error(this.style(value, style));
    };

    // function for logging the context of JovoError
    const logContext = () => {
      this.logger.error(this.style('context:', chalk.underline));
      this.logger.error(error.context);
    };

    // function for logging a property of JovoError
    const logProperty = (property: keyof JovoError, style?: Chalk) => {
      if (property === 'context') {
        logContext();
      } else {
        logStringProperty(property, style);
      }
      // add empty line after property block
      this.logger.error();
    };

    // log each configured property
    this.config.properties.forEach((property) => {
      logProperty(property);
    });
  }

  // utility method that only applies the given chalk-function if styling is not disabled
  private style(text: string, chalkFn: Chalk): string {
    if (this.config.disableStyling) {
      return text;
    }
    return chalkFn(text);
  }

  // applies the given style to all strings in the given args if styling is not disabled
  private applyStyleIfEnabled<T extends unknown[]>(args: T, chalkFn: Chalk): void {
    if (this.config.disableStyling) {
      return;
    }
    args.forEach((arg, index) => {
      // only style strings for now
      if (typeof arg === 'string') {
        args[index] = chalkFn(arg);
      }
    });
  }
}
