import { TestSuite } from "jovo-core";
import { GoogleAssistantRequestBuilder } from "./GoogleAssistantRequestBuilder";
import { GoogleAssistantResponseBuilder } from "./GoogleAssistantResponseBuilder";

export interface GoogleAssistantTestSuite extends TestSuite<GoogleAssistantRequestBuilder, GoogleAssistantResponseBuilder> {}
