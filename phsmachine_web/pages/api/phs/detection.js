import dbConnect from "../../../configs/dbConnection";
const cookie = require("cookie");
const users = require("../../../models/user");
const detections = require("../../../models/thermal_detection");
let ObjectId = require("mongoose").Types.ObjectId;
const fs = require("fs");

import { ToExcel, ToCsv, ToZip } from "../../../helpers/api";

dbConnect();

const handler = async (req, res) => {
  try {
    const { mode, detection_id, updates, path, toExport } = req.body;
    if (mode === 0) {
      const detData = await detections.find({});
      return res.status(200).json({ detection_data: detData });
    } else if (mode === 1) {
      const detection_info = await detections.findOne({
        _id: new ObjectId(detection_id),
      });
      if (!detection_info)
        return res.status(404).json({ message: "Detection Doesn't Exist" });
      return res.status(200).json({ detection_data: detection_info });
    } else if (mode === 2) {
      const update = await detections.updateOne(
        { _id: new ObjectId(detection_id) },
        {
          $set: {
            ...updates,
          },
        }
      );
      return res.status(200).json({
        message: "Updated!",
      });
    } else if (mode === 3) {
      const past_detect = await detections
        .find({})
        .sort({ img_normal: -1 })
        .limit(10);
      res.status(200).json({ detections: past_detect });
    } else if (mode === -1) {
      const update = await detections.deleteOne({
        _id: new ObjectId(detection_id),
      });
      fs.rmdir(`public/detection/${path}`, { recursive: true }, (err) => {
        if (err) console.log("Err deletion of folder record", err);
        else console.log("deleted successfuly");
      });
      return res.status(200).json({ message: "Deleted!" });
    } else if (mode === -2) {
      const { ids } = req.body;
      for (var x = 0; x < ids.length; x++) {
        const update = await detections.deleteOne({
          _id: new ObjectId(ids[x].id),
        });
        fs.rmdir(
          `public/detection/${ids[x].path}`,
          { recursive: true },
          (err) => {
            if (err) console.log("Err deletion of folder record", err);
            else console.log("deleted successfuly");
          }
        );
      }

      return res.status(200).json({ message: "Deleted!" });
    } else if (mode === 4) {
      const { toExcel, toCsv, toZip } = toExport;
      let links = [];

      const data = await detections.find({});

      if (toExcel) {
        let parsedData = [];

        data.forEach((data) => {
          parsedData.push({
            "Detection Date": new Intl.DateTimeFormat("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            }).format(new Date(data.cat)),
            "Time Occured": new Date(data.cat).toLocaleTimeString(),
            "Seen Pig(s)": data.data.pig_count,
            "Stressed Pig(s)": data.data.stressed_pig,
            "Min Temperature": data.data.min_temp.toFixed(2),
            "Average Temperature": data.data.avg_temp.toFixed(2),
            "Maximum Temperature": data.data.max_temp.toFixed(2),
            "Actions Performed": data.actions.length,
            "Raw Data Directory": data.img_normal.substring(
              data.img_normal.indexOf("/Dete") + 1,
              43
            ),
          });
        });

        const fileUrl = await ToExcel(parsedData);
        if (fileUrl.length > 0)
          links.push({ name: "Excel File", type: "xlsx", link: fileUrl });
        console.log("Exported -> xlsx ");
      }

      if (toCsv) {
        let parsedData = [];

        data.forEach((data) => {
          parsedData.push({
            "Detection Date": new Intl.DateTimeFormat("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            }).format(new Date(data.cat)),
            "Time Occured": new Date(data.cat).toLocaleTimeString(),
            "Seen Pig(s)": data.data.pig_count,
            "Stressed Pig(s)": data.data.stressed_pig,
            "Min Temperature": data.data.min_temp.toFixed(2),
            "Average Temperature": data.data.avg_temp.toFixed(2),
            "Maximum Temperature": data.data.max_temp.toFixed(2),
            "Actions Performed": data.actions.length,
            "Raw Data Directory": data.img_normal.substring(
              data.img_normal.indexOf("/Dete") + 1,
              43
            ),
          });
        });

        const fileUrl = await ToCsv(parsedData);
        if (fileUrl.length > 0)
          links.push({ name: "CSV File", type: "csv", link: fileUrl });
        console.log("Exported -> csv ");
      }

      if (toZip) {
        const fileUrl = await ToZip("public/detection");
        if (fileUrl.length > 0)
          links.push({ name: "Zip File", type: "zip", link: fileUrl });
        console.log("Exported -> zip ");
      }

      res
        .status(200)
        .json({ downloadLinks: links.filter((ln) => ln.link.length > 0) });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error 😥" });
  }
};

export default handler;
