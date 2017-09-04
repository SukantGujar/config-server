module.exports = {
  "namespace" : "configserver",
  "MASTER_TOKEN_KEY" : "MASTER_TOKEN",
  "TOKENS_KEY" : "configservertokens",
  "CONFIG_KEY" : "configserverconfig",
  "BIND_ADDRESS_KEY" : "BIND_ADDRESS",
  "BIND_PORT_KEY" : "BIND_PORT",
  "DEFAULT_BIND_ADDRESS" : "0.0.0.0",
  "DEFAULT_BIND_PORT": 3000,
  "DEFAULT_READ_FILTER" : ["-**"],
  "DEFAULT_WRITE_FILTER" : ["-**"],
  "MASTER_READ_FILTER" : ["**"],
  "MASTER_WRITE_FILTER" : ["**"]
}