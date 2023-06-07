const { MongoClient } = require("mongodb");
const url = "mongodb://admin:UV9ihOGii0QYRlK0@64.227.177.68:27017/";
// const urls =
//   "mongodb+srv://doadmin:03Dnt72Oma58k4g1@db-mongodb-blr1-32777-da76306c.mongo.ondigitalocean.com/admin?replicaSet=db-mongodb-blr1-32777&tls=true&authSource=admin";

const urls = "mongodb://localhost:27017";
var _db;

module.exports = {
  connectToServer: function (callback) {
    MongoClient.connect(
      url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      function (err, client) {
        if (err) {
          setTimeout(handleDisconnect, 1000);
          console.log(err);
        }
        try {
          _db = client.db("test"); //fufibusiness
        } catch (ex) {
          setTimeout(handleDisconnect, 1000);
        }

        return callback(err);
      }
    );
  },
  getDb: function () {
    return _db;
  },
};

function handleDisconnect() {
  MongoClient.connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (err, client) {
      if (err) {
        setTimeout(handleDisconnect, 1000);
        console.log(err);
      }
      try {
        _db = client.db("test"); //fufibusiness
      } catch (ex) {
        setTimeout(handleDisconnect, 1000);
      }
    }
  );
}
