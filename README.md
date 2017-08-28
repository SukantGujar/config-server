# Config Server
A simple json configuration manager, intended to be used as a shared configuration server in a multi-app environment.

## Installation

### With yarn
`yarn install`

### With npm
`npm install`

## Build client ui
`npm run buld-prod`

## Run Server
### Quick start
#### Linux
```
export DB_URL=mongodb://user:pass@yourserver && \
npm start -- --MASTER_TOKEN=replacemewithyourtoken
```
#### Windows
```
set DB_URL=mongodb://user:pass@yourserver
npm start -- --MASTER_TOKEN=replacemewithyourtoken
```
#### Options
##### Required
1. MASTER_TOKEN: This key is used by config server to allow admin access. You can login with this key in the dashboard and then create other access keys, seed the global configuration data, take snapshots and restore them etc. Keep this key safe. At the moment, the stored data is *not* encrypted with this key, so you can switch it anytime with a new one if you lose it. 

2. DB_URL: MongoDB URL in [connection-string](https://docs.mongodb.com/manual/reference/connection-string/) format, which is used by config-server to read/write store data (config and keys). Sufficient read/write privileges should be provisioned for the credentials you use here.
##### Optional
1. BIND_ADDRESS: Express server bind address, default is __0.0.0.0__
2. BIND_PORT: Express server bind port, defailt is __3000__

### With Docker
#### Build image
`docker build .`
#### Run server
```
docker run -p 3000:3000 -e MASTER_TOKEN=replacemewithyourtoken  -e DB_URL=mongodb://user:pass@yourserver <dockerimagename>
```
## Access Dashboard

### Local server
  Browse [http://localhost:3000/ui/](http://localhost:3000/ui/).

### Docker container
#### Linux
  Browse [http://localhost:3000/ui/](http://localhost:3000/ui/).
#### Windows
1. Find the ip for your docker machine running the container using `docker-machine ip <machine name or nothing if using default>`.
2. Browse [http://<your.docker.machine.ip>:3000/ui](http://<your.docker.machine.ip>:3000/ui).

## First-time setup

Config-server dashboard lets you setup keys and configuration data. When you hit the ui endpoint, you are prompted to enter a key -

![Login screen](./docs/1.png)

Type in your master-token and hit `Enter` or click Apply to login with admin access. In this mode, you can add more keys and define the configuration data.

### Config tab

All the configuration data is stored as a single JSON blob in your mongodb. You can edit this data with master token or a key with the right privileges.

![Config tab for admin](./docs/2.png)

### Keys tab

You can add keys and configure their config data read/write privileges here.

![Keys tab for admin](./docs/3.png)

#### Adding a new key
Click on `Add a new key` to add a fresh key. By default a new key doesn't have read or write privileges to the store data. You must explicitly provide it. 

![Add a new key](./docs/4.png)

#### Configuring key privileges
config-server uses [json-property-filter](https://www.npmjs.com/package/json-property-filter) syntax to restrict read and write operations. You can read detailed documentation [here](https://github.com/cyrilschumacher/json-property-filter/blob/master/README.md). A good list of examples can be found [here](https://runkit.com/cyrilschumacher/json-property-filter).

##### Read/Write filters are not cascaded
In config-server, read and write are separate privileges (i.e. the filter pattern used for, say read, is not automatically included in write privileges).

##### Example
Let's say our example application has three tiers - ui, api and db and it is oauth driven. Our example config json looks like this -
```
{
  "mongo": {
    "connectionStringTemplate": "mongodb://{username}:{password}@{dbhost}",
    "host": "mongoserver"
  },
  "auth": {
    "type": "oauth",
    "flow": "code",
    "clientid": "appclientid",
    "clientsecret": "appclientsecret"
  },
  "ui": {
    "apipath": "/api/",
    "i18n": {
      "default": "en-US",
      "fallback": "en-US"
    },
    "showBetaFeatures": true,
    "betaFeatures": [
      "adminUI",
      "invoice"
    ]
  },
  "api": {
    "basepath": "/api",
    "db": {
      "username": "apiuser",
      "password": "dummy"
    }
  }
}
```
Once you have saved the collated configuration json in Config tab, you now need to create two keys -
1. UI: needs to have read access to `ui` and `auth` node. Should NOT have access to `auth.clientsecret`.
Add a new key and configure its privileges as:
```
read: ["ui", "auth", "-auth.clientsecret"]
write: ["-**"]
``` 
2. API: needs to have read access to `mongo`, `auth`, `api`.

   Add a new key and configure its privileges as:
```
read: ["mongo", "auth", "api"]
write: ["-**"]
``` 
Your keys should like like this now -

![Example keys](./docs/5.png)

Click on the copy icon to copy the UI key into clipboard -
![Copy icon](./docs/6.png)

You can now click on the `Change` button in the app bar to try out the UI key -
![UI Key test-drive](./docs/7.png)

The Config tab will now display data filtered as-per the configured read privileges -

![UI Config](./docs/8.png)

Now change the key to the API key and verify the config data -

![API Config](./docs/9.png)

> As we have not configured `write` privileges to any key so far, any changes made to the config data in the Config tab with either of these keys won't persist.

Let's give write access to the API key on `api` node. Switch to master token and configure the below privileges for API key -

```
read: ["mongo", "auth", "api"] <-Unchanged!
write: ["api"] <- "api" added, "-**" removed.
```

![API write privilege](./docs/10.png)

Now switch the key to API and try making some changes in the config json's `api` property and save them. They will persist.

![API data changes](./docs/11.png)

#### Data snapshot/restore
The Data tab allows you to take a snapshot of all the config-server data, including the config and keys. This shapshot is then downloaded in your device as a JSON file.

![Snapshot](./docs/12.png)

You can restore config data to an earlier snapshot. This is a quick way to migrate configurations to a new config-server. To do this, drag and drop your snapshot JSON file  onto the editor provided in `Restore` section. Review it in the editor and then click `Restore` button to deploy it.
> A restore completely replaces existing data and should ideally be done only *after* taking snapshot on existing servers.

### Access config data from your application
config-server exposes the config data over REST endpoints. To read/write config data from your applications, you can make these requests -

#### Read config data -
```
curl -X OPTIONS \
  http://configserver:3000/api/config/ \
  -H 'x-auth-token: <key>'
```

#### Write config data -
```
curl -X PUT \
  http://configserver:3000/api/config/ \
  -H 'content-type: application/json' \
  -H 'x-auth-token: <key>' \
  -d '{
    "the" : {
    	"complete": {
        "config" : "for this key"
      }
    }
}'
```
> Always send the complete config data of the key, per its write privileges, as `save` is not a delta operation. The data you send here replaces all write-enabled values sent previously.

### config-server-client
For nodejs/browsers you can use the [config-server-client](https://github.com/SukantGujar/config-server-client) library to read/write config data from your applications. 