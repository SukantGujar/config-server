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

## Dashboard Intro
TBD


