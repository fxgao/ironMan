let fs = require('fs')
let path = require('path')
let moment = require('moment')
let ping = require('ping')
let schedule =require('node-schedule')
let exec = require('child_process').exec;
let getDevInfo = require('./getDevInfo')

exports.getDevInfo = function(){
    function startGetDev() {
        var thirdipNum = ["0", "20"]
        var devList = [];
        var count = 0;
        var bDevWrote = false;
        for (i = 0; i < thirdipNum.length; i++) {
            for (j = 0; j < 255; j++) {
                var str = '192.168.' + thirdipNum[i] + '.' + j;
                getDevInfo(ExtDevInfoMap, str, function (err, res, hostIP, SoftwareRev, SoftwareExt) {
                    if (!err) {
                        var tmp = {};
                        tmp.hostIP = hostIP;
                        tmp.devName = res;
                        tmp.SoftwareRev = SoftwareRev;
                        tmp.SoftwareExt = SoftwareExt;
                        devList.push(tmp);
                    }
                    count++;
                    //console.log(count, hostIP);
                    if (count >= 253 * 2 && devList.length) {//get Data over
                        function sor(a, b) {
                            if (a > b)
                                return 1;
                            else
                                return -1;
                        }
                        devList.sort(function (a, b) {
                            if (a.hostIP && b.hostIP) {
                                var x = a.hostIP.match(/\d+\.\d+$/)[0];
                                var y = b.hostIP.match(/\d+\.\d+$/)[0];
                                var x3 = parseInt(x.split(".")[0]), x4 = parseInt(x.split(".")[1]);
                                var y3 = parseInt(y.split(".")[0]), y4 = parseInt(y.split(".")[1]);

                                if (x3 == y3)
                                    return sor(x4, y4);
                                else
                                    return sor(x3, y3);
                            }
                            else {
                                return 1;
                            }

                        })
                        //console.log(devList);
                        Oupdatetime = moment().format('YYYY-MM-DD HH:mm:ss');
                        var data = '{"devList":' + JSON.stringify(devList)
                            + ',"updatetime":"' + Oupdatetime + '"}'
                        if (data.length && !bDevWrote) {
                            bDevWrote = true;
                            fs.writeFile(path.join(__dirname, '../localdata/devInfo.json'), data, { encoding: 'utf-8' }, function (err) {
                                if (err) throw err;
                                console.log("dev update" + Oupdatetime);
                                bDevWrote = true;
                            })
                        } else {
                            bDevWrote = false;
                        }
                    }
                });
            }

        }

    }

    function ExtRevInfo() {
        ExtDevInfoMap = {};
        //superagent.get("file://h3cbjnt06-fs/%E6%97%A0%E7%BA%BF/EW_Version/EWC/")
        var cmd = 'net use \\\\h3cbjnt06-fs\\无线\\EW_Version\\EWC /USER:l13644 Bilibil123';
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
                fs.writeFile(path.join(__dirname,'../localdata/DevVersionInfo.json'),JSON.stringify(ExtDevInfoMap),function(err){
                    if(err){
                        console.log(err)
                    }
                    startGetDev();
                })   
            })

        })
    }
    
    function scheduleGetDev() {
        var rule = new schedule.RecurrenceRule();
        rule.dayOfWeek = [new schedule.Range(1, 6)];
        rule.hour = [new schedule.Range(8, 17)];
        rule.minute = [0, 30];
        //rule.minute = [new schedule.Range(0, 59)];
        schedule.scheduleJob(rule, ExtRevInfo);
        ExtRevInfo()
    }
    scheduleGetDev();
}