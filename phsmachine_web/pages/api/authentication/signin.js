import { COMPARE_PASSWORD } from "../../../Helpers/api/index"
import dbConnect from "../../../configs/dbConnection"

dbConnect();

const handler = async(req, res) => {
    let { username, password } = req.body

    // check if not exist


    // compare password


    // generate jwt token & send it as cookie


    res.status(200).json({})
}

export default handler;