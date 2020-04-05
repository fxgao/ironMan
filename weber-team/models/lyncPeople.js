let mongoose = require('mongoose');
let moment = require('moment')

const Schema = mongoose.Schema;
const ContactSchema = new Schema({
    ModID: {type:String, index:true},
    Module: String,
    People: [String],
    Leader: String,
    Remarks: String,
    UpdateTime:{type:String,default:moment().format('YYYY-MM-DD')},
    finished:{type:Boolean, default:false}
})
// ContactSchema.index({ModID:1})
const Contact = mongoose.model('Contact',ContactSchema)
exports.ContactModel = Contact