import axios from 'axios';
import _ from 'lodash';

const
apiRoot = '/api',
defaultTimeout = 3000,
createApi = path => axios.create({
  baseURL : `${apiRoot}/${path}/`,
  timeout : defaultTimeout
}),
withDefaults = api => {
  api.defaults.headers.post['Content-Type'] = 'application/json';
  return api;
},
_tokensApi = withDefaults(createApi("tokens")),
_configApi = withDefaults(createApi("config")),
_dataApi = withDefaults(createApi("data")),
useAuth = (key, config = {})=>Object.assign({}, config, {headers : {'x-auth-token' : key}}),
extractData = result => result.data;

export const tokensApi = {
  getAllTokens : (key)=>_tokensApi.get('/', useAuth(key)).then(extractData).then(tokens=>_.map(tokens, _.identity)),
  createNewToken : (key)=>_tokensApi.post('/', {}, useAuth(key)).then(extractData),
  updateToken : (key, token, read, write, name)=>_tokensApi.put(`/${token}`, {read, write, name}, useAuth(key)).then(extractData),
  deleteToken : (key, token)=>_tokensApi.delete(`/${token}`, useAuth(key)).then(extractData)
};

export const configApi = {
  loadConfig : (key) => _configApi.get('/', useAuth(key)).then(extractData),
  saveConfig : (key, config) => _configApi.put('/', config, useAuth(key)).then(extractData)
};

export const dataApi = {
  snapshot : (key) => _dataApi.get('/snapshot', useAuth(key)).then(extractData),
  restore : (key, snapshot) => _dataApi.post('/restore', snapshot, useAuth(key)).then(extractData)
};