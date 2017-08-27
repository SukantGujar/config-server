import {tokensApi, configApi, dataApi} from '../clientapi';

import download from 'downloadjs';

import {addNotification as notify} from 'reapop';

const actions = {
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

  snapshotAsync:function(){
    let self = this;
    return async function(dispatch, getState) {
      let {currentKey} = getState(), snapshot = null;
      try {
        snapshot = await dataApi.snapshot(currentKey);
        snapshot = JSON.stringify(snapshot, null, 2);
      }
      catch(e){
        console.error(e);
        return;
      }

      const 
      date = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/[-:]/g, ''),
      fileName =  `${date}.json`;
      download(snapshot, fileName, 'application/json');
    }
  },

  restoreAsync: function(snapshot){
    let self = this;
    return async function(dispatch, getState) {
      let result = null, {currentKey} = getState();
      try {
        result = await dataApi.restore(currentKey, snapshot);
      }
      catch (e){
        dispatch(notify({message: `Sanpshot cannot be restored due to an error, check console.`, status: "error"}));      
        
        console.error(e);
        return null;
      }

      dispatch(self.setupSessionAsync(currentKey));
      dispatch(notify({message: `Snapshot restored.`, status: "success"}));      
    }
  },

  createKeyAsync: function() {
    let self = this;
    return async function(dispatch, getState) {
      let newKey = null, {currentKey} = getState();
      try {
        newKey = await tokensApi.createNewToken(currentKey);
      }
      catch (e){
        dispatch(notify({message: `Key cannot be created due to an error, check console.`, status: "error"}));      
        
        console.error(e);
        return null;
      }

      dispatch(self.addKey(newKey));
      dispatch(notify({message: `Key ${newKey._id} created.`, status: "success"}));      

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
        dispatch(notify({message: `Key ${key} cannot be updated due to an error, check console.`, status: "error"}));
      
        console.error(e)
        return;
      }

      dispatch(self.updateKey(key, updatedKey.read, updatedKey.write));
      dispatch(notify({message: `Key ${key} updated.`, status: "success"}));      
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
        dispatch(notify({message: `Key ${key} cannot be deleted due to an error, check console.`, status: "error"}));
      
        console.error(e);
        return;
      }

      dispatch(self.deleteKey(key));
      dispatch(notify({message: `Key ${key} deleted.`, status: "success"}));
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
        dispatch(notify({message: "Configuration cannot be updated due to an error, check console.", status: "error"}));
        console.error(e);
        return;
      }

      dispatch(self.setConfig(result));
      dispatch(notify({message: "Configuration updated.", status: "success"}));
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
        dispatch(notify({message: `Cannot login with key ${key}.`, status: "error"}));
        
        console.error(e);
        return false;
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

      return true;
    }
  }
};

export default actions;