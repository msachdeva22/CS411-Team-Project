const express = require('express');
const request = require('request');     //need to run 'npm install request' ; changed from fetch bc/issues with node versioning
const config = require('../config');
const router = express.Router();

const requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

router.get('/', function(req, res, next) {
    res.render('api');  //GET method is used when page is loaded, renders basic webpage
});

//setting up location API endpoint string to be queried for data
const locApi1 = config.loc_endpoint + config.apiKey + '&q='    //query city will go after this
const locApi2 = config.lang + config.details

router.post('/', (req, res, next) => {
    /* Queries location API, response if contained within the 'body' object if successful, error is filled if something
    goes wrong in call. Query city is drawn from the input form on page, contained within req.body */
    request(locApi1 + req.body.City + locApi2, requestOptions, function(error, response, body)  {
        const jsonLoc = JSON.parse(body);   //converts body object into JSON; easier to work with
        const firstResult = jsonLoc[0];    //grabs top result from city search

        //Sets up API endpoint for the conditions API using the first result of the city search response
        const condApi = config.cond_endpoint + firstResult.Key + '?apikey=' + config.apiKey + config.lang + config.details
        request(condApi, requestOptions, function(error, response, body)  {
            const jsonCond = JSON.parse(body)[0];

            //renders webpage using api.pug, passes 'conditions' variable with data from the condition JSON object
            res.render('api', {conditions: jsonCond.WeatherText + ", " + jsonCond.Temperature.Imperial.Value
                    + jsonCond.Temperature.Imperial.Unit});
        })
    })
});

module.exports = router;