import { Config } from './LanguageModelTester';
export { LanguageModelTester, Config } from './LanguageModelTester';
interface AppLanguageModelTesterConfig {
    LanguageModelTester?: Config;
}
declare module 'jovo-core/dist/src/Interfaces' {
    interface ExtensiblePluginConfigs extends AppLanguageModelTesterConfig {
    }
}
