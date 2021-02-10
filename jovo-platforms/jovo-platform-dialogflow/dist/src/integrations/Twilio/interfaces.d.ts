export interface CarrierLocation {
    city: string;
    state: string;
    zip: string;
}
export interface TwilioPayload {
    SmsMessageSid: string;
    NumSegments: string;
    ToCity: string;
    FromCity: string;
    ToState: string;
    MessageSid: string;
    FromCountry: string;
    ToCountry: string;
    SmsSid: string;
    FromState: string;
    ToZip: string;
    FromZip: string;
    Body: string;
    SmsStatus: string;
    MessagingServiceSid: string;
    AccountSid: string;
    From: string;
    ApiVersion: string;
    NumMedia: string;
    To: string;
}
