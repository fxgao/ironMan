let express = require('express');
let router = express.Router();
let lyncPeople = require('./../controller/lyncPeople')
let getAll = lyncPeople.getAll
let addPeople = lyncPeople.addPeople
let editPeople = lyncPeople.editPeople
let delPeople = lyncPeople.delPeople

/* GET users listing. */
router.get('/', getAll);
router.post('/addPeople', addPeople);
router.post('/editPeople', editPeople)
router.post('/delPeople', delPeople);


module.exports = router;
