const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    schema_v : { type : Number, default : 1 },
    user_name : { type : String, required : true, unique : true },
    password : { type : String, required : true },
    photo : { type : String, default : 'pig.svg' },
    role : { type : Number, required : true }, // 3 -> Root, 2 -> Admin, 1 -> Employee, 0 -> Viewer
    cat : { type : Date, default : Date.now },
    dat : { type : Date, default : null },
    uat : { type : Date, default : Date.now },
    login_count : {type : Number, default : 0},
    sign_in : { type : Date, default : Date.now }
});

module.exports = mongoose.models.user || mongoose.model("user", userSchema);