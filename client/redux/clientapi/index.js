import axios from 'axios';
import _ from 'lodash';

const tokensApi = axios.create({
  baseURL : "/api/tokens/",
  timeout : 1000
}),
configApi = axios.create({
  baseURL : "/api/config/",
  timeout : 1000
}),
useAuth = (key, config = {})=>Object.assign({}, config, {headers : {'x-auth-token' : key}}),
extractData = result => result.data;
tokensApi.defaults.headers.post['Content-Type'] = 'application/json';
configApi.defaults.headers.post['Content-Type'] = 'application/json';

module.exports = {
  "tokensApi" : {
    getAllTokens : (key)=>tokensApi.get('/', useAuth(key)).then(extractData).then(tokens=>_.map(tokens, _.identity)),
    createNewToken : (key)=>tokensApi.post('/', {}, useAuth(key)).then(extractData),
    updateToken : (key, token, read, write)=>tokensApi.put(`/${token}`, {read, write}, useAuth(key)).then(extractData),
    deleteToken : (key, token)=>tokensApi.delete(`/${token}`, useAuth(key)).then(extractData)
  },
  "configApi" : {
    loadConfig : (key) => configApi.get('/', useAuth(key)),
    saveConfig : (key, config) => configApi.put('/', config, useAuth(key)).then(extractData)
  }
};