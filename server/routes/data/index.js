let express = require("express"),
router = express.Router(),
api = require("./dataprovider");

router.post("/restore", function({body, Token}, res){
  res.setHeader('Content-Type', 'application/json');
  res.send(api.restore(Token, body));
});

router.get("/snapshot", function({Token}, res){
  res.setHeader('Content-Type', 'application/json');
  res.send(api.snapshot(Token));
});

module.exports = router;