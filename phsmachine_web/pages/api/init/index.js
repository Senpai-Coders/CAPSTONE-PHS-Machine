import {
  readDefaults,
  writeError,
  removeErrorCode,
  deletePathOrFile,
  exec_command,
} from "../../../helpers/api";
import dbConnect from "../../../configs/dbConnection";

const users = require("../../../models/user");
const configs = require("../../../models/configs");
const detection = require("../../../models/thermal_detection");
const notification = require("../../../models/notification");

let ObjectId = require("mongoose").Types.ObjectId;

dbConnect();

const handler = async (req, res) => {
  const defs = await readDefaults();

  if (!defs) {
    writeError({
      notification_type: "error",
      title: "Can't load PHS default file",
      message:
        "Can't load PHS default file at phsmachine_web/defaults/phsV1Defaults.json. Please check the file or read the manual on the link bellow",
      priority: 0,
      additional: {
        error_code: -1,
        severity: "high",
        error_log:
          "PHS Default file is not loaded. \n PHS default file at phsmachine_web/defaults/phsV1Defaults.json",
      },
      links: [
        {
          link: "https://www.youtube.com/watch?v=fFPgZiS7uAM&list=RDfFPgZiS7uAM&start_radio=1&ab_channel=PAINHUB",
          link_short: "",
          link_mode: false,
        },
      ],
      seenBy: [],
      date: new Date(),
    });

    return res.status(404).json({
      message: "Failed to load phs default",
    });
  } else {
    removeErrorCode(-1);
  }

  let {
    DEFAULT_USERS,
    DEFAULT_CONFIGS,
    DEFAULT_DETECTS,
    DEFAULT_NOTIFICATIONS,
  } = defs;

  DEFAULT_NOTIFICATIONS = DEFAULT_NOTIFICATIONS.map((ntf) => {
    return { ...ntf, date: new Date() };
  });

  try {
    const {
      default_users,
      settings,
      detections,
      notifications,
      del_detect_files,
      del_user_photos,
      del_exports,
      del_errors,
      del_system_logs,
    } = req.body;

    let paths = [];

    console.log("Reset PHS system -> Factory Default");

    if (del_detect_files)
      paths.push({ path: "public/detection", isFile: false });
    if (del_user_photos) paths.push({ path: "public/images", isFile: false });
    if (del_exports) paths.push({ path: "public/exports", isFile: false });
    if (del_errors)
      paths.push({
        path: "logs/error-logs.json",
        isFile: true,
        defaultValue: JSON.stringify([]),
      });
    if (del_system_logs)
      paths.push({
        path: "public/logs/core",
        isFile: false,
        defaultValue: "[PHS WEB LOG FILE]",
      });
    if (del_system_logs)
      paths.push({
        path: "public/logs/web",
        isFile: false,
        defaultValue: "[PHS CORE LOG FILE]",
      });

    paths = deletePathOrFile(paths);

    if (default_users) {
      console.log("init users");
      const del = await users.deleteMany({});
      const resp = await users.insertMany(DEFAULT_USERS);
    }

    if (settings) {
      console.log("init conf");
      const del2 = await configs.deleteMany({});
      const resp2 = await configs.insertMany(DEFAULT_CONFIGS);
    }

    if (detections) {
      console.log("init det");
      const del3 = await detection.deleteMany({});
      const resp3 = await detection.insertMany(DEFAULT_DETECTS);
    }

    if (notifications) {
      console.log("init notifications");
      const del4 = await notification.deleteMany({});
      const resp4 = await notification.insertMany(DEFAULT_NOTIFICATIONS);
    }

    if (default_users || settings || detections || notifications) {
      let inits = "";
      if (default_users) inits += "Users ";
      if (settings) inits += "settings ";
      if (detections) inits += "Detections ";
      if (notifications) inits += "Notifications ";
      inits = inits.replace(/\s/g, ", ");

      const notify_reset = await notification.create({
        notification_type: "notify",
        title: "PHS reset completed",
        message: `Reset for ${inits} to PHS factory default is completed`,
        priority: 0,
        links: [],
        seenBy: [],
        date: new Date(),
      });
    }

    res.status(200).json({ status: "Reset 👌" });
    //TODO: let reboot = exec_command("sudo reboot now");
  } catch (e) {
    console.log(e);
  }
};

export default handler;
