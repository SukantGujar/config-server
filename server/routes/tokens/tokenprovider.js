let
_ = require("lodash"),
crypto = require("crypto"),
Promise = require("bluebird"),
args = require("minimist")(process.argv.slice(2)),
db = null,
{
  TOKENS_KEY, 
  MASTER_TOKEN_KEY, 
  MASTER_READ_FILTER, 
  MASTER_WRITE_FILTER,
  DEFAULT_READ_FILTER,
  DEFAULT_WRITE_FILTER
} = require("../../utility/constants"),
MASTER_TOKEN = args[MASTER_TOKEN_KEY] || process.env[MASTER_TOKEN_KEY] || "abcd",
getTokens = ()=>{
  return tokens;
}
tokens = {},
makeTokenInstance = (id, read, write) => ({"_id": id, read, write}),
getMasterToken = ()=>makeTokenInstance(MASTER_TOKEN, MASTER_READ_FILTER, MASTER_WRITE_FILTER),
loadTokens = ()=>{
  return db.collection(TOKENS_KEY)
  .find()
  .toArray()
  .then(docs => {
    return docs.reduce((token, tokens)=>{
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
createNewToken = (read = DEFAULT_READ_FILTER, write = DEFAULT_WRITE_FILTER)=>{
  const tokenId = crypto.randomBytes(16).toString("hex"),
  token = makeTokenInstance(tokenId, read, write);
  return saveToken(token);
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
  makeTokenInstance,
  saveToken
};

console.info(`MASTER Token is: ${MASTER_TOKEN}`);

module.exports = {
  init,
  api
};