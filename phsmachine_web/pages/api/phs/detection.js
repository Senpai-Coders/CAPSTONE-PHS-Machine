import { COMPARE_PASSWORD, GENERATE_JWT, setCookie } from "../../../helpers/api/index"
import dbConnect from "../../../configs/dbConnection"
const cookie = require("cookie")
const users = require('../../../models/user')
const detections = require('../../../models/thermal_detection')

dbConnect();

const handler = async (req, res) => {
    try {
        const { mode, detection_id } = req.body
        if(mode === 0) {
            const detData = await detections.find({})
            return res.status(200).json({ detection_data : detData })
        }else if(mode === 1){
            const detection_info = await detections.findOne({ detection_id })
            if( !detection_info ) return res.status(404).json({ message : "Detection Doesn't Exist" })
            return res.status(200).json({ detection_data : detection_info })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Internal Server Error 😥" })
    }
}

export default handler;