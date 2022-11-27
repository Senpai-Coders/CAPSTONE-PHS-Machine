import checkDiskSpace from "check-disk-space";
import { GET_SERVER_IP, VERSION, PI_IP, dateToBeutify } from "../../helpers/api";
import dbConnect from "../../configs/dbConnection";
import NextCors from "nextjs-cors";

const configs = require("../../models/configs");
const notifications = require("../../models/notification");

dbConnect();

const handler = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  let IP = GET_SERVER_IP();

  let serverInfo = await configs.findOne({ config_name: "identity" });

  if(!serverInfo){
    const dbInitialized = await fetch(`http:${PI_IP}:3000/api/init/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            default_users : true,
            settings : true,
            detections : true,
            notifications : true,
            del_detect_files : true,
            del_user_photos : true,
            del_exports : true,
            del_errors : true,
            del_system_logs : true,
          }),
      });
  }

  const storageInfo = await checkDiskSpace("/");
  let storage = {
    ...storageInfo,
    perc: ((storageInfo.size - storageInfo.free) / storageInfo.size) * 100,
    canSave:
      ((storageInfo.size - storageInfo.free) / storageInfo.size) * 100 < 95,
  };

  if (!storage.canSave) {
    const findSameError = await notifications.findOne({ notification_type : "error", "additional.error_code" : 3 })
    if(!findSameError){
        const createNew = await notifications.create({
        notification_type: "error",
        title: "Storage Space Warning",
        message: "Seems like PHS can't save information about the detections because the system storage usage is more than 95%, but the system can still run the actions to resolve heatstress. please free up space in order for phs to save informations. You can read how to free up space on the manual below.",
        priority: 0,
        links: [
            {
            link: `http://${PI_IP}:3001/`,
            link_short: "",
            link_mode: false,
            },
        ],
        additional: {
            error_code: 3,
            severity: "medium",
            error_log: "Error : Storage usage exceeds 95%",
        },
        seenBy: [],
        date: new Date(),
        });
        
        const sendMails = await fetch(`http:${PI_IP}:3000/api/sendMail`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: 3,
              template_content: {
                time_string: dateToBeutify(new Date()),
              },
            }), // body data type must match "Content-Type" header
          });
    }
  }

  res.status(200).json({
    connectivity: "ok",
    ...serverInfo.value,
    ip: IP,
    url: `http://${IP}:3000`,
    core_ip: IP,
    core_url: `http://${IP}:8000`,
    version: VERSION,
    storage,
  });
};

export default handler;
