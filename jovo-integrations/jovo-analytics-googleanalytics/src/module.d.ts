declare module 'jovo-platform-alexa' {
    interface AlexaSkill {
        getEndReason(): string;
    }

    interface AlexaRequest {
        getDeviceName(): string;
        getScreenResolution?(): string;
    }
}
declare module 'jovo-platform-googleassistant' {
    interface GoogleActionRequest {
        hasScreenInterface(): boolean;
    }
}