let getToken = function(headers = {}){
  return headers["x-auth-token"];
},

authError = function(res, token = null){
  res.statusCode = 401;
  res.end(token ? "Unauthorized" : "Missing x-auth-token");

  return false;
},

{api: tokensApi} = require("./routes/tokens/tokenprovider"),

isMasterToken = (tokenKey) => {
  const masterToken = tokensApi.getMasterToken();
  return (masterToken._id == tokenKey) ? masterToken : null;
},

isValidToken = (tokenKey) => isMasterToken(tokenKey) || tokensApi.getTokens()[tokenKey],

validator = (validator) => (req, res, next) =>{
  let tokenKey = getToken(req.headers);
  if (!tokenKey){
    return authError(res);
  }

  let token = validator(tokenKey);
  if (!token){
    return authError(res, tokenKey);
  }

  req.Token = token;
  return next();
};

module.exports = {
  "admin" : validator(isMasterToken),
  "authorized" : validator(isValidToken)
};