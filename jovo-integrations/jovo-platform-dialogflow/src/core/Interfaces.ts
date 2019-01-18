import { TestSuite } from "jovo-core";
import { DialogflowRequestBuilder } from "./DialogflowRequestBuilder";
import { DialogflowResponseBuilder } from "./DialogflowResponseBuilder";

export interface DialogflowTestSuite extends TestSuite<DialogflowRequestBuilder, DialogflowResponseBuilder> {}
