export interface DialogflowTextInput {
  text: string;
  languageCode: string;
}

export interface DialogflowRequest {
  queryParams?: {
    timeZone?: string;
  };
  queryInput: {
    text: DialogflowTextInput;
  };
}

export interface DialogflowFulfillmentMessage {
  text: {
    text: string[];
  };
}

export interface DialogflowQueryResult {
  queryText: string;
  languageCode: string;
  speechRecognitionConfidence?: number;
  action?: string;
  parameters: Record<string, string | string[]>;
  allRequiredParamsPresent: boolean;
  fulfillmentText?: string;
  fulfillmentMessages?: DialogflowFulfillmentMessage[];
  webhookSource?: string;
  // tslint:disable-next-line
  webhookPayload?: Record<string, any>;
  intent: {
    name: string;
    displayName: string;
    isFallback?: boolean;
  };
  intentDetectionConfidence: number;
  // tslint:disable-next-line
  diagnosticInfo: Record<string, any>;
}

export interface DialogflowResponse {
  responseId: string;
  queryResult: DialogflowQueryResult;
  webhookStatus: {
    message: string;
  };
}
