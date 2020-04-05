let fs = require("fs")
let path = require("path")
let schedule = require('node-schedule');

let getBlockVersionTime = require('./../public/javascripts/getBlockVersionTime')
let getVersionBlockInfo = getBlockVersionTime.getVersionTime

schedule.scheduleJob('* * 8 1-3 1-12 *', getVersionBlockInfo);
getVersionBlockInfo()

exports.getVersionTime = function(req,res,next){
    let jVersionTiem = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/localdata/blockVersionTime.json'),'utf-8'))
    res.send(jVersionTiem)
}