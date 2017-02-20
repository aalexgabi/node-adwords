'use strict';
/**
 * Test for the Adwords Request Parser
 */

var assert = require('assert');
var _ = require('lodash');
describe('RequestParser', function () {

    var RequestParser = require('../../lib/request-parser');

    describe('#convertToValidAdwordsRequest', function () {

        it('should convert the xsi:type fields to attributes', function () {
            var operation = {
                criterion: {
                    'xsi:type': 'Test123'
                },
                'xsi:type': 'Test123',
                attributes: {
                    'xsi:type': 'test'
                }
            };
            var newOperation = RequestParser.convertToValidAdwordsRequest(operation);
            assert.strictEqual('string', typeof newOperation.attributes['xsi:type']);
            assert.strictEqual('string', typeof newOperation.criterion.attributes['xsi:type']);
            assert.strictEqual('string', typeof operation['xsi:type']);
        });
    });
});