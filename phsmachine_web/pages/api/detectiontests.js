import dbConnect from "../../configs/dbConnection";
const detections = require("../../models/thermal_detection");
let ObjectId = require("mongoose").Types.ObjectId;
const fs = require("fs");

dbConnect();

const rand = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

const genRandomDate = (month, year, sday, eday, shour, ehour) => {
    let d = new Date(`${month}/${rand(sday, eday)}/${year}`)
    d.setHours(rand(shour, ehour),rand(0,59),rand(0,59),rand(0,999))
    return d;
}

const handler = async (req, res) => {
  try {
    console.log("Started")
    const dets = await detections.find({}, {_id : 1})

    const month = 11

    const startDate = 14;
    const endDate = 18;

    const startHour = 9;
    const endHour = 16;

    for(let x = 0; x < dets.length; x++){
        let d = genRandomDate(11, 2022, startDate, endDate, startHour, endHour)
        const upd = await detections.updateOne({_id : dets[x]._id}, {$set : {
            cat : d,
            uat : d
        }})
        console.log("\bUps "+dets[x]._id, upd)
    }

    return res.status(200).json("ok")
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error 😥" });
  }
};

export default handler;
