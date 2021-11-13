const express = require('express');
const fetch = import('node-fetch');    // need to run 'npm install node-fetch' before usage
const config = require('../config');
const router = express.Router();

const requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

const apiFirst = config.loc_endpoint + config.apiKey + '&q='    //query city will go after this
const apiSecond = config.lang + config.details + config.offset

router.post('/api', (req, res, next) => {
    fetch("tempurl", requestOptions)
        .then(response => response[0].json())   //search returns an array of cities, select first result to parse?
        .then(
            result => {
                //will do work on api data in here
                console.log(result)
            }
        )
        .catch(error => console.log('error', error));
});

module.exports = router;