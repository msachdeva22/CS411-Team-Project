const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); //run npm install node-fetch@2
const User = require("../models/User");
const bcrypt = require("bcrypt");
const config = require('../config');
let SpotifyWebApi = require('spotify-web-api-node');

let spotifyApi = new SpotifyWebApi({
  clientId: config.sClient_Id,
  clientSecret: config.sClient_Secret,
  redirectUri: config.sRedirect_URI
});

const requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

//setting up location API endpoint string to be queried for data
const locApi1 = config.loc_endpoint + config.wApiKey + '&q='    //query city will go after this
const locApi2 = config.wLang + config.wDetails

//update user data
router.put('/:id', async(req,res) => {
    if ( req.body.userId == req.params.id ) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
          return res.status(500).json(err);
        }
      }

      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set:req.body,
        });
        res.status(200).json("Account updated");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("Cannot update non-owned account");
    }
});

//delete user
router.delete('/:id', async(req,res) => {
  if ( req.body.userId == req.params.id ) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("Cannot delete non-owned account");
  }
});

//get a user
router.get('/:id', async(req,res) => {
  try {
    const user = await User.findById(req.params.id);
    const {password,currentAccToken, ...others} = user._doc;
    res.status(200).json(others);
  } catch(err) {
    res.status(500).json(err);
  }
});

//server spotify playlist to a user
router.get('/playlist/:id', async(req,res) => {
  try {
    //find user
    const user = await User.findById(req.params.id);
    console.log(user.city);

    const rawLoc = await fetch(locApi1 + user.city + locApi2, requestOptions);
    const jsonLoc = await rawLoc.json();
    const firstResult = jsonLoc[0];

    const condApi = config.cond_endpoint + firstResult.Key + '?apikey=' + config.wApiKey + config.wLang + config.wDetails;
    const rawCond = await fetch(condApi, requestOptions);
    const objCond = await rawCond.json();
    const jsonCond = objCond[0];
    const condNum = jsonCond.WeatherIcon;
    //assign condition into category
    let query = "";
    //sunny
    if (condNum >= 4 || (condNum >= 30 && condNum <= 34)) {
      query = user.clearPref;
    } else if ( (condNum > 4 && condNum < 12) || (condNum > 34 && condNum < 39) ) { //cloudy
      query = user.cloudyPref;
    } else if ( (condNum > 11 && condNum < 19) || (condNum > 38 && condNum < 43) ) { //rain
      query = user.rainPref;
    } else {  //snow
      query = user.snowPref;
    }

    await spotifyApi.setAccessToken(user.currentAccToken);
    const playlists = await spotifyApi.searchPlaylists(query, {limit:1, offset:0});
    const playJson = await playlists.body.playlists.items[0];
    await spotifyApi.followPlaylist(playJson.id);
    //API Call
    /*
    request(locApi1 + req.body.City + locApi2, requestOptions, function(error, response, body)  {
      const jsonLoc = JSON.parse(body);   //converts body object into JSON; easier to work with
      const firstResult = jsonLoc[0];    //grabs top result from city search

      //Sets up API endpoint for the conditions API using the first result of the city search response
      const condApi = config.cond_endpoint + firstResult.Key + '?apikey=' + config.wApiKey + config.wLang + config.wDetails
      request(condApi, requestOptions, function(error, response, body)  {
        const jsonCond = JSON.parse(body)[0]; */


    res.status(200).json(playlists);
  } catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;
