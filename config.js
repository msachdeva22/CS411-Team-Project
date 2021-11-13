const config = {
    loc_endpoint: 'http://dataservice.accuweather.com/locations/v1/cities/search?apikey=',
    apiKey: 'YOUR API KEY HERE',
    lang: '&language=en-us',
    details: '&details=false',
    offset: '&offset=1',
    cond_endpoint: 'http://dataservice.accuweather.com/currentconditions/v1/'
}

module.exports= config;