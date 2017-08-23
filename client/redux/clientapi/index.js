import axios from 'axios';
import _ from 'lodash';

const _tokensApi = axios.create({
  baseURL : "/api/tokens/",
  timeout : 1000
}),
_configApi = axios.create({
  baseURL : "/api/config/",
  timeout : 1000
}),
useAuth = (key, config = {})=>Object.assign({}, config, {headers : {'x-auth-token' : key}}),
extractData = result => result.data;
_tokensApi.defaults.headers.post['Content-Type'] = 'application/json';
_configApi.defaults.headers.post['Content-Type'] = 'application/json';

export const tokensApi = {
  getAllTokens : (key)=>_tokensApi.get('/', useAuth(key)).then(extractData).then(tokens=>_.map(tokens, _.identity)),
  createNewToken : (key)=>_tokensApi.post('/', {}, useAuth(key)).then(extractData),
  updateToken : (key, token, read, write)=>_tokensApi.put(`/${token}`, {read, write}, useAuth(key)).then(extractData),
  deleteToken : (key, token)=>_tokensApi.delete(`/${token}`, useAuth(key)).then(extractData)
};

export const configApi = {
  loadConfig : (key) => _configApi.get('/', useAuth(key)).then(extractData),
  saveConfig : (key, config) => _configApi.put('/', config, useAuth(key)).then(extractData)
};