let express = require('express');
let router = express.Router();
let fs = require('fs')
let path = require('path')

/* GET users listing. */
router.get('/getSvnPath', getSvnPath);
router.post('/editSvnPath', editSvnPath);

function getSvnPath(req, res, next) {
    let sPath = path.join(__dirname, '../public/localdata/svnPath.json')
    fs.readFile(sPath, 'utf-8', function (err, data) {
        if (err) console.log(err)
        else {
            res.send(JSON.parse(data))
        }
    })
}

function editSvnPath(req, res, next) {
    let oData = req.body
    let sPath = path.join(__dirname, '../public/localdata/svnPath.json')
    fs.writeFile(sPath, JSON.stringify(oData), { encoding: 'utf-8' }, function (error) {
        if (error) console.log(error)
        else {
            res.send('OK')
        }
    })
}

module.exports = router;
