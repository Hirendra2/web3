const { MongoClient } = require("mongodb");
//const url = 'mongodb+srv://doadmin:03Dnt72Oma58k4g1@db-mongodb-blr1-32777-da76306c.mongo.ondigitalocean.com/admin?replicaSet=db-mongodb-blr1-32777&tls=true&authSource=admin';
const url ='mongodb://localhost:27017';

var _db;
module.exports = {
   connectToServer: function (callback) {
      MongoClient.connect(url, {
         useUnifiedTopology: true,
         useNewUrlParser: true,
         connectTimeoutMS: 90000
      }, function (err, client) {
         if (err) {
            setTimeout(handleDisconnect, 1000)
            console.log(err)
         }
         try {
            _db = client.db('putin');
         }
         catch (ex) {
            setTimeout(handleDisconnect, 1000)
         }

         return callback(err);
      });
   },
   getDb: function () {
      return _db;
   }
};


function handleDisconnect() {

   MongoClient.connect(url, {
      useUnifiedTopology: true,
         useNewUrlParser: true,
         connectTimeoutMS: 90000
   }, function (err, client) {
      if (err) {
         setTimeout(handleDisconnect, 1000)
         console.log(err)
      }
      try {
         _db = client.db('putin');
      }
      catch (ex) {
         setTimeout(handleDisconnect, 1000)
      }
   });
}