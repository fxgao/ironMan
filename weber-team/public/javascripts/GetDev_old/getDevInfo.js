
var superagent = require('superagent');
var https = require('https');
var http = require('http');
var querystring = require('querystring');
var async = require('async');
var exec = require('child_process').exec;
var fs = require('fs');
var schedule = require('node-schedule');


//var getDevInfo = getLoginCookie;
module.exports = function (ExtDevInfoMap, hostIP, callback) {

    // 浏览器请求报文头部部分信息
    var browserMsg = {
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.124 Safari/537.36"
    };
    // 获取硬件信息
    var SoftwareRev = "not get";
    var oSoftRevMap = {
        Rev1: {
            "52": "SP",
            "53": "D0"
        }
    }

    //访问登录接口获取cookie
    getLoginCookie(hostIP);
    function getLoginCookie(hostIP) {
        superagent.get('http://' + hostIP + '/wnm/vcode.bmp')
            .end(function (err, res) {
                //if (res && res.statusCode == 404) console.log(hostIP+" 404vcodebmp");
                if (err) {
                    callback(err, 'noDevIP', hostIP);
                } else {
                    var cookie = res.headers["set-cookie"] || res.headers["set-cookie"][0];
                    //console.log("get cookie :" + cookie);
                    if (cookie) {
                        startlogin(cookie);
                    }
                }
            });
    }

    function startlogin(cookie) {
        username = "admin";
        password = "admin";
        var formData = {
            user_name: username,
            password: password,
            ssl: false,
            host: hostIP,
            lang: "cn"
        };
        var postData = querystring.stringify(formData);
        if (cookie)
            cookie[0] = cookie[0] + "; MenuType=M_Global; supportLang=cn%2Cen; MenuPath=%5B%7B%22sId%22%3A%22_TreeRoot%22%2C%22sText%22%3A%22All%20Networks%22%7D%5D; TreeNode=%7B%22nodeId%22%3A%22_TreeRoot%22%7D; lang=cn"
        else {
            cookie = ["MenuType=M_Global; supportLang=cn%2Cen; MenuPath=%5B%7B%22sId%22%3A%22_TreeRoot%22%2C%22sText%22%3A%22All%20Networks%22%7D%5D; TreeNode=%7B%22nodeId%22%3A%22_TreeRoot%22%7D; lang=cn"];
        }
        //cookie = "vindex==07=01=0AB00=0R; supportLang=cn%2Cen; MenuPath=%5B%7B%22sId%22%3A%22_TreeRoot%22%2C%22sText%22%3A%22All%20Networks%22%7D%5D; TreeNode=%7B%22nodeId%22%3A%22_TreeRoot%22%7D; lang=cn; MenuType=M_Global";
        superagent.get('http://' + hostIP + '/wnm/frame/login.php' + '?' + postData)
            .set("Cookie", cookie[0])
            //.set(browserMsg)
            //.send(postData)
            .end(function (err, res) {
                if (err) {
                    //console.log(err)
                    callback(err, 'unknown', hostIP)
                }
                else if (!res) {
                    callback(err, 'unknown')
                }
                else {
                    //console.log(res.text);
                    //get SessionID,loginID
                    var resurl = '';
                    var oTmp = JSON.parse(res.text) || false
                    if(oTmp){
                        if(oTmp.sessionid){
                            resurl = `${oTmp.url}?sessionid=${oTmp.sessionid}&loginid=${oTmp.loginid}`
                        }else{
                            resurl = oTmp.url;
                        }
                    }else{
                        callback(err, 'redirect error')
                        return;
                    }
                    //console.log(res.text);
                    var loginid = querystring.parse(resurl).loginid;
                    var regSession = /sessionid(=|"\s{0,2}:\s{0,2}")\w+\d(&){0,1}/;
                    // var regSession2 = /\"sessionid\"\:/;
                    var regMaxUser = /Web用户数已经到达上限/;
                    // if (res.text.match(regSession2)){
                    //     var oResult = JSON.parse(res.text);
                    //     var sessionID = oResult.sessionid;
                    //     superagent.get('http://' + hostIP + '' + resurl)
                    //         .set("Cookie", cookie[0])
                    //         .end(function (err, res) {
                    //             if (err){
                    //                 callback(err, 'resurl login failed');
                    //             }
                    //             cookie[0] = cookie[0] + "; " + sessionID + "=true";
                    //             getDevInfo(cookie, sessionID);
                    //         })
                    // }else
                    if (res.text.match(regSession)) {
                        var oTmp = JSON.parse(res.text) || {};
                        var sessionID = '';
                        if (oTmp.sessionid) {
                            sessionID = oTmp.sessionid;
                        } else {
                            sessionID = res.text.match(regSession)[0].split("=")[1];
                        }
                        // sessionID = sessionID.split("&")[0];
                        superagent.get('http://' + hostIP + '' + resurl)
                            .set("Cookie", cookie[0])
                            .end(function (err, res) {
                                if (err) {
                                    callback(err, 'resurl login failed');
                                    return;
                                }
                                //console.log(res.text);
                                //console.log(res.text);
                                cookie[0] = cookie[0] + "; " + sessionID + "=true";
                                getDevInfo(cookie, sessionID);
                            })
                    }
                    else if (res.text.match(regMaxUser)) {
                        callback(err, 'unknown: maxUser', hostIP);
                    }
                    else if (res.text.match(/验证码错误/)) {
                        callback(err, 'unknown: need Vcode', hostIP);
                    }
                    else {
                        var err = true;
                        callback(err, "unknown", hostIP);
                    }
                }



            })

    }

    function getDevInfo(cookie, sessionID) {
        //var cookie = "vindex==0b=0f=0AB00=0R; supportLang=cn%2Cen; MenuPath=%5B%7B%22sId%22%3A%22_TreeRoot%22%2C%22sText%22%3A%22All%20Networks%22%7D%5D; TreeNode=%7B%22nodeId%22%3A%22_TreeRoot%22%7D; lang=cn; 200004237fdac2e19fc89adcffe7fab29425=true; MenuType=M_Global"
        //var sessionID = "200004237fdac2e19fc89adcffe7fab29425"
        superagent.get('http://' + hostIP + '/wnm/frame/index.php' + '?sessionid=' + sessionID)

            .set("Cookie", cookie[0])
            //.set(browserMsg)
            .end(function (err, res) {
                if (err) callback(err, '登陆错误' + hostIP);
                //console.log(res.text);
                var reg = /devname":".+"/
                if (!res || !res.text) callback(err, '获取数据错误' + hostIP)
                else {
                    try {
                        var devInfo = res.text.match(reg)[0].split(":")[1].split('"')[1]
                    } catch (error) {
                        console.log(`${error}=====\n${res.text}\n${hostIP}`)
                    }
                    //console.log(devInfo);

                    //get verision
                    superagent.post('http://' + hostIP + '/wnm/get.j' + '?sessionid=' + sessionID)
                        .set("Cookie", cookie[0])
                        .set("Content-Type", "application/x-www-form-urlencoded")
                        .send({
                            xml: "<rpc message-id='101' xmlns='urn:ietf:params:xml:ns:netconf:base:1.0'  xmlns:web='urn:ietf:params:xml:ns:netconf:base:1.0'><get><filter type='subtree'><top xmlns='http://www.h3c.com/netconf/data:1.0' xmlns:web='http://www.h3c.com/netconf/base:1.0' xmlns:data='http://www.h3c.com/netconf/data:1.0'><Device><PhysicalEntities><Entity><PhysicalIndex/><HardwareRev/><FirmwareRev/><SoftwareRev/><SerialNumber/></Entity></PhysicalEntities></Device></top></filter></get></rpc>",
                            req_menu: "M_Global/M_Dashboard"
                        })
                        .end(function (err, res) {
                            //console.log(res.text);
                            var SoftwareRev = null, SoftwareExt = null;
                            if (err) callback(err, devInfo, hostIP, SoftwareRev, SoftwareExt)
                            if (res && res.text.trim() == "") {
                                callback(err, devInfo, hostIP, SoftwareRev, SoftwareExt)
                            }
                            else {
                                try {
                                    oInfo = JSON.parse(res.text)
                                } catch (error) {
                                    callback(error, '获取数据错误' + hostIP);
                                    return
                                }
                                // oInfo = JSON.parse(res.text)
                                var aPhyInfo = oInfo.Device ? oInfo.Device.PhysicalEntities : "unknown";
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
                                            console.log(SoftwareRev + aPhyInfo[i]["SoftwareRev"]);
                                            //callback(err, devInfo, hostIP, SoftwareRev, SoftwareExt);
                                            break;
                                        } else {
                                            //callback(err, devInfo, hostIP, SoftwareRev, SoftwareExt);
                                            break;
                                        }
                                    }
                                }
                                if (!SoftwareExt) {
                                    console.log(SoftwareExt);
                                }
                                callback(err, devInfo, hostIP, SoftwareRev, SoftwareExt);
                                //console.log(devInfo, hostIP, SoftwareRev, SoftwareExt);
                                logout(cookie, sessionID);
                            }
                        })
                }
            });
    }

    function logout(cookie, sessionID) {
        superagent.post('http://' + hostIP + '/wnm/logout.j' + '?sessionid=' + sessionID)
            .set("Cookie", cookie[0])
            //.set("Content-Type", "application/x-www-form-urlencoded")
            .end(function (err, res) {
                //console.log("get dev" + hostIP + "ok");
            })
    }
};