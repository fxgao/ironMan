let fs = require('fs')
let path = require('path')
let moment = require('moment')
let ping = require('ping')
let schedule =require('node-schedule')
let exec = require('child_process').exec;

exports.getRestIpFunc = function(){
    var thirdipNum = ["0", "20"];
    var opt = { timeout: 10 };
    var count = 0;
    var aRestIP = [];
    function sortIP(arr) {
        function sor(a, b){
            if (a > b) return 1; else return -1; 
        }
        arr.sort(function (a, b) {
            var x = a.hostIP.match(/\d+\.\d+$/)[0];
            var y = b.hostIP.match(/\d+\.\d+$/)[0];
            var x3 = parseInt(x.split(".")[0]), x4 = parseInt(x.split(".")[1]);
            var y3 = parseInt(y.split(".")[0]), y4 = parseInt(y.split(".")[1]);

            if (x3 == y3)
                return sor(x4, y4);
            else
                return sor(x3, y3);
        })
    }
    function StoreIpInfo(aRestIP) {
        sortIP(aRestIP);
        var sStartIP = "";
        var sEndIP = "";
        var continues = true;
        var aIPregion = [];
        for (var i = 1; i < aRestIP.length; i++) {
            if (!sStartIP) {
                sStartIP = aRestIP[i - 1].hostIP;
                continue;
            }
            //判断IP最后一位连续。
            if (parseInt(aRestIP[i].hostIP.match(/\d+$/)[0]) == parseInt(aRestIP[i - 1].hostIP.match(/\d+$/)[0]) + 1) {
                continues = true;
                continue;
            } else {
                sEndIP = aRestIP[i - 1].hostIP;
                if (!continues) {
                    aIPregion.push({ hostIP: sStartIP });
                    sStartIP = "";
                    i--;
                    continue;
                }
                aIPregion.push({ hostIP: sStartIP + " ~ " + sEndIP });
                sStartIP = "";
                continues = false;
                continue;
            }
        }
        var tmpstr = "";
        data = '{"RestIP":' + JSON.stringify(aIPregion) + "}";
        fs.writeFile(path.join(__dirname,'../localdata/restIp.json'), data, { encoding: 'utf-8' }, function (err) {
            if (err) throw err;
            console.log("IpInfo update success!" + new Date());
        })
    }
    function pingIP(host) {
        ping.sys.probe(host, function (isAlive) {
            if (!isAlive) {
                aRestIP.push({ hostIP: host });
            }
            count++;
            if (count >= 255 * thirdipNum.length)
                StoreIpInfo(aRestIP);
        }, opt);
    }

    for (var i = 0; i < thirdipNum.length; i++) {
        for (var j = 0; j < 255; j++) {
            var host = '192.168.' + thirdipNum[i] + '.' + j;
            pingIP(host);
        }
    }
}