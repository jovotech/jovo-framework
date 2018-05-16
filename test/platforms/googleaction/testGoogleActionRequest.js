'use strict';
// const expect = require('chai').expect;
const intentRequestSample = require('../../../lib/platforms/googleaction/request/samples/googleActionDialogflow/v1/intentSample.json');
const GoogleActionDialogFlowRequest = require('./../../../lib/platforms/googleaction/request/googleActionDialogFlowRequest').GoogleActionDialogFlowRequest;

describe('Tests for GoogleActionRequest Class', function() {
    it('constructor()', function() {
        let request = new GoogleActionDialogFlowRequest(intentRequestSample); // eslint-disable-line
        // console.log(JSON.stringify(request, null, '\t'));
        // console.log(request.getOriginalRequest().getUserId());
        // console.log(request.getId());
    });
});


