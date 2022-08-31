const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  schema_v: { type: Number, default: 1 },

  notification_type: { type: String, default: "notify" }, // notify, error, detection, reminder
  title: { type: String, default: "" },
  message: { type: String, default: "" },
  
  additional: {
    type: mongoose.Mixed,
    default: {
      error_code: 0,
      severity: "none",
    }
  },

  priority: { type : Number, default : 0 },
  links : { type : mongoose.Mixed, default : [
    {
        link: '',
        link_short : '',
        link_mode : false
    }
  ]},
  seenBy: { type : Array, default : [] },
  date: { type : Date, default : Date.now}
});

module.exports =
  mongoose.models.notification ||
  mongoose.model("notification", notificationSchema);
