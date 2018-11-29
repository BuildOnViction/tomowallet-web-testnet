# TOMOWALLET

## Requirements
    - NodeJS
    - MongoDB
    - Redis

## Config
```
cp config/default.json config/local.json
```
- Update `local.json` file to support your environment
  - Update mnemonic
  - Update mongodb configuration:
      - For docker:
      `  "db": {
      "uri": "mongodb://mongodb:27017/wallets"
      },
    `
      - For localhost: 
      `
      "db": {
      "uri": "mongodb://localhost:27017/wallets"
    },
   

## Install
```
npm install
```

## Run
    - Start mongodb
    - Start Redis
    - ```
        npm run build && npm run dev
        ```
