let 
client = require("mongodb").MongoClient,
DB_URL = process.env["DB_URL"],
//TODO: Remove mongoclient mock
//db = null,

db = {
  collection : () => ({
      "find" : () => ({
        toArray: ()=>(Promise.resolve([])) 
      }),
      "findOne": ()=>(Promise.resolve({})),
      "save" : ()=>(Promise.resolve({})),
      "deleteOne" : ()=>(Promise.resolve({}))
  })
},

init = ()=>{
  if (db){
    return Promise.resolve(db);
  }
  if (!DB_URL){
    return Promise.reject("DB_URL is absent.");
  }

  return client.connect(DB_URL)
  .then(db => {
    console.info("Connected to db.");
    return db;
  })
  .catch(err => {
    console.error("Error connecting to db: ", err);
    console.error(`DB_URL: ${DB_URL}`);
    Promise.reject(err);
  });
};

module.exports = {
  init,
  getDb:()=>db
};