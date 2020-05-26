# Simple User Login and Signup System 

This is a simple and working user registration and authentication system built using Node, MongoDB and Redis. 

MongoDB acts as a primary data store and Redis is used as a external session store. 

## Requirements

You need to have following softwares installed in your system.

* Node (v11.15.0 or higher)
* MongoDB
* Redis

## How to run

Clone the repository and switch to it using the terminal.

Install the node dependencies.

```
npm install
```

Change the config.json file according to your system configuration.

```
{
  "mongodbURL": "mongodb://localhost:27017/userDemo",
  "redisHost": "localhost",
  "redisPort": 6379,
  "sessionSecret": "some-secret-hash",
  "port": 3000,
  "env": "development"
}
```

Then run the application using the following command.

```
node app.js
```

Navigate your browser to ```localhost:3000``` to view the app. 
