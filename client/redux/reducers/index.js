import {combineReducers} from 'redux';
import copy from 'copy-to-clipboard';

const keys = (state = [], action) => {
  switch(action.type) {
    case "SET_KEYS" : {
      return [...action.keys];
    }
    case "ADD_KEY" : {
      return [...state, action.key];
    }
    case "UPDATE_KEY" : {
      return state.map(item => {
        if (item._id == action.key){
          return ({
            _id : item._id,
            read : action.read,
            write : action.write
          })
        }

        return item;
      } )
    }
    case "DELETE_KEY" : {
      return state.filter(item => item._id != action.key)
    }
    case "COPY_KEY" : {
      copy(action.key);
      return state;
    }
    default : return state;
  }
},
currentKey = (state = null, action)=>{
  switch(action.type){
    case "SET_KEY" : {
      return action.key;
    }
    default : return state;
  }
},
currentKeyIsMaster = (state = false, action)=>{
  switch(action.type){
    case "SET_KEY_IS_MASTER" : {
      return action.isMaster;
    }
    default : return state;
  }
},
config = (state = {}, action)=>{
  switch(action.type){
    case "SET_CONFIG" : {
      return Object.assign({}, action.config);
    }
    default : return state;
  }
};

export default combineReducers({
  keys,
  currentKey,
  currentKeyIsMaster,
  config
});