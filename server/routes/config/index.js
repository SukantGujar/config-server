let express = require("express"),
router = express.Router(),
{api: configApi} = require("./configprovider");

router.get("/", function(req, res){
  console.info(`User ${req.Token._id} initiated config read.`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(configApi.getConfig(req.Token)));
});

router.put("/", function(req, res){
  let {body : configChanges} = req;
  if (!configChanges){
    return res.status(400).end();
  }

  console.info(`User ${req.Token._id} initiated config update.`);
  let result = configApi.saveConfig(req.Token, configChanges);

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(result));
});

module.exports = router;