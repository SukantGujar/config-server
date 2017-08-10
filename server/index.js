let express = require("express"),
bodyParser = require("body-parser"),
args = require("minimist")(process.argv.slice(2)),
app = express(),
host = args["BIND_ADDRESS"] || process.env["BIND_ADDRESS"] || "0.0.0.0",
port = args["BIND_ADDRESS"] || process.env["BIND_PORT"] || 3000,
{tokens} = require("./routes"),
{admin, authorized} = require("./validatetoken");

app.use(bodyParser.json());

app.use("/api/tokens", admin, tokens);

app.listen(port, host);

console.info(`Server listening on ${host}:${port}`);
