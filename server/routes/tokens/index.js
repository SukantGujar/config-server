let express = require("express"),
router = express.Router(),
{api:tokensApi} = require("./tokenprovider"),
{
  DEFAULT_READ_FILTER,
  DEFAULT_WRITE_FILTER
} = require("../../utility/constants");

router.get("/", function(req, res){
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(tokensApi.getTokens()));
});

router.delete("/:id", function({params : {id}}, res){
  if (!id){
    return res.status(400).end();
  }

  let deletedToken = tokensApi.deleteToken(id);
  deletedToken ? res.send("ok") : res.status(404).end();
});

router.post("/", function({body : {read = DEFAULT_READ_FILTER, write = DEFAULT_WRITE_FILTER}}, res){
  let token = tokensApi.createNewToken(read, write);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(token));
});

router.put("/:id", function({body : {read = DEFAULT_READ_FILTER, write = DEFAULT_WRITE_FILTER}, params: {id}}, res){
  if (!id){
    return res.status(400).end();
  }

  let token = tokensApi.makeTokenInstance(id, read, write);

  token = tokensApi.saveToken(token, true);
  if (!token){
    return res.status(404).end();
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(token));
});

module.exports = router;