const express = require("express");
const session = require("express-session");
const redis = require("redis");
const redisStore = require("connect-redis")(session);
const nconf = require("nconf");
const bodyParser = require("body-parser");
const chalk = require("chalk");
const path = require("path");
const app = express();

// load config file
nconf
  .argv()
  .env()
  .file({
    file: __dirname + "/config.json",
  });

// connect to redis session store
const redisSessionStore = redis.createClient(
  nconf.get("redisPort"),
  nconf.get("redisHost"),
  {
    db: 0,
  }
);

redisSessionStore.on("connect", () => {
  console.log(
    `${chalk.green("✓")} Connected to ${chalk.green("Redis")} Session Store`
  );
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// session store
app.use(
  session({
    secret: nconf.get("sessionSecret"),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: new redisStore({ client: redisSessionStore }),
    resave: false,
    saveUninitialized: false,
  })
);

// set static path
app.set("views", path.join(__dirname, "/views"));
app.engine("html", require("ejs").renderFile);

// routes
app.use("/", require("./routes/static"));
app.use("/users", require("./routes/users"));

// start the app
app.listen(nconf.get("port") || 3000);
console.log("App Started...");
