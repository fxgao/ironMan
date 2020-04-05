let express = require('express');
let router = express.Router();
let VersionTime = require('./../controller/VersionTime.js')
let GetVersionTime = VersionTime.getVersionTime

router.get('/getVersionTime', GetVersionTime);

module.exports = router;