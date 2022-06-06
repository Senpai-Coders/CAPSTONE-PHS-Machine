const mongoose = require("mongoose");

const thermalDetectionSchema = new mongoose.Schema({
    schema_v : { type : Number, default : 1 },
    img_normal: { type : String },
    img_annotated: { type : String, required : true },
    img_thermal: { type : String, required : true },
    data: { type: mongoose.Mixed, required : true },
    detection_type : { type : Boolean, default : true },
    actions : { type: mongoose.Mixed, required : true },
    cat : { type : Date, default : Date.now },
    dat : { type : Date, default : null },
    uat : { type : Date, default : Date.now }
});

module.exports = mongoose.models.thermal_detection || mongoose.model("thermal_detection", thermalDetectionSchema);