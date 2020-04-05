let superAgent = require('superagent')
let http = require('http')
let superagentcharset = require("superagent-charset")
let cheerio = require('cheerio')
let iconv = require("iconv-lite")
let fs = require("fs")
let path = require('path')
let querystring = require('querystring')
let sfturl = "http://sft/info/files/Comware%202016%E5%B9%B4%E7%89%88%E6%9C%AC%E8%AE%A1%E5%88%92.htm?t=0.05629137707951282"

exports.getVersionTime = function(){
    function filterTabContainer(html){
    var $ = cheerio.load(html,{decodeEntities:false});//***cheerio模块会默认转化实体，要加上decodeEntities:false ***//
    var aDate = $("h1.title")
    var aTable = $("table")
    var oblockVersionTime
    fs.readFile(path.join(__dirname, '../localdata/blockVersionTime.json'),'utf-8',function(err,data){
        if(data == ""){
            oblockVersionTime = {}
            oblockVersionTime.Year = new String("")
            oblockVersionTime.VersionInfo = {}
        }else{
            oblockVersionTime = JSON.parse(data)
        }
        for(var i = 0;i<aDate.length;i++){
          var sDate = aDate[i].children[0].data.trim();
          if(sDate == undefined || sDate == ""){
            continue
          }
          var Year = sDate.slice(0,4)
          var Month = parseInt(sDate.slice(-2,-1))
          oblockVersionTime.Year = Year+"年"
          oblockVersionTime.VersionInfo[Month] = {}
          oblockVersionTime.VersionInfo[Month].Trunk = {}
          oblockVersionTime.VersionInfo[Month].D016SP = {}
          oblockVersionTime.VersionInfo[Month].D029SP = {}
          $(aTable[i]).find("td.version").each(function(index,item){
            var ContentDom = $(item).html()
            var ContentText = $(item).text()
            var nDateDay = $(item).text().split(' ',1)
            var oVersion = $(item).find("p,span.v7-version")
            var DateDay = parseInt(nDateDay[0].replace('\n',''))
            if(oVersion){
                for(var i = 0;i<oVersion.length;i++){
                    var aVersion=oVersion[i].children
                    var aResult = []
                    if(aVersion[0].data && (aVersion[0].data.indexOf("WXB64D016SP") != -1 || aVersion[0].data.indexOf("8048B64D029SP") != -1 || aVersion[0].data.indexOf("V7 B64") != -1)){
                        aResult.push(aVersion[0].data,aVersion[2].data.replace(' ','').replace('\n','').replace('\r','').replace(' ',''),DateDay)
                        if(aVersion[0].data.indexOf("V7 WXB64D016SP") != -1 ){
                            oblockVersionTime.VersionInfo[Month].D016SP[DateDay] = aResult
                        }else if(aVersion[0].data.indexOf("V7 B64D029SP") != -1 ){
                            oblockVersionTime.VersionInfo[Month].D029SP[DateDay] = aResult
                        }else if(aVersion[0].data.indexOf("V7 B64分支") != -1){
                            oblockVersionTime.VersionInfo[Month].Trunk[DateDay] = aResult
                        }
                    }
                }
            }else{
                return true
            }
          })
        }
        var sblockVersionTime = JSON.stringify(oblockVersionTime)
        fs.writeFile(path.join(__dirname, '../localdata/blockVersionTime.json'),sblockVersionTime,{encoding:"utf-8"},function(err){
          if(err) throw err
        })
    })
  }
    //*********************node自带http模块利用iconv-lite实现中文转码********************//
    // http.get(sfturl,(res)=>{
    //     let allHtml = [];
    //     let length = 0;
    //     res.on('data',(chrunk) => {
    //         allHtml.push(chrunk)
    //         length += chrunk.length
    //     })
    //     res.on('end', () =>{
    //         var data = Buffer.concat(allHtml,length)
    //         var decode_data = iconv.decode(data,'GBK')
    //         filterTabContainer(decode_data)
    //     })
    // }).on('error',(err) => {
    //     console.log(err)
    // })
    //*****************SuperAgent如何转换中文编码*****************************//
    superAgent = superagentcharset(superAgent)
    superAgent.get(sfturl)
        .charset('GBK')
        .set("Content-Type","text/html")
        .end((err,res) => {
            if(err){
                console.log(err)
            }else{
                filterTabContainer(res.text)
            }
        })
}
