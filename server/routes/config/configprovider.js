let
_ = require("lodash"),
Promise = require("bluebird"),
jpf = require("json-property-filter"),
jsondiffpatch = require("jsondiffpatch").create(),
db = null,
{CONFIG_KEY, DEFAULT_READ_FILTER, DEFAULT_WRITE_FILTER} = require("../../utility/constants"),
testConfig = {
  "firstName": "John",
  "lastName": "Smith",
  "age": 25,
  "address": {
    "streetAddress": "21 2nd Street",
    "city": "New York",
    "state": "NY",
    "postalCode": "10021"
  },
  "phoneNumber":[
    {
      "type": "home",
      "number": "212 555-1234"
    },
    {
      "type": "fax",
      "number": "646 555-4567"
    }
  ],
  "gender": {
    "type": "male"
  }
},
config = null,
loadCoreConfig = ()=>{
  return db.collection(CONFIG_KEY)
  .findOne({"_id": "config"})
  .then(doc => {
    console.info("Config loaded.");
    delete doc["_id"];
    //config = doc;
    // TODO: remove testconfig
    config = testConfig;
    return config;
  });
},
saveCoreConfig = (coreConfig)=>{
  coreConfig["_id"] = "config";
  db.collection(CONFIG_KEY)
  .save(coreConfig)
  .then(()=>console.info(`Config updated.`))
  .catch(console.error);
  delete coreConfig["_id"];
  config = coreConfig;
  return config;
},
applyFilter = (json, filterPatterns) => {
  const filter = new jpf.JsonPropertyFilter(filterPatterns);
  return filter.apply(json);
},
getConfig = ({read = DEFAULT_READ_FILTER})=>{
  return applyFilter(config, read);
},
saveConfig = ({read = DEFAULT_READ_FILTER, write = DEFAULT_WRITE_FILTER}, configChanges) =>{
  // For saving the changes, the formula is -
  // newConfig = (baseConfig - filteredConfig) + filteredNewChanges
  // where 
  //  baseConfig is the current stored config.
  //  filteredConfig is the result of applying write filter to the baseConfig
  //  filteredNewChanges are the config changes submitted by the user with write filter applied.
  let
  baseConfig = Object.assign({}, config), 
  filteredConfig = applyFilter(config, write),
  filteredNewChanges = applyFilter(configChanges, write),
  delta = jsondiffpatch.diff(baseConfig, filteredConfig),
  revDelta = jsondiffpatch.reverse(delta),
  inverseBaseConfig = jsondiffpatch.patch({}, revDelta),
  newConfig = Object.assign({}, inverseBaseConfig, filteredNewChanges);
  saveCoreConfig(newConfig);

  return getConfig({read});
},
init = (dbInstance)=> {
  if (!_.isEmpty(config)){
    return Promise.resolve(api);
  }

  db = dbInstance;

  return loadCoreConfig()
  .then(()=>Promise.resolve(api));
};

const api = {
  getConfig,
  saveConfig
};

module.exports = {
  init,
  api
};