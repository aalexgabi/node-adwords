'use strict';
/**
 * Tests / Examples for Campaign Criterion Service
 */

var _ = require('lodash');
var AdwordsUser = require('../../../index').AdwordsUser;
var AdwordsConstants = require('../../../index').AdwordsConstants;

var campaignId = null;

/**
 * We need to grab a campaign id to test with
 */
before(function (done) {
    var config = require('./adwordsuser-config');
    var user = new AdwordsUser(config);

    if (!config) {
        return;
    }
    var campaignService = user.getService('CampaignService', config.version);
    var selector = {
        fields: ['Id', 'Name'],
        ordering: [{ field: 'Name', sortOrder: 'ASCENDING' }],
        paging: { startIndex: 0, numberResults: AdwordsConstants.RECOMMENDED_PAGE_SIZE }
    };

    campaignService.get({ serviceSelector: selector }, function (error, campaigns) {
        var campaign = _.first(campaigns && campaigns.entries) || {};
        campaignId = campaign.id;
        done(error);
    });
});

describe('CampaignCriterionService', function () {

    var config = require('./adwordsuser-config');
    if (!config) {
        return console.log('Adwords User not configured, skipping Campaign Criterion Service tests');
    }

    var user = new AdwordsUser(config);

    it('should return a result with a list of Campaign Criterions', function (done) {
        var campaignCriterionService = user.getService('CampaignCriterionService', config.version);
        var selector = {
            fields: ['Id', 'CampaignId', 'Address'],
            ordering: [{ field: 'Id', sortOrder: 'ASCENDING' }],
            paging: { startIndex: 0, numberResults: AdwordsConstants.RECOMMENDED_PAGE_SIZE }
        };
        campaignCriterionService.get({ serviceSelector: selector }, done);
    });

    it('should create a campaign criterion', function (done) {
        var campaignCriterionService = user.getService('CampaignCriterionService', config.version);

        var operation = {
            operator: 'ADD',
            operand: {
                campaignId: campaignId, //from the before hook
                criterion: {
                    type: 'IP_BLOCK',
                    'xsi:type': 'IpBlock',
                    ipAddress: '123.12.123.12'
                },
                'xsi:type': 'NegativeCampaignCriterion'
            }
        };

        campaignCriterionService.mutate({ operations: [operation] }, function (error, result) {
            if (error) {
                return done(error);
            }
            var criteron = result.value[0];
            operation.operator = 'REMOVE';
            operation.operand = criteron;
            campaignCriterionService.mutate({ operations: [operation] }, done);
        });
    });
});