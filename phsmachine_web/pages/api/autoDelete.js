import checkDiskSpace from "check-disk-space";
import dbConnect from "../../configs/dbConnection";
import NextCors from "nextjs-cors";
const fs = require("fs");
import logger from "../../services/logger";
let ObjectId = require("mongoose").Types.ObjectId;

const detections = require("../../models/thermal_detection");

dbConnect();

const handler = async (req, res) => {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  const storageInfo = await checkDiskSpace("/");
  const perc = ((storageInfo.size - storageInfo.free) / storageInfo.size) * 100;
  const dets = await detections.find({}).sort({cat:1}).limit(1)

  var focPath = dets[0].img_normal;
  var fslash = focPath.indexOf("/", 1);
  var sslash = focPath.indexOf("/", fslash + 1);
  var delFold = focPath.substring(fslash + 1, sslash);

  if (perc >= 95.0) {
    const update = await detections.deleteOne({ _id: new ObjectId(dets[0]._id) });
    try {
      const delRecrd = await fs.promises.rmdir(`public/detection/${delFold}`, { recursive: true });
      logger.info(`Autodelte (exceed 95% free storage, deletion of old record must be done) -> Deleted detecion & it's data -> ${delFold}`);
    } catch (e) {
      logger.error(`Failed To Delete Folder -> , ${e.stack}`);
    }
  }

  res.status(200).json({ perc, isSafe : perc < 95 });
};

export default handler;
