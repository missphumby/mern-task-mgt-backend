// require necessary NPM packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
// require route files
const taskRoutes = require("./app/routes/task_routes");
const userRoutes = require("./app/routes/user_routes");

// require middleware
const errorHandler = require("./lib/error_handler");
const replaceToken = require("./lib/replace_token");
const requestLogger = require("./lib/request_logger");

// require database configuration logic
// `db` will be the actual Mongo URI as a string
const db = require("./config/db");

// require configured passport authentication middleware
const auth = require("./lib/auth");

// define server and client ports
// used for cors and local port declaration
const serverDevPort = 8000;
const clientDevPort = 3000;

// establish database connection
// use new version of URL parser
// use createIndex instead of deprecated ensureIndex
mongoose.connect(db, {
  useNewUrlParser: true,
});

// instantiate express application object
const app = express();
//solving cors issue
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   // res.header("Access-Control-Allow-Credentials: true")
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   // res.header("Access-Control-Max-Age", "1000")
//   if (req.method == "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//     return res.status(200).json({});
//   }
//   next();
// });

// set CORS headers on response from this API using the `cors` NPM package
// `CLIENT_ORIGIN` is an environment variable that will be set on Heroku
app.use(
  cors({
    origin: "*",
  })
);

// define port for API to run on
// adding PORT= to your env file will be necessary for deployment
const port = process.env.PORT || serverDevPort;
app.use(passport.initialize());
// this middleware makes it so the client can use the Rails convention
// of `Authorization: Token token=<token>` OR the Express convention of
// `Authorization: Bearer <token>`
// app.use(replaceToken);

// register passport authentication middleware
// app.use(auth);

// add `express.json` middleware which will parse JSON requests into
// JS objects before they reach the route files.
// The method `.use` sets up middleware for the Express application
app.use(express.json({ limit: "50mb" }));
// this parses requests sent by `$.ajax`, which use a different content type
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

// log each request as it comes in for debugging
app.use(requestLogger);

// register route files
app.use(taskRoutes);
app.use(userRoutes);

// register error handling middleware
// note that this comes after the route middlewares, because it needs to be
// passed any error messages from them
app.use(errorHandler);

// run API on designated port (4741 in this case)
app.listen(port, () => {
  console.log("Now listening on port " + port);
});

// needed for testing
module.exports = app;
