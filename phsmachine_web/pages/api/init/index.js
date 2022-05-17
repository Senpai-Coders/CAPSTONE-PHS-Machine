import { COMPARE_PASSWORD } from "../../../helpers/api"
import dbConnect from "../../../configs/dbConnection"

const users = require("../../../models/user")
const configs = require("../../../models/configs")

let ObjectId = require("mongoose").Types.ObjectId;

dbConnect();

const handler = async(req, res) => {

    const DEFAULT_USERs = [
        {
            user_name : "PHS_SYSTEM_V1",
            password : "$2a$10$Vl27DB4G4SrJp0YKpqmtl.q5vebNpHQy2StjA30Lw3DqRQjxFAlnK", // helloworld
            role : 3 // 3 -> Root, 2 -> Admin, 1 -> Employee, 0 -> Viewer
        },
        {
            user_name : "Emp1",
            password : "$2a$10$Vl27DB4G4SrJp0YKpqmtl.q5vebNpHQy2StjA30Lw3DqRQjxFAlnK", // helloworld
            role : 1 // 3 -> Root, 2 -> Admin, 1 -> Employee, 0 -> Viewer
        }
    ]

    const DEFAULT_CONFIGS = [
        {
            category : "app_state",
            config_name : "system_state",
            description : "This indicate what the system is currently up to",
            value : {
                status : "Detecting", // Detecting, Resolving, Debugging
                active_actions : "None", // None, Misting, Fan
                lighting : "Off", // On, Off
                pig_count : 0, // count of pigs on frame,
                stressed_pigcount : 0, // count of pigs on frame that are stressed,
                max_temp : 38.5, // max pig temp recorded (realtime)
                average_temp : 36.4 , // average pig temp (realtime)
                min_temp : 34.5, // min pig temp (realtime)
            },
            uby : new ObjectId("6277e36f94637471bdabb80d")
        },{
            category : "actions",
            config_name : "Mist",
            description : "This will be utilized by the AI",
            value : {
                duration : 1, // Duration this device will be on
                target_io : "relay_1", // relay_1 to relay_3
            },
            disabled : false,
            uby : new ObjectId("6277e36f94637471bdabb80d")
        },
    ]

    const del = await users.deleteMany({})
    const del2 = await configs.deleteMany({})

    const resp = await users.insertMany(DEFAULT_USERs)
    const resp2 = await configs.insertMany(DEFAULT_CONFIGS)
    
    res.status(200).json({
        status : "Initialized Db 👌",
        resp
    })
}

export default handler;