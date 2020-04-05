let express = require('express');
let schedule = require('node-schedule');
let router = express.Router();
let idmsProblemList = require('./../controller/idmsProblemList.js')
let getAllProblemList = idmsProblemList.getAllProblemList
let getAllCurrentData = idmsProblemList.getAllCurrentData
let initIdms = idmsProblemList.initIdms
let updateData = idmsProblemList.updateData

initIdms()

//设置定时任务，更新问题单列表内容
let rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(1, 6)];
rule.hour = [new schedule.Range(8, 22)];
rule.minute = [0];
schedule.scheduleJob(rule, updateData);

router.get('/getAll',getAllProblemList)
router.get('/getCurrentAll',getAllCurrentData)

module.exports = router;