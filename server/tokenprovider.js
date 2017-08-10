let
_ = require("lodash"),
crypto = require("crypto"),
Promise = require("bluebird"),
args = require("minimist")(process.argv.slice(2)),
dal = require("./utility/dal"),
db = null,
TOKENS_KEY = `config-server-tokens`,
MASTER_TOKEN = args["MASTER_TOKEN"] || process.env["MASTER_TOKEN"] || "WQDFDQWESDFASDFASDFSADF",
getTokens = ()=>{
  return tokens;
}
tokens = {},
makeTokenInstance = (id, read, write) => ({"_id": id, read, write}),
getMasterToken = ()=>makeTokenInstance(MASTER_TOKEN, "**", "**"),
loadTokens = ()=>{
  db.collection(TOKENS_KEY).find().toArray()
  .then(docs => docs.reduce((token, tokens)=>{
    tokens[token.id] = token;
  }, {}));
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
  db.collection(TOKENS_KEY).save(token);
  tokens[token._id] = token;
  return token;
},
deleteToken = (tokenKey)=>{
  let token = tokens[tokenKey];
  if (!token){
    return;
  }
  db.collection(TOKENS_KEY).deleteOne({"_id" : tokenKey});
  delete tokens[tokenKey];
  return tokenKey;
},
createNewToken = (read = "", write = "")=>{
  const tokenId = crypto.randomBytes(16).toString("hex"),
  token = makeTokenInstance(tokenId, read, write);
  return saveToken(token);
},
methods = {
  createNewToken,
  deleteToken,
  getMasterToken,
  getTokens,
  makeTokenInstance,
  saveToken
},
init = ()=> {
  if (!_.isEmpty(tokens)){
    return Promise.resolve(methods);
  }

  return dal.init()
  .then(result => db = result)
  .then(loadTokens)
  .then(values => {
    tokens = Object.assign({}, values);
    return methods;
  });
};

module.exports = {
  init
};