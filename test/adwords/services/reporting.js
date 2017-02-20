'use strict';
/**
 * Reporting endpoint
 */

var _ = require('lodash');
var AdwordsReport = require('../../../index').AdwordsReport;

describe('ReportService', function () {

    var config = require('./adwordsuser-config');
    if (!config) {
        return console.log('Adwords User not configured, skipping ReportService Service tests');
    }

    it('should return a valid report', function (done) {
        var report = new AdwordsReport(config);

        report.getReport('v201609', {
            reportName: 'Custom Adgroup Performance Report',
            reportType: 'CAMPAIGN_PERFORMANCE_REPORT',
            fields: ['CampaignId', 'Impressions', 'Clicks', 'Cost'],
            filters: [{ field: 'CampaignStatus', operator: 'IN', values: ['ENABLED', 'PAUSED'] }],
            startDate: new Date("07/10/2016"),
            endDate: new Date(),
            format: 'CSV' //defaults to CSV
        }, done);
    });

    it('should return a valid report for xml type reports', function (done) {
        var report = new AdwordsReport(config);

        report.getReport('v201609', {
            reportName: 'Custom Adgroup Performance Report',
            reportType: 'CAMPAIGN_PERFORMANCE_REPORT',
            fields: ['CampaignId', 'Impressions', 'Clicks', 'Cost'],
            filters: [{ field: 'CampaignStatus', operator: 'IN', values: ['ENABLED', 'PAUSED'] }],
            startDate: new Date("07/10/2016"),
            endDate: new Date(),
            format: 'XML'
        }, done);
    });

    it('should return an invalid report for a bad access token', function (done) {
        var newConfig = _.clone(config);
        newConfig.refresh_token = null;
        newConfig.access_token = null;
        var report = new AdwordsReport(newConfig);
        report.getReport('v201609', {
            reportName: 'Custom Adgroup Performance Report',
            reportType: 'CAMPAIGN_PERFORMANCE_REPORT',
            fields: ['CampaignId', 'Impressions', 'Clicks', 'Cost'],
            filters: [{ field: 'CampaignStatus', operator: 'IN', values: ['ENABLED', 'PAUSED'] }],
            startDate: new Date("07/10/2016"),
            endDate: new Date(),
            format: 'XML'
        }, function (error, data) {
            if (error) {
                return done();
            }
            done(new Error('Should have errored with bad access token'));
        });
    });
});