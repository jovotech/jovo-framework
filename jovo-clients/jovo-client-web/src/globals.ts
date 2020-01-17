import { JovoWebClientOptions } from './';
import { version } from './../package.json';

export const ASSISTANT_DEFAULT_OPTIONS: () => JovoWebClientOptions = () => {
  return {
    debugMode: false,
    initBaseComponents: true,
    launchFirst: true,
    locale: navigator.language,
    speechSynthesis: {
      automaticallySetLanguage: true,
    },
  };
};
