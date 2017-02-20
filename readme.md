# Node Adwords Api (ECMAScript 5 port)

**Note that this is the ECMAScript 5 port and not the original module. If you are looking for the original ECMAScript 6 module use instead node-adwords module**

This is an unofficial Adwords sdk for NodeJS > 3.0. This Api mirrors the official
PHP api pretty well so you can always look at that documentation if
something doesn't stand out.

This API is the first feature complete Adwords Api for Node.

You will need an Adwords developer token. Apply [here](https://developers.google.com/adwords/api/docs/guides/signup)

**Note about versioning**: This library is going to follow the Adwords Api and not
standard semvar. We are going to jump from 1.0 to 201607.0. Whenever a new version
of the Api comes out, we will update to the version inside Adwords. You will need
to update via `npm outdated`. This is because the Adwords Api is always
introducing new apis and breaking old ones.


## Getting Started

The main adwords user object follows the [auth](https://github.com/googleads/googleads-php-lib/blob/master/src/Google/Api/Ads/AdWords/auth.ini) parameters
of the PHP library.

```js
var AdwordsUser = require('node-adwords').AdwordsUser;

var user = new AdwordsUser({
    developerToken: 'INSERT_DEVELOPER_TOKEN_HERE', //your adwords developerToken
    userAgent: 'INSERT_COMPANY_NAME_HERE', //any company name
    clientCustomerId: 'INSERT_CLIENT_CUSTOMER_ID_HERE', //the Adwords Account id (e.g. 123-123-123)
    client_id: 'INSERT_OAUTH2_CLIENT_ID_HERE', //this is the api console client_id
    client_secret: 'INSERT_OAUTH2_CLIENT_SECRET_HERE',
    refresh_token: 'INSERT_OAUTH2_REFRESH_TOKEN_HERE'
});
```

## Usage

The following shows how to retrieve a list of campaigns. The biggest difference
from the PHP library is the node library does not have special objects for
`Selector` and `Page` and other entity types. It uses standard object notation.


```js
var AdwordsUser = require('node-adwords').AdwordsUser;
var AdwordsConstants = require('node-adwords').AdwordsConstants;

var user = new AdwordsUser({...});
var campaignService = user.getService('CampaignService', 'v201609')

//create selector
var selector = {
    fields: ['Id', 'Name'],
    ordering: [{field: 'Name', sortOrder: 'ASCENDING'}],
    paging: {startIndex: 0, numberResults: AdwordsConstants.RECOMMENDED_PAGE_SIZE}
}

campaignService.get({serviceSelector: selector}, function (error, result) {
    console.log(error, result);
})

```

## Reporting

The Adwords SDK also has a reporting endpoint, which is separate from
the `user.getService` endpoint since the reporting api is not part of the
regular api.

```js
var AdwordsReport = require('node-adwords').AdwordsReport;

var report = new AdwordsReport({/** same config as AdwordsUser above */});
report.getReport('v201609', {
    reportName: 'Custom Adgroup Performance Report',
    reportType: 'CAMPAIGN_PERFORMANCE_REPORT',
    fields: ['CampaignId', 'Impressions', 'Clicks', 'Cost'],
    filters: [
        {field: 'CampaignStatus', operator: 'IN', values: ['ENABLED', 'PAUSED']}
    ],
    startDate: new Date("07/10/2016"),
    endDate: new Date(),
    format: 'CSV' //defaults to CSV
}, function (error, report) {
    console.log(error, report);
});
```

You can also pass in additional headers in case you need to remove the header rows

```js
report.getReport('v201609', {
    ...
    additionalHeaders: {
        skipReportHeader: true,
        skipReportSummary: true
    }
}, function (error, report) {
    console.log(error, report);
});
```



## Authentication
Internally, the node-adwords sdk use the [official google api client](https://github.com/google/google-api-nodejs-client)
for authenticating users. Using the `https://www.googleapis.com/auth/adwords` scope.
The node-adwords sdk has some helper methods for you to authenticate if you do not
need additional scopes.

```js
var AdwordsUser = require('node-adwords').AdwordsAuth;

var auth = new AdwordsAuth({
    client_id: 'INSERT_OAUTH2_CLIENT_ID_HERE', //this is the api console client_id
    client_secret: 'INSERT_OAUTH2_CLIENT_SECRET_HERE'
}, 'https://myredirecturlhere.com/adwords/auth' /** insert your redirect url here */);

//assuming express
app.get('/adwords/go', function (req, res) {
    res.redirect(auth.generateAuthenticationUrl());
})

app.get('/adwords/auth', function (req, res) {
    auth.getAccessTokenFromAuthorizationCode(req.query.code, function (error, tokens) {
        //save access and especially the refresh tokens here
    })
});

```

## Adwords.Types
Sometimes, in the Adwords documentation, you will see "Specify xsi:type instead".
As of version 201609.1.0, you can specify this in the request as another attribute.

```js
var operation = {
    operator: 'ADD',
    operand: {
        campaignId: '1234567',
        criterion: {
            type: 'IP_BLOCK',
            'xsi:type': 'IpBlock',
            ipAddress: '123.12.123.12',
        },
        'xsi:type': 'NegativeCampaignCriterion'
    }
}
```

## Testing
For testing, you will need a refresh token as well as a developer token.
These should be placed as environmental variables:

```
$ cp test/configuration/tokens.dist test/configuration/tokens # Copy tokens template file
$ editor test/configuration/tokens # Configure tokens
$ npm test # Run tests
```

## Credits
While this is not a fork of
the [googleads-node-lib library](https://github.com/ErikEvenson/googleads-node-lib/), it
did help with some debugging while creating this one.
