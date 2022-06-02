const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
    schema_v : { type : Number, default : 1 },
    category : { type : String, required : true },
    config_name : { type : String, required : true, unique : true },
    description : { type : String, required : true },
    value : { type : mongoose.Mixed, required : true },
    cat : { type : Date, default : Date.now },
    uat : { type : Date, default : Date.now },
    uby : {type : mongoose.ObjectId, required : true},
    disabled : { type : Boolean, default : false },
});

module.exports = mongoose.models.config || mongoose.model("config", configSchema);