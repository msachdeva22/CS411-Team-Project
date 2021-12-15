const config = {
    //weather stuff
    loc_endpoint: 'http://dataservice.accuweather.com/locations/v1/cities/search?apikey=',
    wApiKey: 'I1QL7PJJC8kGieG3vnpKoBCA5vDTqGp4',
    wLang: '&language=en-us',
    wDetails: '&details=false',
    wOffset: '&offset=1',
    cond_endpoint: 'http://dataservice.accuweather.com/currentconditions/v1/',

    //spotify stuff
    sClient_Id: '613c8674473741c5ae816df1bde7468d',
    sClient_Secret: '273f3de6778144d78da7c6b28164e877',
    sRedirect_URI: 'http://localhost:3000/auth/callback',

    //db stuff
    mongoURL: 'mongodb+srv://Kyle:dbpass@cluster0.aqclp.mongodb.net/webApp?retryWrites=true&w=majority'
}

module.exports= config;