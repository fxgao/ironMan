let moment = require('moment')
let uuidV1 = require('uuid/v1')
let lyncPeopleModels = require('./../models/lyncPeople')
let ContactModel = lyncPeopleModels.ContactModel


function checkRepeatAndSaveModule(Contact,res){
    ContactModel.find({ModID:Contact.ModID}, function (err, Modules){
        if (err) {
            console.error(err);
            res.send('Error')
        }else if(Modules.length){
            console.log('There already have ' + Contact.Module);
            res.send('Failed')
        }else{
            Contact.save(function(err){
                if(err){
                    console.log("Failed save data:"+err);
                }else{
                    console.log("Save data success!");
                    res.send('OK')
                }
            });
        }
    });
}
exports.getAll = function(req,res,next){
    ContactModel.find({},function(err,result){
        if(err){
            console.log('Get data failed',err);
        }else if(result.length == 0){
            console.log("There is no data!");
            res.send({})
        }else{
            console.log("Get data success!");
            res.send(result)
        }
    })
}
exports.addPeople = function(req,res,next) {
    let oData = req.body
    let newContact=new ContactModel();
    let s_uuidV1 = uuidV1()
    newContact.Module = oData.Module;
    newContact.People = oData.People;
    newContact.Leader = oData.Leader || "";
    newContact.ModID = s_uuidV1;
    newContact.Remarks = oData.Remarks || "";
    newContact.UpdateTime = moment().format('YYYY-MM-DD');
    checkRepeatAndSaveModule(newContact,res);
}
exports.editPeople = function(req,res,next){
    let oData = req.body
    let oldValue = { ModID: oData.ModID };
    let newValue = {
        $set: {
            Module: oData.Module,
            People: oData.People,
            Leader: oData.Leader,
            Remarks: oData.Remarks,
            UpdateTime: moment().format('YYYY-MM-DD')
        }
    };
    ContactModel.find({ModID:oData.ModID} ,function(err, Modules){
        if (err) {
            console.error(err);
            res.send('Error')
        }else if(!Modules.length){
            let editContact = new ContactModel();
            editContact.Module = oData.Module;
            editContact.People = oData.People;
            editContact.Leader = oData.Leader;
            editContact.ModID = oData.ModID;
            editContact.Remarks = oData.Remarks;
            editContact.UpdateTime = moment().format('YYYY-MM-DD');
            checkRepeatAndSaveModule(editContact,res)
        }else{
            ContactModel.update(oldValue, newValue, function (err, result) {
                if (err) {
                    console.log(err);
                }else{
                    console.log("Update ok");
                    res.send('OK')
                }
            });
        }
    })
}
exports.delPeople = function(req,res,next){
    let oData = req.body
    let aData = [];
    for(key in oData){
        aData.push(oData[key])
    }
    ContactModel.find({ModID:{$in:aData}} ,function(err, Modules){
        if (err) {
            console.error(err);
            res.send('Error')
        }else if(!Modules.length){
            console.log("Can't find Data!");
            res.send('Failed')
        }else{
            ContactModel.remove({ModID:{$in:aData}}, function(err, result){
                if(err){
                    console.log(err);
                    res.send("Error")
                }else if(result.n == 0){
                    console.log("Delete data Failed!");
                    res.send('Not Exits')
                }else{
                    console.log("Delete data success!");
                    res.send('OK')
                }
            });
        }
    })
}