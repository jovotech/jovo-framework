import { app } from './app';
import { JovoDebugger } from 'jovo-plugin-debugger';

const config = {
  logging: false,
  plugins: [new JovoDebugger()],
};

export { config };
