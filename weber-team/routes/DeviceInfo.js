let express = require('express');
let router = express.Router();
let schedule = require('node-schedule')
let DeviceInfo = require('./../controller/DeviceInfo')
let getAllDevInfo = DeviceInfo.getAllDevInfo
let getBookMarks = DeviceInfo.getBookMarks
let getDevVersionInfo = DeviceInfo.getDevVersionInfo
let getRestIpAddress = DeviceInfo.getRestIpAddress
let getDeviceInfo = require('./../public/javascripts/getDevInfo')
let getDevInfo = getDeviceInfo.start
let getRestIpJs = require('./../public/javascripts/getRestIp')
let getRestIp = getRestIpJs.getRestIpFunc

function scheduleGetResultIP() {
    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [new schedule.Range(1, 6)];
    rule.hour = [new schedule.Range(7, 22)];
    rule.minute = [15, 45];
    schedule.scheduleJob(rule, getRestIp);
    getRestIp()
}
scheduleGetResultIP();
getDevInfo()

/* GET users listing. */
router.get('/getAllDevInfo', getAllDevInfo);
router.get('/getBookMarks', getBookMarks);
router.get('/getDevVersionInfo',getDevVersionInfo)
router.get('/getRestIp',getRestIpAddress)

module.exports = router;