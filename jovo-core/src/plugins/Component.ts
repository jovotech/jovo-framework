import { PluginConfig } from '../Interfaces';

class Component {
  $response?: Response;
  config: Config;
  data: ComponentData = {};
  name: string;
  onCompletedIntent?: string; // intent to which the component routes to, when it sends out response
  stateBeforeDelegate?: string; // Used to route the app back to the state where it left off after the component is done.

  constructor(options: ConstructorOptions) {
    this.config = options.config;
    this.name = options.name;
  }
}

interface ComponentData {
  [key: string]: any; // tslint:disable-line
}

/**
 * Data from a component that has to be persisted across requests & responses
 */
interface ComponentSessionData {
  data: ComponentData;
  onCompletedIntent: string;
  stateBeforeDelegate: string;
}

interface Config extends PluginConfig {
  intentMap?: {
    [key: string]: string;
  };
}

interface ConstructorOptions {
  config: Config;
  name: string;
}

interface DelegationOptions {
  data?: ComponentData;
  onCompletedIntent: string;
}

interface Response {
  data?: ComponentData;
  error?: Error;
  status: ResponseStatus;
}

type ResponseStatus = 'SUCCESSFUL' | 'REJECTED' | 'ERROR';

export {
  Component,
  ComponentData,
  ComponentSessionData,
  Config as ComponentConfig,
  ConstructorOptions as ComponentConstructorOptions,
  DelegationOptions as ComponentDelegationOptions,
  Response as ComponentResponse,
  ResponseStatus as ComponentResponseStatus,
};
