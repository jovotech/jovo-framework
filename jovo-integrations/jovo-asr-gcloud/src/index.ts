import { Config } from './GCloudAsr';

interface AppGCloudAsrConfig {
	GCloudAsr?: Config;
}

declare module 'jovo-core/dist/src/Interfaces' {
	export interface ExtensiblePluginConfigs extends AppGCloudAsrConfig {}
}

export * from './GCloudAsr';
export * from './Interfaces';
