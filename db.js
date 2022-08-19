const { MongoClient } = require('mongodb')

let dbConnetion

module.exports = {
        connectToDb: (cb) => {
                MongoClient.connect("mongodb://localhost:27017/company")
                .then(client => {
                        dbConnetion = client.db()
                        return cb();
                })
                .catch(err => {
                        console.log(err);
                        return cb(err);
                })
        },
        getDb: () => dbConnetion
}