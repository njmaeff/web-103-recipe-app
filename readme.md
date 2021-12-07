# Web 104 - Recipe App

See the app in action [https://web-104-recipe-app.vercel.app/](https://web-104-recipe-app.vercel.app/).

## About
The requirements for this project were to develop a static website using firebase and bootstrap. I used React to manage some complexity by adding ingredients instead of vanilla javascript. I included React and firebase in the javascript bundle using [rollup.js](https://rollupjs.org/guide/en/) and es module imports. I bundled the app this way to make the final code more readable. The [rollup.config.js](rollup.config.js) file replaces the node module imports with files located in the [shims](shims) directory.

Static HTML is generated using webpack and a custom plugin I made [https://github.com/njmaeff/webpack-static-site](https://github.com/njmaeff/webpack-static-site)

## Install

```bash
yarn install
```

## Environment

The `.env` file contains information for a local dev environment using the firebase emulator suite
The `.env.production` file contains the data for building the production app.

Start the firebase emulator. Requires docker/docker-compose.

```bash
docker-compose up -d firebase
```

Seed the development database

```bash
yarn seed
```

## Build

### Development
```bash
yarn build
```

### Production

```bash
NODE_ENV=production yarn build
```

## Run

```bash
yarn serve
```
