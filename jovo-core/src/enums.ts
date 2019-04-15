export enum EnumRequestType {
    LAUNCH = "LAUNCH",
    INTENT = "INTENT",
    END = "END",
    UNHANDLED = "Unhandled",
    ON_ERROR = "ON_ERROR",

    ON_REQUEST = "ON_REQUEST",
    NEW_USER = "NEW_USER",
    NEW_SESSION = "NEW_SESSION",

    AUDIOPLAYER = "AUDIOPLAYER",
    ON_EVENT = "ON_EVENT",
    ON_ELEMENT_SELECTED = "ON_ELEMENT_SELECTED",
    UNDEFINED = "UNDEFINED",

    // Google Action AskFor
    ON_PERMISSION = "ON_PERMISSION",
    ON_SIGN_IN = "ON_SIGN_IN",
    ON_CONFIRMATION = "ON_CONFIRMATION",
    ON_DATETIME = "ON_DATETIME",
    ON_PLACE = "ON_PLACE"
}

export enum SessionConstants {
    STATE = "_JOVO_STATE_",
}
