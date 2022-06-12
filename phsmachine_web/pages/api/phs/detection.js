import { COMPARE_PASSWORD, GENERATE_JWT, setCookie } from "../../../helpers/api/index"
import dbConnect from "../../../configs/dbConnection"
const cookie = require("cookie")
const users = require('../../../models/user')
const detections = require('../../../models/thermal_detection')
let ObjectId = require("mongoose").Types.ObjectId;
const fs = require('fs')

dbConnect();

const handler = async (req, res) => {
    try {
        const { mode, detection_id, updates, path } = req.body
        if(mode === 0) {
            const detData = await detections.find({})
            return res.status(200).json({ detection_data : detData })
        }else if(mode === 1){
            const detection_info = await detections.findOne({ _id : new ObjectId(detection_id) })
            if( !detection_info ) return res.status(404).json({ message : "Detection Doesn't Exist" })
            return res.status(200).json({ detection_data : detection_info })
        }else if(mode === 2){
            const update = await detections.updateOne({ _id : new ObjectId(detection_id)},{
                $set : {
                    ...updates
                }
            })
            return res.status(200).json({
                message : "Updated!"
            })
        }else if(mode === -1){
            const update = await detections.deleteOne({ _id : new ObjectId(detection_id)})
            fs.rmdir(`public/detection/${path}`, { recursive: true }, (err)=>{
                if(err)
                    console.log("Err deletion of folder record", err)
                else
                    console.log("deleted successfuly")
            })
            return res.status(200).json({ message : "Deleted!" })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Internal Server Error 😥" })
    }
}

export default handler;