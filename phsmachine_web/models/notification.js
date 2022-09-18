const mongoose = require("mongoose");

/**
 * 
 * POSIBLE CONTENT
 * {
      notification_type: "notify",
      title: "Heat Stress Action",
      message: "Heat stress action complete",
      priority: 0,
      link: "http://192.168.1.5:3000/detection_details?_id=62d381c1c1407264c718de27",
      link_short : "/detection_details?_id=62d381c1c1407264c718de27",
      link_mode : true,
      seenBy: ["630eae4bbb909833559a7996"],
      date: new Date(),
    },
    {
      notification_type: "notify",
      title: "New user ",
      message: "A new user has been added.",
      priority: 0,
      link: "",
      seenBy: ["630eae4bbb909833559a7991"],
      date: new Date(),
    },
    {
      notification_type: "detection",
      title: "Heat Stress Detected",
      message: "Heat stress at cell 2",
      priority: 0,
      link: "https://www.youtube.com/watch?v=fFPgZiS7uAM&list=RDfFPgZiS7uAM&start_radio=1&ab_channel=PAINHUB",
      seenBy: ["630eae4bbb909833559a7991"],
      date: new Date(),
    },
    {
      notification_type: "error",
      title: "PHS Error",
      message: "PHS core encountered an error, refer error code in manual",
      additional: {
        error_code: 0,
        severity: "low",
        error_log: "Traceback (most recent call last): \n File \"<stdin>\", line 1, in <module> \n NameError: name 'asf' is not defined"
      },
      priority: 0,
      link: "https://www.youtube.com/watch?v=fFPgZiS7uAM&list=RDfFPgZiS7uAM&start_radio=1&ab_channel=PAINHUB",
      seenBy: ["630eae4bbb909833559a7991"],
      date: new Date(),
    },
    {
      notification_type: "reminder",
      title: "Periodic Checking/Maintinance",
      message:
        "PHS software & hardware needs to be check to ensure the system functions well.",
      additional: {
        error_code: 0,
        severity: "low"
      },
      priority: 0,
      link: "https://www.youtube.com/watch?v=fFPgZiS7uAM&list=RDfFPgZiS7uAM&start_radio=1&ab_channel=PAINHUB",
      seenBy: ["630eae4bbb909833559a7996"],
      date: new Date(),
    },
 * 
 */

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
    },
  },

  priority: { type: Number, default: 0 },
  links: {
    type: mongoose.Mixed,
    default: [
      {
        link: "",
        link_short: "",
        link_mode: false,
      },
    ],
  },
  seenBy: { type: Array, default: [] },
  date: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.notification ||
  mongoose.model("notification", notificationSchema);
