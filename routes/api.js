const express = require('express');
const request = require('request');     //need to run 'npm install request' ; changed from fetch bc/issues with node versioning
const config = require('../config');
const router = express.Router();

const requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

router.get('/', function(req, res, next) {
    res.render('api');
});

const locApi1 = config.loc_endpoint + config.apiKey + '&q='    //query city will go after this
const locApi2 = config.lang + config.details

router.post('/', (req, res, next) => {
    request(locApi1 + req.body.City + locApi2, requestOptions, function(error, response, body)  {
        const jsonLoc = JSON.parse(body);
        const firstResult = jsonLoc[0];    //grabs top result from city search

        const condApi = config.cond_endpoint + firstResult.Key + '?apikey=' + config.apiKey + config.lang + config.details
        request(condApi, requestOptions, function(error, response, body)  {
            const jsonCond = JSON.parse(body)[0];

            res.render('api', {conditions: jsonCond.WeatherText, tempVal: jsonCond.Temperature.Imperial.Value,
                                            tempUnit: jsonCond.Temperature.Imperial.Unit});
        })


        //res.render('api',{stateName: firstResult.AdministrativeArea.EnglishName });
    })
});

module.exports = router;