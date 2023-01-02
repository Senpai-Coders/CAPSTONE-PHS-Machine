import checkDiskSpace from "check-disk-space";
import {
  GET_SERVER_IP,
  VERSION,
  bytesToMegaBytes,
  mbToGB,
  getPercentUsage,
  dateToBeutify
} from "../../helpers/api";
import dbConnect from "../../configs/dbConnection";
import NextCors from "nextjs-cors";

import logger from "../../services/logger";

const configs = require("../../models/configs");
const users = require("../../models/user");

const sendEmail = require("../../helpers/api/emailer");

dbConnect();

const handler = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  let IP = GET_SERVER_IP();

  const { type, template_content } = req.body;

  const serverInfo = await configs.findOne({ config_name: "identity" });
  const storage = await checkDiskSpace("/");

  const used_storage = (
    mbToGB(bytesToMegaBytes(storage.size)) -
    mbToGB(bytesToMegaBytes(storage.free))
  ).toFixed(1);
  const free_storage = mbToGB(bytesToMegaBytes(storage.free)).toFixed(1);
  const total_storage_size = mbToGB(bytesToMegaBytes(storage.size)).toFixed(1);
  const percentage_storage = getPercentUsage(
    total_storage_size,
    used_storage
  ).toFixed(1);

  const systemInfo = {
    connectivity: "ok",
    ...serverInfo.value,
    ip: IP,
    url: `http://${IP}:3000`,
    core_ip: IP,
    core_url: `http://${IP}:8000`,
    version: VERSION,
    storage,

    used_storage,
    free_storage,
    total_storage_size,
    percentage_storage,
  };

  let toSend = { ...template_content, ...systemInfo };
  toSend.time_string = dateToBeutify(new Date())

  if(type !== 0){
    const notifyUsers = await users.find({ toNotify: true });
    logger.info(`Email Broadcast Notification ->  type : ${type}`);
    notifyUsers.forEach((u, i) => {
        if (type === 1) {
            toSend.template_name = "DetectedHeatStress.html"; //user_name heat_stress_count action_count detection_id //time_string
            toSend.subject = `Hi${u.user_name}, Heatstressed pig detected.`;
            toSend.user_name = u.user_name
        }
        if (type === 2){
            toSend.template_name = "ResetAlert.html"; // user_name reset_content user_id time_string
            toSend.subject = `Hi${u.user_name}, Reset on PHS occured`;
        }
        if (type === 3){
            toSend.template_name = "StorageAlert.html"; //
            toSend.subject = `Hi${u.user_name}, Storage space alert`;
        }
        if (type === 4){
            toSend.template_name = "RemindMaintinance.html"; //
            toSend.subject = `Hi${u.user_name}, Today is the day for PHS monthly maintinance`;
        }
        sendEmail(u.email, toSend);
    });
  }else{
    toSend.template_name = "EnabledNotification.html"; //
    toSend.subject = `Hi${toSend.user_name}, You enabled notification to your email`;
    sendEmail(toSend.email, toSend);
  }

  res.status(200).json({ sent: "ok" });
};

export default handler;
