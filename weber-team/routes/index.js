let express = require('express')
let people = require('./people.js')
let blockVersionTime = require('./blockVersionTime.js')
let DeviceInfo = require('./DeviceInfo.js')
let Idms = require('./idms.js')
let codeChecker = require('./eslintChecker.js')
let webIO = require('./webIO')

/* GET home page. */
module.exports = function (app){
  app.use('/blockversiontime',blockVersionTime);
  app.use('/people',people);
  app.use('/DevInfo',DeviceInfo)
  app.use('/idms',Idms)
  app.use('/codeCheck',codeChecker)
  app.use('/webIO',webIO)
}
