let express = require('express');
let router = express.Router();
let codeCheck = require('./../controller/codeCheck.js')
let VerifyAndFix = codeCheck.verifyAndFix;

router.post('/verifyAndFix', VerifyAndFix);

module.exports = router;