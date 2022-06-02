const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    schema_v : { type : Number, default : 1 },
    user_name : { type : String, required : true, unique : true },
    password : { type : String, required : true },
    photo : { type : String, default : 'vercel.svg' },
    role : { type : Number, required : true },
    cat : { type : Date, default : Date.now },
    dat : { type : Date, default : null },
    uat : { type : Date, default : Date.now }
});

module.exports = mongoose.models.user || mongoose.model("user", userSchema);