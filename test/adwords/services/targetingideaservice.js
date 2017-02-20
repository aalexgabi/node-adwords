'use strict';
/**
 * Tests / Examples for Targeting Idea Service
 */

var AdwordsUser = require('../../../index').AdwordsUser;
var AdwordsConstants = require('../../../index').AdwordsConstants;

describe('TargetingIdeaService', function () {

    var config = require('./adwordsuser-config');
    if (!config) {
        return console.log('Adwords User not configured, skipping Campaign Service tests');
    }

    var user = new AdwordsUser(config);

    it('should return a targeting idea list', function (done) {
        var targetingIdeaService = user.getService('TargetingIdeaService', config.version);
        var selector = {
            searchParameters: [{
                'xsi:type': 'RelatedToQuerySearchParameter',
                queries: ['test']
            }, {
                'xsi:type': 'LanguageSearchParameter',
                languages: [{ 'cm:id': 1000 }]
            }],
            ideaType: 'KEYWORD',
            requestType: 'IDEAS',
            requestedAttributeTypes: ['KEYWORD_TEXT'],
            paging: {
                startIndex: 0,
                numberResults: AdwordsConstants.RECOMMENDED_PAGE_SIZE
            }
        };

        targetingIdeaService.get({ selector: selector }, done);
    });
});