const mongoClient = require('mongodb').MongoClient;
const config = require('./config');

const mongoURL = config.mongoUrl;

let _db = null;

module.exports = {
    getDB: async dbName => {
        if (_db) {
            return _db;
        } else {
            let _client = await mongoClient.connect(mongoURL);
            _db = _client.db(dbName);
            return _db;
        }
    }
}