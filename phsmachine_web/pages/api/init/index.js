import {
  readDefaults,
  writeError,
  removeErrorCode,
  deletePathOrFile,
  exec_command,
  PI_IP,
  dateToBeutify,
  VERIFY_AUTHORIZATION,
} from "../../../helpers/api";
import dbConnect from "../../../configs/dbConnection";

const users = require("../../../models/user");
const configs = require("../../../models/configs");
const detection = require("../../../models/thermal_detection");
const notification = require("../../../models/notification");

import logger from "../../../services/logger";

let ObjectId = require("mongoose").Types.ObjectId;

dbConnect();

const handler = async (req, res) => {
  const auth = req.cookies.authorization;
  const editorDetails = VERIFY_AUTHORIZATION(auth);

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
          link: `http://${PI_IP}:3001/#/_page_error_codes?id=error-code-1`,
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

    if (
      default_users ||
      settings ||
      detections ||
      notifications ||
      del_detect_files ||
      del_user_photos ||
      del_exports ||
      del_errors ||
      del_system_logs
    ) {
      let inits = "";
      if (default_users) inits += "Users~";
      if (settings) inits += "settings~";
      if (detections) inits += "Detections~";
      if (notifications) inits += "Notifications~";
      if (del_detect_files) inits += "Detections Raw Files~";
      if (del_user_photos) inits += "User photos~";
      if (del_exports) inits += "File Exports~";
      if (del_errors) inits += "Error logs~";
      if (del_system_logs) inits += "System Logs~";
      inits = inits.replaceAll("~", ", ");

      const callEmail = await fetch(`http:${PI_IP}:3000/api/sendMail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: 2,
          template_content: {
            user_id: editorDetails ? editorDetails._id : "N/A - System | Dev",
            user_name: editorDetails
              ? editorDetails.user_name
              : "N/A - System | Dev",
            reset_content: inits,
            time_string: dateToBeutify(new Date()),
          },
        }), // body data type must match "Content-Type" header
      });

      logger.info(
        `(Possible) Reset or Deletion of system state/settings/files -> ${editorDetails.user_name}(${editorDetails._id}) : Affected -> ${inits} `
      );

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

    let paths = [];

    if (del_detect_files)
      paths.push({ path: "public/detection", isFile: false });
    if (del_user_photos) paths.push({ path: "public/images", isFile: false });
    if (del_exports) paths.push({ path: "public/exports", isFile: false });
    if (del_errors)
      paths.push({
        path: "public/logs/error-logs.json",
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
      const del = await users.deleteMany({});
      const resp = await users.insertMany(DEFAULT_USERS);
    }

    if (settings) {
      const del2 = await configs.deleteMany({});
      const resp2 = await configs.insertMany(DEFAULT_CONFIGS);
    }

    if (detections) {
      const del3 = await detection.deleteMany({});
      const resp3 = await detection.insertMany(DEFAULT_DETECTS);
    }

    if (notifications) {
      const del4 = await notification.deleteMany({});
      const resp4 = await notification.insertMany(DEFAULT_NOTIFICATIONS);
    }

    res.status(200).json({ status: "Reset 👌" });
    if(!process.env.DEB){
        try {
            const response = await axios.get(
              `http://${PI_IP}:8000/shutdown_reboot?tostate=reboot`
            );
          } catch (e) {}
        await new Promise(resolve => setTimeout(resolve, 5000));
        let reboot = exec_command("sudo reboot now");
    }
  } catch (e) {
    console.log(e);
  }
};

export default handler;
