let
_ = require("lodash"),
crypto = require("crypto"),
Promise = require("bluebird"),
args = require("minimist")(process.argv.slice(2)),
db = null,
{
  TOKENS_KEY, 
  MASTER_TOKEN_NAME,
  MASTER_TOKEN_KEY, 
  MASTER_READ_FILTER, 
  MASTER_WRITE_FILTER,
  DEFAULT_READ_FILTER,
  DEFAULT_WRITE_FILTER
} = require("../../utility/constants"),
MASTER_TOKEN = args[MASTER_TOKEN_KEY] || process.env[MASTER_TOKEN_KEY],
getTokens = ()=>{
  return tokens;
}
tokens = {},
makeTokenInstance = (id, read, write, name) => ({"_id": id, read, write, name}),
getMasterToken = ()=>makeTokenInstance(MASTER_TOKEN, MASTER_READ_FILTER, MASTER_WRITE_FILTER, MASTER_TOKEN_NAME),
loadTokens = ()=>{
  return db.collection(TOKENS_KEY)
  .find()
  .toArray()
  .then(docs => {
    return docs.reduce((tokens, token)=>{
    tokens[token._id] = token;
    return tokens;
  }, {})});
},
saveToken = (token, update = false)=>{
  if (update && !tokens[token._id]){
    return null;
  }
  let oldToken = tokens[token._id];
  if (update){
    token.read = token.read || oldToken.read;
    token.write = token.write || oldToken.write;
    token.name = token.name || oldToken.name;
  }
  db.collection(TOKENS_KEY)
  .save(token)
  .then(()=>console.info(`Token ${token._id} ${update?"updated" : "created"}.`))
  .catch(console.error);
  tokens[token._id] = token;
  return token;
},
deleteToken = (tokenKey)=>{
  let token = tokens[tokenKey];
  if (!token){
    return;
  }
  db.collection(TOKENS_KEY)
  .deleteOne({"_id" : tokenKey})
  .then(()=>console.info(`Token ${tokenKey} deleted.`))
  .catch(console.error);
  delete tokens[tokenKey];
  return tokenKey;
},
createNewToken = (read = DEFAULT_READ_FILTER, write = DEFAULT_WRITE_FILTER,  name = "")=>{
  const tokenId = crypto.randomBytes(16).toString("hex"),
  token = makeTokenInstance(tokenId, read, write, name);
  return saveToken(token);
},
validatePermission = (permission)=>_.isArray(permission) && permission.every(_.isString),
parseToken = (rawToken, key)=>{
  let {_id, read, write} = rawToken;
  if (_.isString(_id) && _id === key && validatePermission(read) && validatePermission(write)){
    return {_id, read, write};
  };

  let logToken = rawToken;

  try {
    logToken = JSON.stringify(rawToken);
  }
  catch(e){}

  console.error(`Error parsing raw token: ${logToken}`);

  return false;
},
importTokens = (rawTokens)=>{
  let tokensCount = _.size(rawTokens);
  if (tokensCount < 1){
    console.log("No tokens to import.");
    return false;
  }
  
  const parsedTokens = _.reduce(rawTokens, (results, token, key)=>{
    token = parseToken(token, key);
    if (token){
      results[key] = token;
    }

    return results;
  }, {});

  db.collection(TOKENS_KEY)
  .remove({})
  .then(()=>{
    let bulk = db.collection(TOKENS_KEY).initializeOrderedBulkOp();
    _.forEach(parsedTokens, token => {
      console.info(`Imported token ${JSON.stringify(token)}.`);
      bulk.insert(token);
    })
    return bulk.execute();
  })
  .then(()=>console.log(`${_.size(parsedTokens)} tokens imported.`))
  .catch(console.error);

  tokens = Object.assign({}, parsedTokens);

  return tokens;
},
init = (dbInstance)=> {
  if (!_.isEmpty(tokens)){
    return Promise.resolve(api);
  }

  db = dbInstance;

  return loadTokens()
  .then(values => {
    console.info(`Loaded ${_.size(values)} tokens from db.`);
    tokens = Object.assign({}, values);
  });
};
const api = {
  createNewToken,
  deleteToken,
  getMasterToken,
  getTokens,
  importTokens,  
  makeTokenInstance,
  saveToken
};

if (!MASTER_TOKEN){
  console.error(`MASTER_TOKEN is not configured. You can specify it as a command argument or env param named MASTER_TOKEN.`);
  console.error(`E.g. node server/index.js --MASTER_TOKEN=examplemastertoken`);
  console.error(`Or   npm start -- --MASTER_TOKEN=examplemastertoken`);
  
  process.exit(1);
}

console.info(`MASTER Token is: ${MASTER_TOKEN}`);

module.exports = {
  init,
  api
};