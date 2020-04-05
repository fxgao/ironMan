let express = require("express");
let session = require("express-session");
let path = require("path");
var logger = require("morgan");
let cookieParser = require("cookie-parser");
let config = require("config-lite")(__dirname);
let bodyParser = require("body-parser");
let schedule = require("node-schedule");
let connectMongo = require("connect-mongo");
let os = require("os");
let fs = require("fs");
let serveIndex = require('serve-index');

let mongo = require("./mongodb/mongo.js");
let router = require("./routes/index.js");

let oCfg = {
  hostname: os.hostname(),
  port: config.port
};

const app = express();

//set use
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//static resource
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, "vuefile/dist")));


// 静态分享目录，通过http访问。
// let sharePath = path.join(__dirname,)
app.use('/share', express.static('E:/share'), serveIndex('E:/share', { 'icons': true }))

//set Headers
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type,Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("X-Powered-By", "3.2.1");
  if (req.url !== "/favicon.ico") {
    if (req.method == "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  } else {
    res.sendStatus(404);
  }
});

//set routers
router(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
});

//set listening port
app.listen(config.port);

//close servers
app.on("close", function (error) {
  mongo.disconnect(function (err) { });
});

//connect mongoDB
mongo.connect(function (error) {
  if (error) throw error;
});

//do other things


fs.writeFile("./public/localdata/hostname.json", JSON.stringify(oCfg), { encoding: "utf-8" }, (err) => {
  if (err) throw err;
});
module.exports = app;
