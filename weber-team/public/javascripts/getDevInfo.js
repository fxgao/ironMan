
var superagent = require('superagent')
var https = require('https')
var http = require('http')
var querystring = require('querystring')
var exec = require('child_process').exec
var fs = require('fs')
var schedule = require('node-schedule')
var path = require('path')
var moment = require('moment')

// 启动log
const log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: './getDev.log' } },
    categories: { default: { appenders: ['cheese'], level: 'trace' } }
});
const logger = log4js.getLogger('cheese');
logger.debug('hahaha')

// 1. 获取版本对应关系
// 2. 获取设备信息

var g_config = {
    officialUser: {
        name: "lisongyu",
        workNum: "l13644",
        passWord: "Bilibil123"
    }
}
const errorMap = {
    "ETIMEDOUT": true,
}

let ExtDevInfoMap = {}
let oSoftRevMap = {
    Rev1: {
        "52": "SP",
        "53": "D0"
    }
}

// 开局只有一个空表，设备全靠检~
ExtRevInfo()
// 来个定时任务
function scheduleGetDev() {
    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [new schedule.Range(1, 6)];
    rule.hour = [new schedule.Range(8, 17)];
    rule.minute = [0, 30];
    //rule.minute = [new schedule.Range(0, 59)];
    schedule.scheduleJob(rule, ExtRevInfo);
    console.log(`设备列表定时任务已开启。`)
}
// scheduleGetDev();

// function scheduleGetDev() {
//     var rule = new schedule.RecurrenceRule();
//     rule.dayOfWeek = [new schedule.Range(1, 6)];
//     rule.hour = [new schedule.Range(8, 17)];
//     rule.minute = [0, 30];
//     //rule.minute = [new schedule.Range(0, 59)];
//     schedule.scheduleJob(rule, ExtRevInfo);
//     // ExtRevInfo()
// }
// scheduleGetDev();

function ExtRevInfo() {
    ExtDevInfoMap = {};
    //superagent.get("file://h3cbjnt06-fs/%E6%97%A0%E7%BA%BF/EW_Version/EWC/")
    var user = g_config.officialUser;
    var cmd = `net use \\\\h3cbjnt06-fs\\无线\\EW_Version\\EWC /USER:${user.workNum} ${user.passWord}`;
    // var cmd = 'net use \\\\10.153.3.125\\cilib\\V7R1_SPRINGB64 /USER:l13644 Lsy0519';
    exec(cmd, function (err, stdout, stderr) {
        if (err) console.log('cmd process not did');
        if (stdout) console.log('cmd process did.');
        //访问版本文件夹路径，尝试对应版本号。
        var pathB64 = '\\\\h3cbjnt06-fs/无线/EW_Version/EWC/11.COMWAREV700R001 B64分支';
        fs.readdir(pathB64, function (err, files) {
            softDir = files;
            var fileReg = /\(.+\)$/;
            for (i in files) {
                var revInfo = files[i].match(fileReg);
                if (revInfo) {
                    //B64D005SP41(Customer 5109P41,信阳华锐学院版本)
                    //括号内容对应版本号内容。
                    ExtDevInfoMap[revInfo[0]] = files[i].match(/^.+\(/)[0].split("(")[0];
                }
            }
            fs.writeFile(path.join(__dirname, '../localdata/DevVersionInfo.json'), JSON.stringify(ExtDevInfoMap), function (err) {
                // fs.writeFile(path.join(__dirname, './DevVersionInfo.json'), JSON.stringify(ExtDevInfoMap), function (err) {
                startGetDev();
            })
        })

    })
}
var g_count = 0;
function startGetDev() {
    g_count = 0
    // 登陆每个0,20网段的IP，获取设备型号。
    let thirdipNum = ["0", "20"]
    let devList = [];

    for (const thirdIP of thirdipNum) {
        for (let i = 0; i < 255; i++) {
            var devIP = `192.168.${thirdIP}.${i}`
            requestDev(devIP, devList)
        }
    }
}

// requestDev('192.168.0.130', [])
// 重点的登录流程：
// Main
// 将结果写入DevList
async function requestDev(devIP, devList) {
    try {
        var oDevInfo = {
            hostIP: devIP
        }
        let res1 = await superagent.get('http://' + devIP + '/wnm/vcode.bmp')
        let req2Data = makeReq2Data(res1)
        let res2 =
            await superagent.get(`http://${devIP}/wnm/frame/login.php`)
                .query(req2Data.postData)
                .set('Cookie', req2Data.cookie)
        let req3Data = makeReq3Data(res2)
        if (req3Data.error) {
            oDevInfo.devName = `err: ${error}`
            devList.push(oDevInfo)
            return
        }
        let res3 =
            // await superagent.get(`http://${devIP}/wnm/frame/index.php?sessionid=${req3Data.sessionID}`)
            await superagent.get(`http://${devIP}${req3Data.url}`)
                .set('Cookie', req3Data.cookie)

        // 如果第四步成功了，我们就登陆成功啦。
        let req4Data = makeReq4Data(res3, req3Data.sessionID)
        let res4 =
            await superagent.get(`http://${devIP}/wnm/frame/index.php?sessionid=${req3Data.sessionID}`)
                .set('Cookie', req4Data.cookie)

        oDevInfo.devName = res4.text.match(/devname":".+"/)[0].split(":")[1].split('"')[1]
        // let req5Data = makeReq5Data()
        // 开始获取设备版本~
        let res5 =
            await superagent.post(`http://${devIP}/wnm/get.j?sessionid=${req3Data.sessionID}`)
                .set("Cookie", req4Data.cookie)
                .set("Content-Type", "application/x-www-form-urlencoded")
                .send({
                    xml: "<rpc message-id='101' xmlns='urn:ietf:params:xml:ns:netconf:base:1.0'  xmlns:web='urn:ietf:params:xml:ns:netconf:base:1.0'><get><filter type='subtree'><top xmlns='http://www.h3c.com/netconf/data:1.0' xmlns:web='http://www.h3c.com/netconf/base:1.0' xmlns:data='http://www.h3c.com/netconf/data:1.0'><Device><PhysicalEntities><Entity><PhysicalIndex/><HardwareRev/><FirmwareRev/><SoftwareRev/><SerialNumber/></Entity></PhysicalEntities></Device></top></filter></get></rpc>",
                    req_menu: "M_Global/M_Dashboard"
                })

        let VerData = makeVerData(res5)
        Object.assign(oDevInfo, VerData)
        // console.log(oDevInfo)
        devList.push(oDevInfo)

        // 获取结束，可以登出啦。
        let res6 =
            await superagent.post(`http://${devIP}/wnm/logout.j?sessionid=${req3Data.sessionID}`)
                .set("Cookie", req4Data.cookie)

    }
    catch (error) {
        if (!errorMap[error.code])
            logger.info(`gotError in getDev: ${error}`)
        logger.info('error getDev')
    }
    finally {
        g_count++
        if (g_count > 509) {
            storeDevList(devList)
        }
    }
}

// 返回第二步request需要的数据和cookie
function makeReq2Data(res1) {
    username = "admin";
    password = "admin";
    let formData = {
        user_name: username,
        password: password,
        ssl: false,
        host: res1.request.host,
        lang: "cn"
    };
    let cookie = res1.headers["set-cookie"] || res1.headers["set-cookie"][0];
    if (cookie)
        cookie[0] = cookie[0] + "; MenuType=M_Global; supportLang=cn%2Cen; MenuPath=%5B%7B%22sId%22%3A%22_TreeRoot%22%2C%22sText%22%3A%22All%20Networks%22%7D%5D; TreeNode=%7B%22nodeId%22%3A%22_TreeRoot%22%7D; lang=cn"
    else {
        cookie = ["MenuType=M_Global; supportLang=cn%2Cen; MenuPath=%5B%7B%22sId%22%3A%22_TreeRoot%22%2C%22sText%22%3A%22All%20Networks%22%7D%5D; TreeNode=%7B%22nodeId%22%3A%22_TreeRoot%22%7D; lang=cn"];
    }
    return {
        postData: formData,
        cookie: cookie
    }
}

function makeReq3Data(res2) {
    var resurl = '';
    var oReturnVal = {}
    var oTmp = JSON.parse(res2.text) || false
    if (oTmp) {
        if (oTmp.sessionid) {
            // 新版本的Cookie等数据与旧版有区别。
            oReturnVal.VerType = 'New'
            resurl = `${oTmp.url}?sessionid=${oTmp.sessionid}&loginid=${oTmp.loginid}`
        } else {
            oReturnVal.VerType = 'Old'
            resurl = oTmp.url;
        }
    } else {
        throw new Error(`redirect error at ${res2.request.url}`)
        return;
    }

    var loginid = querystring.parse(resurl).loginid;
    // 获取session用的正则
    var regSession = /sessionid(=|"\s{0,2}:\s{0,2}")\w+(&){0,1}/;
    var regMaxUser = /Web用户数已经到达上限/;
    if (res2.text.match(regSession)) {
        var oTmp = JSON.parse(res2.text) || {};
        var sessionID = '';
        if (oTmp.sessionid) {
            sessionID = oTmp.sessionid;
        } else {
            sessionID = res2.text.match(regSession)[0].split("=")[1];
            sessionID = sessionID.split('&')[0];
        }
        // sessionID = sessionID.split("&")[0];
        oReturnVal.sessionID = sessionID;
        oReturnVal.cookie = res2.request.header.Cookie || res2.request._header.cookie
        oReturnVal.url = resurl

    }
    else if (res2.text.match(regMaxUser)) {
        oReturnVal.error = '登陆用户max'
    }
    else if (res2.text.match(/验证码错误/)) {
        oReturnVal.error = '验证码触发T.T'
    }
    else {
        oReturnVal.error = '未知错误'
    }

    // 处理新版本的登陆数据
    if (oReturnVal.VerType == 'New') {
        if (oReturnVal.cookie.length) {
            for (let i = 0; i < oReturnVal.cookie.length; i++) {
                oReturnVal.cookie[i] += `; sessionid=${sessionID}; loginid=${loginid}`
            }
        }
    }

    return oReturnVal
}

function makeReq4Data(res3, sessionID) {
    if (!res3.text && res3.text.length < 300) {
        throw new Error('重定向错误')
    }
    let cookies = res3.request.header.Cookie || []
    var oReturnVal = { cookie: cookies }
    for (let i = 0; i < cookies.length; i++) {
        oReturnVal.cookie[i] += `; ${sessionID}=true`
    }
    return oReturnVal
}

function makeVerData(res5) {
    let aPhyInfo = JSON.parse(res5.text).Device.PhysicalEntities || []
    var oReturnVal = {
        SoftwareRev: 'N/A~',
        SoftwareExt: 'N/A~',
        error: undefined
    }
    if (!aPhyInfo.length) {
        oReturnVal.error = '获取错误╮(╯▽╰)╭'
    }
    var SoftwareRev = null, SoftwareExt = null
    for (i in aPhyInfo) {
        if (aPhyInfo[i]["SoftwareRev"]) {
            var verNum = aPhyInfo[i]["SoftwareRev"].match(/\w+$/)[0];
            for (key in ExtDevInfoMap) {
                if (key.match(verNum)) {
                    SoftwareRev = ExtDevInfoMap[key];
                    SoftwareExt = key;
                    break;
                }
            }
            if (!SoftwareRev || !SoftwareExt) {
                var ver1 = verNum.slice(0, 2);
                var ver2 = verNum.slice(2, 4);
                SoftwareRev = oSoftRevMap.Rev1[ver1] + ver2;
                SoftwareExt = "N/A";
                // console.log(SoftwareRev + aPhyInfo[i]["SoftwareRev"]);
                break;
            } else {
                break;
            }
        }
    }
    oReturnVal.SoftwareRev = SoftwareRev || oReturnVal.error
    oReturnVal.SoftwareExt = SoftwareExt || oReturnVal.error
    return oReturnVal
}

function storeDevList(devList) {
    // console.log(`reqNum${g_count},,, reqList:${devList.length}`)
    let Oupdatetime = moment().format('YYYY-MM-DD HH:mm:ss');
    let data = '{"devList":' + JSON.stringify(devList)
        + ',"updatetime":"' + Oupdatetime + '"}'
    if (devList.length) {
        fs.writeFile(path.join(__dirname, '../localdata/devInfo.json'), data, { encoding: 'utf-8' }, function (err) {
        // fs.writeFile(path.join(__dirname, '.devInfo.json'), data, { encoding: 'utf-8' }, function (err) {
            if (err) throw err;
            console.log("dev update" + Oupdatetime);
        })
    }
}

var g_oExtObj = {
    start: scheduleGetDev
}

module.exports = g_oExtObj