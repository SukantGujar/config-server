import {tokensApi, configApi} from '../clientapi';

module.exports = {
  saveConfig: function(config){
    return ({
    type: "SAVE_CONFIG",
    config
    })
  },

  setConfig: function (config){
    return ({
      type: "SET_CONFIG",
      config
    })
  },

  setKeys: function(keys){
    return({
      type : "SET_KEYS",
      keys
    })
  },

  addKey: function (key){
    return ({
      type: "ADD_KEY",
      key
    })
  },

  updateKey: function(key, read, write){
    return ({
      type: "UPDATE_KEY",
      key,
      read,
      write
    })
  },

  deleteKey : function(key){
    return ({
      type: "DELETE_KEY",
      key
    })
  },

  copyKey : function(key){
    return ({
      type : "COPY_KEY",
      key
    })
  },

  setKey : function(key){
    return ({
      type : "SET_KEY",
      key
    })
  },

  setKeyIsMaster : function(isMaster){
    return ({
      type : "SET_KEY_IS_MASTER",
      isMaster
    })
  },

  createKeyAsync: function() {
    let self = this;
    return async function(dispatch, getState) {
      let newKey = null, {currentKey} = getState();
      try {
        newKey = await tokensApi.createNewToken(currentKey);
      }
      catch (e){
        console.error(e);
        return null;
      }

      dispatch(self.addKey(newKey));

      return newKey._id;
    }
  },

  updateKeyAsync: function(key, read, write){
    let self = this;
    return async function(dispatch, getState){
      let updatedKey = null, {currentKey} = getState();
      try {
        updatedKey = await tokensApi.updateToken(currentKey, key, read, write);
      }
      catch (e){
        console.error(e)
        return;
      }

      dispatch(self.updateKey(key, updatedKey.read, updatedKey.write));
    }
  },

  deleteKeyAsync : function(key){ 
    let self = this;
    return async function (dispatch, getState){
      let deletedKey = null, {currentKey} = getState();

      try {
        deletedKey = await tokensApi.deleteToken(currentKey, key);
      }
      catch (e){
        console.error(e);
        return;
      }

      dispatch(self.deleteKey(key));
    }
  },

  saveConfigAsync : function(config){
    let self = this;
    return async function(dispatch, getState) {
      let result = null, {currentKey} = getState();

      try {
        result = await configApi.saveConfig(currentKey, config);
      }
      catch (e){
        console.error(e);
        return;
      }

      dispatch(self.setConfig(result));
    }
  },

  setupSessionAsync : function(key){
    let self = this;
    return async function(dispatch){
      let config = null;
      
      try {
        config = await configApi.loadConfig(key);
      }
      catch (e){
        console.error(e);
        return;
      }

      dispatch(self.setKey(key));
      dispatch(self.setConfig(config));
      
      let keys = [];

      try {
        keys = await tokensApi.getAllTokens(key);
        dispatch(self.setKeyIsMaster(true));      
      }
      catch (e){
        console.warn(e);
        dispatch(self.setKeyIsMaster(false));
      }

      dispatch(self.setKeys(keys));
    }
  }
};