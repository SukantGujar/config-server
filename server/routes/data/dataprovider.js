const 
{api:configApi} = require('../config/configprovider'),
{api:tokensApi} = require('../tokens/tokenprovider');

module.exports = {
  "restore" : (auth, {config = null, tokens = null})=>{
    let importedConfig = null, importedTokens = null;
    if (config){
      importedConfig = configApi.saveConfig(auth, config);
    }

    if (tokens){
      importedTokens = tokensApi.importTokens(tokens);
    }

    return {
      config : importedConfig,
      tokens : importedTokens
    }
  },

  "snapshot" : (auth) => {
    let config = configApi.getConfig(auth),
    tokens = tokensApi.getTokens();

    return {
      config,
      tokens,
      "snapshot" : (new Date()).toUTCString()
    }
  }
}