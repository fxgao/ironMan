let fs = require("fs")
let path = require("path")

exports.getAllDevInfo = function(req,res,next){
    let devInfo = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/localdata/devInfo.json'),'utf-8'))
    res.send(devInfo)
}
exports.getBookMarks = function(req,res,next){
    let bookMarks = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/localdata/bookmarks.json'),'utf-8')).bookMarkList;
    res.send(bookMarks)
}
exports.getDevVersionInfo = function(req,res,next){
    let devVersionInfo = fs.readFile(path.join(__dirname, '../public/localdata/DevVersionInfo.json'),'utf-8',function(err,data){
        if(err){
            console.log(err)
        }else{
            res.send(JSON.parse(data))
        }
    })
}
exports.getRestIpAddress = function(req,res,next){
	let restIps = JSON.parse(fs.readFileSync(path.join(__dirname, "../public/localdata/restIp.json"),"utf-8")).RestIP;
	res.send(restIps);
}