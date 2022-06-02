const mongoose = require("mongoose");

const thermalDetectionSchema = new mongoose.Schema({
    schema_v : { type : Number, default : 1 },
    raw_thermal : { type: [], required : true },
    thermal_image : { type : String, required : true },
    normal_image : { type : String, required : true },
    annotate_bbox_image : { type : String, required : true },
    no_pigs : { type : Number, required : true },
    no_stressed_pigs : { type : Number, required : true },
    max_temp : { type : Number, required : true },
    min_temp : { type : Number, required : true },
    detection_type : { type : Boolean, default : true },
    executed_action : { type: mongoose.Mixed, required : true },
    cat : { type : Date, default : Date.now },
    dat : { type : Date, default : null },
    uat : { type : Date, default : Date.now }
});

module.exports = mongoose.model("thermal_detection", thermalDetectionSchema);