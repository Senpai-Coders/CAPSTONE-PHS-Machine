import { GET_SERVER_IP } from "../../helpers/api"

import dbConnect from "../../configs/dbConnection";
const configs = require("../../models/configs");

dbConnect();

const handler = async (req, res) => {
    let IP = GET_SERVER_IP()

    const serverInfo = await configs.findOne({ config_name : 'identity' })

    res.status(200).json({
        connectivity : "ok", 
        ...serverInfo.value,
        ip : IP, 
        url : `http://${IP}:3000`,
        core_ip : IP,
        core_url : `http://${IP}:8000`
    });
};

export default handler;
