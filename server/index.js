let express = require("express"),
bodyParser = require("body-parser"),
args = require("minimist")(process.argv.slice(2)),
gracefulExit = require('express-graceful-exit'),
path = require("path"),
compression = require("compression"),
app = express(),
{BIND_ADDRESS_KEY, BIND_PORT_KEY, DEFAULT_BIND_ADDRESS, DEFAULT_BIND_PORT} = require("./utility/constants"),
host = args[BIND_ADDRESS_KEY] || process.env[BIND_ADDRESS_KEY] || DEFAULT_BIND_ADDRESS,
port = args[BIND_PORT_KEY] || process.env[BIND_PORT_KEY] || DEFAULT_BIND_PORT,
{init:dbInit} = require("./utility/dal"),
{init:tokenInit} = require("./routes/tokens/tokenprovider"),
{init:configInit} = require("./routes/config/configprovider"),
{tokens, config} = require("./routes"),
{admin, authorized} = require("./validatetoken");

dbInit().then((db)=>Promise.all([tokenInit(db), configInit(db)])).then(
  ()=>{
    app.use(gracefulExit.middleware(app));

    app.use(compression());

    app.use("/ui/", express.static(path.resolve(__dirname + "/../ui/")));
    app.use("/ui/*", express.static(path.resolve(__dirname + "/../ui/index.html")));
    
    app.use(bodyParser.json());
    
    app.use("/api/tokens", admin, tokens);
    
    app.use("/api/config", authorized, config);
    
    let server = app.listen(port, host);
    
    process.on('SIGINT', function(message) {
      console.info(`\nShutting down...`);
      gracefulExit.gracefulExitHandler(app, server);
    });
    
    console.info(`Server listening on ${host}:${port}`);
  }
);