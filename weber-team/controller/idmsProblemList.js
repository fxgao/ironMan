let fs = require("fs");
let path = require('path');
let cheerio = require('cheerio');
let superAgent = require('superagent');
let superagentcharset = require("superagent-charset");
let querystring = require('querystring')
let chalk = require('chalk');
let http = require('http')
let schedule = require('node-schedule')

let g_isHaveCookies = false;
let g_cookies
let g_LoginOut = false;
let g_setSchedule = true;

superAgent = superagentcharset(superAgent);

function formateArray(array) {
    let arr = []
    array.forEach(function (obj) {
        let objArr = [];
        for (var key in obj) {
            objArr.push(key + ':' + '"' +obj[key]  + '"');
        }
        arr.push('{ ' + objArr.join(',') + ' }')
    })
    return ('[' + arr.join(',') +']').replace(/\s/g, '+');
}

function formDataParse(data) {
    let myStr = formateArray(data.queryStr);
	data.queryStr = myStr
    return querystring.stringify(data).replace(/%2B/g, '+');;
}

function getGroupQstList(nameList,callBack){
    let cookies = g_cookies.join('')
	let formData = {
		sEcho:1,
		iColumns:9,
		sColumns:'',
		iDisplayStart:0,
		iDisplayLength:1000,
		mDataProp_0:0,
		mDataProp_1:1,
		mDataProp_2:2,
		mDataProp_3:3,
		mDataProp_4:4,
		mDataProp_5:5,
		mDataProp_6:6,
		mDataProp_7:7,
		mDataProp_8:8,
		iSortCol_0:1,
		sSortDir_0:'desc',
		iSortingCols:1,
		bSortable_0:false,
		bSortable_1:true,
		bSortable_2:true,
		bSortable_3:true,
		bSortable_4:true,
		bSortable_5:true,
		bSortable_6:true,
		bSortable_7:true,
		bSortable_8:true,
		queryStr:[{ code:"CurrentPerson",selectVal:"=",value:(nameList.join(',') + ','),filtertype:"string" },{ code:"Status",selectVal:"=",value:"3,4,5,Suspend,A,B,C",filtertype:"select" }],
		type:'Advanced'
	}
    if (!g_isHaveCookies) {
		console.log('No Cookies!');
		return false;
	}
    formData = formDataParse(formData);
    let option = {
        hostname: 'idms.h3c.com',
		port: '80',
		path: '/DefectSearch/Defects',
		method: 'POST',
		headers: {
            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
            'Content-Length':formData.length,
			'Cookie': cookies
		}
    }
    let req = http.request(option,function(res){
        var data = '';
        var arr = [];
        res.on('data', function (str) {
			data += str;
			arr.push(str);
		})
        res.on('end', function (err){
            if(err){
                console.log('获取数据莫名奇妙的失败了呢(⊙_⊙?)，但是大丈夫，我会好起来的哟！！错误的信息为：', error, data);
                callBack(false)
            }else{
                try{
                    let oData = JSON.parse(data);
                    let aData = oData.aaData
                    let dataLength = oData.iTotalRecords
                    let result = {};
                    for(let i =0;i< dataLength;i++){
                        let mainInput = cheerio(aData[i][0])
                        let urlInput = cheerio(aData[i][2])
                        let oMainData = {}
                        oMainData.listNumber = mainInput[0].attribs['data-no'] || ""
                        oMainData.url = urlInput[0].attribs['href'] || ""
                        oMainData.listStatus = mainInput[0].attribs['data-status'] || ""
                        oMainData.describe = mainInput[0].attribs['data-summary'] || ""
                        oMainData.submitBy = mainInput[0].attribs['data-submitby'] || ""
                        oMainData.odcseverity = mainInput[0].attribs['data-odcseverity'] || ""
                        oMainData.heldupDay = aData[i][6] || "0"
                        oMainData.submitDay = aData[i][7] || ""
                        if(result[aData[i][4]] == undefined){
                            result[aData[i][4]] = {}
                            result[aData[i][4]].problemNum = 1 
                            result[aData[i][4]].noDealProblemNum = oMainData.listStatus == "C实施审核"? 0 : 1
                            result[aData[i][4]].problemList = [oMainData]
                        }else{
                            if(oMainData.listStatus != "C实施审核"){
                                result[aData[i][4]].noDealProblemNum += 1
                            }
                            result[aData[i][4]].problemNum += 1
                            result[aData[i][4]].problemList.push(oMainData)
                        }
                    }
                    for(let k = 0;k<nameList.length;k++){
                        if(result[nameList[k]] == undefined){
                            result[nameList[k]] = {};
                            result[nameList[k]].problemNum = 0;
                            result[nameList[k]].noDealProblemNum = 0;
                            result[nameList[k]].problemList = [];
                        }else{
                            continue
                        }
                    }
                    sResult = JSON.stringify(result)
                    fs.writeFile(path.join(__dirname,'./../public/localdata/problemList.json'),sResult, { encoding: 'utf-8' },function(err){
                        if(err){
                            callBack(false)
                            console.log(err)
                        }else{
                            callBack(result)
                        }
                    })
                }
                catch(e){
                    g_LoginOut = true;
                    g_setSchedule = false;
                    CallOnsso()
                }
            }
		})
    })
    req.write(formData);
    req.end()
	// superAgent.post('idms.h3c.com/DefectSearch/Defects:80')
    //     .set('Content-Type','application/x-www-form-urlencoded; charset=UTF-8')
    //     .set('Cookie',cookies)
    //     .set('Content-Length',formData.length)
    //     .send(formData)
    //     .end((err,res)=>{
    //         if(err){
    //             console.log("",err)
    //             callBack(false)
    //         }else{
    //             console.log(res)
    //             callBack(res)
    //         }
    //     })
}

function SessionKeeper(cookie) {
    let options = {
        hostname: 'idms.h3c.com',
        port: 80,
        path: '/Sessionkeeper/SessionKeeper',
        method: 'GET',
        headers: {
            Cookie: cookie
        }
    }
    http.request(options, function(res) {
        console.log('statusCode: ', res.statusCode);
        console.log('SessionKeeper at ' + new Date());
        if (res.statusCode != 200) {
            console.log('Session not keeping!')
            g_isHaveCookies = false;
            g_setSchedule = false;
            CallOnsso()
        }else{
            console.log('Session still keeping!')
            if(g_LoginOut){
                scheduleUpdateData()
                g_LoginOut = false
            }
        }		
    }).end();
}

function scheduleSessionKeeper() {
    let sCookies = g_cookies.join('')
    if(g_setSchedule){
        let rule = new schedule.RecurrenceRule();
        rule.dayOfWeek = [new schedule.Range(1, 6)];
        rule.hour = [new schedule.Range(8, 22)];
        rule.minute = [0, 10, 20, 30, 40, 50];
        //rule.minute = [new schedule.Range(0, 59)];
        schedule.scheduleJob(rule, function(){
            SessionKeeper(sCookies)
        });
    }
    SessionKeeper(sCookies)
    // schedule.scheduleJob('0 [39, 49, 59] 7 * * *', function(){
    //     SessionKeeper(sCookies)
    // });
    // schedule.scheduleJob('0 [9, 19, 29, 39, 49, 59] [8-22] * * *', function(){
    //     SessionKeeper(sCookies)
    // });
}

function linkToFinalPage(newUrl){
    http.get(newUrl, function (res, err) {
        //get cookie here
        g_cookies = res.headers['set-cookie'];
        console.log("Get Idms Cookies Success!")
        chalk.green('IDMS登陆成功,缴获敌人的cookie若干');
        g_isHaveCookies = true;
        scheduleSessionKeeper()
    })
}

function onLoginIdms(postData){
    let options = {
        hostname: 'sso.h3c.com',
        port: 443,
        path: '/ADLoginPage.aspx?RequestTicket=aQBEAE0AUwA%3d%24aAB0AHQAcAA6AC8ALwBpAGQAbQBzAC4AaAAzAGMALgBjAG8AbQAvAEwAbwBnAGkAbgA%2fAGEAdQB0AGgAPQBTAFMATwA%3d%24MgAwADEAOAAtADAAMwAtADIANgAgADEANgA6ADMAMQA6ADQANQA%3d%24Zo6gnUKX7%2bldw7KNsezIfw%3d%3d&adauth=1&random=10152377'
    }
    let sUrl = options.hostname + options.path + ':'+options.port;
    superAgent.post(sUrl)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('rejectUnauthorized','false')
        .send(postData)
        .end((err,res) => {
            if(err){
                console.log(err)
            }else{
                let $ = cheerio.load(res.text);
			    let script = $('script');
                let window = {
                    location: {}
                };
                eval(script.html());
                let newUrl = window.location.href;
                if(!newUrl){
                    console.log('There is no new Url!')
                    return
                }else{
                    linkToFinalPage(newUrl)
                }
            }
        })
}

function CallOnsso(){
    let options = {
        hostname: 'sso.h3c.com',
        port: 443,
        path: '/ADLoginPage.aspx?RequestTicket=aQBEAE0AUwA%3d%24aAB0AHQAcAA6AC8ALwBpAGQAbQBzAC4AaAAzAGMALgBjAG8AbQAvAGwAbwBnAGkAbgA%2fAGEAdQB0AGgAPQBTAFMATwA%3d%24MgAwADEAOAAtADAAMwAtADIANgAgADEANwA6ADQANAA6ADIAMgA%3d%24pH6jo5ou4YJiwIbigkidrQ%3d%3d&adauth=1&random=10152377'
    }
    let sUrl = options.hostname + options.path +':'+options.port;
    superAgent.get(sUrl)
    .set("Content-Type","text/html")
    .end((err,res) => {
        if(err){
            console.log(err)
        }else{
            let $ = cheerio.load(res.text,{decodeEntities:false});//***cheerio模块会默认转化实体，要加上decodeEntities:false ***//
            let inputs = $('input[id]');
            let postData = {}
            for (var i = 0; i < inputs.length; i++) {
                var attribs = inputs[i].attribs;
                postData[attribs.name] = attribs.value;
                
            }
            postData['tbxUserName'] = 'l13644';
            postData['tbxPassword'] = 'Bilibil123';
            onLoginIdms(postData)
        }
    })
}

function scheduleUpdateData(){
    fs.readFile(path.join(__dirname,'../public/localdata/TeamMembers.json'),'utf-8',function(err,data){
        if(err){
            console.log(err)
        }else{
            getGroupQstList(JSON.parse(data).nameList,function(problemListData){
                if(!problemListData){
                    console.log("Schedule Update Data Failed!")
                }else{
                    console.log("Schedule Update Data Success!" + new Date())
                }
            })
        }
    })
}

function getAllData(req,res,next){
    fs.readFile(path.join(__dirname,'../public/localdata/problemList.json'),'utf-8',function(err,data){
        if(err){
            console.log(err)
        }else{
            let sData = JSON.parse(data)
            res.send(sData)
        }
    })
}

function GetCurrentAllProblem(req,res,next){
    fs.readFile(path.join(__dirname,'../public/localdata/TeamMembers.json'), 'utf-8',function(err,data){
        if(err){
            console.log(err)
            next()
        }else{
            getGroupQstList(JSON.parse(data).nameList,function(problemListData){
                if(!problemListData){
                    res.end("Get Data Failed!")
                }else{
                    res.send(problemListData)
                }
            })
        }
    })
}

//周一到周六每天早上8：00运行一次初始化登录操作
let rule1 = new schedule.RecurrenceRule();
rule1.dayOfWeek = [new schedule.Range(1, 6)];
rule1.hour = [8];
rule1.minute = [0];
//rule1.minute = [new schedule.Range(0, 59)];
schedule.scheduleJob(rule1, function(){
    CallOnsso()
});

exports.getAllProblemList = getAllData;
exports.getAllCurrentData = GetCurrentAllProblem;
exports.initIdms = CallOnsso;
exports.updateData = scheduleUpdateData

