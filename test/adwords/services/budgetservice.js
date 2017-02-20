'use strict';
/**
 * Tests / Examples for Budget Service
 */

var AdwordsUser = require('../../../index').AdwordsUser;
var AdwordsConstants = require('../../../index').AdwordsConstants;

describe('BudgetService', function () {

    var config = require('./adwordsuser-config');
    if (!config) {
        return console.log('Adwords User not configured, skipping Budget Service tests');
    }

    var user = new AdwordsUser(config);

    it('should return a result with a list of budgets', function (done) {
        var budgetService = user.getService('BudgetService', config.version);
        var selector = {
            fields: ['BudgetId', 'Amount', 'BudgetStatus'],
            ordering: [{ field: 'Amount', sortOrder: 'ASCENDING' }],
            paging: { startIndex: 0, numberResults: AdwordsConstants.RECOMMENDED_PAGE_SIZE }
        };
        budgetService.get({ selector: selector }, done);
    });

    it('should create a sample budget', function (done) {
        var budgetService = user.getService('BudgetService', config.version);
        var budgetOperation = {
            operator: 'ADD',
            operand: {
                name: 'Budget ' + Date.now(),
                amount: {
                    microAmount: 1000000
                },
                deliveryMethod: 'STANDARD'
            }
        };

        budgetService.mutate({ operations: [budgetOperation] }, function (error, budget) {
            if (error) {
                return done(error);
            }
            var budget = budget.value[0];

            //delete the budget
            var budgetOperation = {
                operator: 'REMOVE',
                operand: {
                    budgetId: budget.budgetId
                }
            };
            budgetService.mutate({ operations: [budgetOperation] }, done);
        });
    });
});