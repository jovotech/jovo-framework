import {EnumRequestType, JovoError, Plugin, PluginConfig} from 'jovo-core';
import {CorePlatform, CorePlatformRequest, CorePlatformApp} from '../../src';

interface Config extends PluginConfig {
}

export class RequestSLU implements Plugin {
    config: Config = {};

    install(corePlatform: CorePlatform) {
        corePlatform.middleware('$nlu')!.use(this.nlu.bind(this));
        corePlatform.middleware('$inputs')!.use(this.inputs.bind(this));
    }

    uninstall(corePlatform: CorePlatform) {
    }

    async nlu(corePlatformApp: CorePlatformApp) {
        console.log('[RequestSLU] ( $nlu )');

        const assistantRequest = corePlatformApp.$request!;

        let intentName = 'DefaultFallbackIntent';
        if (assistantRequest.getIntentName()) {
            intentName = assistantRequest.getIntentName()!;
        } else if (corePlatformApp.$type.type === EnumRequestType.LAUNCH) {
            intentName = 'LAUNCH';
        } else if (corePlatformApp.$type.type === EnumRequestType.END) {
            intentName = 'END';
        }

        corePlatformApp.$nlu = {
            intent: {
                name: intentName,
            },
        };
    }

    async inputs(corePlatformApp: CorePlatformApp) {
        console.log('[RequestSLU] ( $inputs )');

        const corePlatformtRequest = corePlatformApp.$request as CorePlatformRequest;
        if (!corePlatformApp.$nlu && corePlatformApp.$type.type === EnumRequestType.INTENT) {
            throw new JovoError('No nlu data to get inputs off was given.');
        } else if (corePlatformApp.$type.type === EnumRequestType.LAUNCH || corePlatformApp.$type.type === EnumRequestType.END) {
            corePlatformApp.$inputs = {};
            return;
        }

        corePlatformApp.$inputs = corePlatformtRequest.inputs || {};
    }
}
