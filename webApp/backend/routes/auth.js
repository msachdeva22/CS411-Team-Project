const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const cors = require('cors');
const async = require('async');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const config = require('../config');
const bcrypt = require('bcrypt');
const User= require("../models/User");
let SpotifyWebApi = require('spotify-web-api-node');

const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
];

let spotifyApi = new SpotifyWebApi({
    clientId: config.sClient_Id,
    clientSecret: config.sClient_Secret,
    redirectUri: config.sRedirect_URI
});

const router = express.Router();

let gUser = "";

router.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

router.get('/', function(req, res, next) {
    res.render('auth');
});

router.post('/register', async(req,res,next) => {
    try {
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            city: req.body.city
        });

        //save user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        !user && res.status(404).json("User not found");

        //check password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json("Incorrect Password");
        gUser = req.body.username;

        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
});

router.get('/spotify', async(req, res, next) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
   /* let state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    let scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        })); */
});

router.get('/send', async(req,res) => {
    const tok = spotifyApi.getAccessToken();
    const user2 = await User.findOneAndUpdate({username: gUser}, {
        $set:{"currentAccToken": tok},
    });
    res.send("Success! You may now close this window.")
})

router.get('/callback', async (req, res, next) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
    }
    async function get() {
        spotifyApi
            .authorizationCodeGrant(code)
            .then(data => {
                const access_token = data.body['access_token'];
                const refresh_token = data.body['refresh_token'];
                const expires_in = data.body['expires_in'];

                spotifyApi.setAccessToken(access_token);
                spotifyApi.setRefreshToken(refresh_token);

                console.log('access_token:', access_token);
                console.log('refresh_token:', refresh_token);

                console.log(
                    `Sucessfully retreived access token. Expires in ${expires_in} s.`
                );
                res.redirect('/auth/send');

                setInterval(async () => {
                    const data = await spotifyApi.refreshAccessToken();
                    const access_token = data.body['access_token'];

                    console.log('The access token has been refreshed!');
                    console.log('access_token:', access_token);
                    spotifyApi.setAccessToken(access_token);
                }, expires_in / 2 * 1000);
            })
            .catch(error => {
                console.error('Error getting Tokens:', error);
                res.send(`Error getting Tokens: ${error}`);
            });
    }
    await get();
    /*
    // your application requests refresh and access tokens
    // after checking the state parameter

    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {

                let access_token = body.access_token,
                    refresh_token = body.refresh_token;

                let options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function(error, response, body) {
                    console.log(body);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
    */
});



module.exports = router;
