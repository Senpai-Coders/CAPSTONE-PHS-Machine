import { COMPARE_PASSWORD } from "../../../helpers/api"
import dbConnect from "../../../configs/dbConnection"
import user from "../../../models/user";

const users = require("../../../models/user")

dbConnect();

const handler = async(req, res) => {

    const DEFAULT_USERs = [
        {
            user_name : "Emp1",
            password : "$2a$10$Vl27DB4G4SrJp0YKpqmtl.q5vebNpHQy2StjA30Lw3DqRQjxFAlnK", // helloworld
            role : 1 // 3 -> Root, 2 -> Admin, 1 -> Employee, 0 -> Viewer
        }
    ]

    const DEFAULT_SETTINGS = [
        {}
    ]

    const resp = await users.insertMany(DEFAULT_USERs)
    

    res.status(200).json({
        status : "Initialized Db 👌",
        resp
    })
}

export default handler;