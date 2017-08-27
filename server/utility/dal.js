let 
client = require("mongodb").MongoClient,
redact = require("redact-url"),
DB_URL = process.env["DB_URL"],
db = null,

/*
db = {
  collection : () => ({
      "find" : () => ({
        toArray: ()=>(Promise.resolve([])) 
      }),
      "findOne": ()=>(Promise.resolve({})),
      "save" : ()=>(Promise.resolve({})),
      "deleteOne" : ()=>(Promise.resolve({})),
      "remove" : ()=>(Promise.resolve({})),
      "initializeOrderedBulkOp" : ()=> ({
        "insert": ()=>{},
        "execute" : ()=>(Promise.resolve({}))
      })
  })
},
*/
init = ()=>{
  if (db){
    return Promise.resolve(db);
  }
  if (!DB_URL){
    return Promise.reject("DB_URL is absent.");
  }

  console.info(`DB_URL is ${redact(DB_URL)}`);

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