import checkDiskSpace from "check-disk-space";
import dbConnect from "../../configs/dbConnection";
import NextCors from "nextjs-cors";
import logger from "../../services/logger";
import { PI_IP, dateToBeutify } from "../../helpers/api";

const detections = require("../../models/thermal_detection");
const configs = require("../../models/configs");

dbConnect();

const handler = async (req, res) => {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  const storageInfo = await checkDiskSpace("/");
  const perc = ((storageInfo.size - storageInfo.free) / storageInfo.size) * 100;
  const dets = await detections.find({}).sort({ cat: 1 }).limit(1);

  var focPath = dets[0].img_normal;
  var fslash = focPath.indexOf("/", 1);
  var sslash = focPath.indexOf("/", fslash + 1);
  var delFold = focPath.substring(fslash + 1, sslash);

  if (perc >= 95.0) {
    const update = await detections.deleteOne({
      _id: new ObjectId(dets[0]._id),
    });
    try {
      // sendEmail Alert only today
      var now = new Date();
      var starting = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const sentToday = await configs.find({
        config_name: "storage_alert_email",
        cat: { $gte: starting },
      });

      if (sentToday.length === 0) {
        // send mail and create marker when last email
        const deleteStorageMarkerEmail = await configs.deleteOne({
          config_name: "storage_alert_email",
        });

        const createStorageMarkerEmail = await configs.create({
          category: "config",
          config_name: "storage_alert_email",
          description:
            "This specify or identify what was the last email sent for storage full alert",
          value: new Date(),
          disabled: false,
          deletable: true,
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
          }), 
        });
      }

      const delRecrd = await fs.promises.rmdir(`public/detection/${delFold}`, {
        recursive: true,
      });
      logger.info(
        `Autodelte (exceed 95% free storage, deletion of old record must be done) -> Deleted detecion & it's data -> ${delFold}`
      );
    } catch (e) {
      logger.error(`Failed To Delete Folder -> , ${e.stack}`);
    }
  }

  res.status(200).json({ perc, canSave: perc < 95 });
};

export default handler;
