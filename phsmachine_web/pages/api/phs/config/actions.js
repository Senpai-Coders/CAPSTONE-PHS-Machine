import { COMPARE_PASSWORD, VERIFY_AUTHORIZATION, GENERATE_JWT, setCookie } from "../../../../helpers/api/index"
import dbConnect from "../../../../configs/dbConnection"
const cookie = require("cookie")
const configs = require('../../../../models/configs')


dbConnect();

const handler = async (req, res) => {
    try {
        const auth = req.cookies.authorization
        const editorDetails = VERIFY_AUTHORIZATION(auth)
        const { mode, config_name, description, target_relay, duration, caller } = req.body
        if (mode === 0){
            // check if action exist
            const isExist = await configs.findOne({ config_name })
            const isRelayUsed = await configs.findOne( { config_name, "value.isUsed" : true })
            // check if relay in use

            if( isExist ) return res.status(409).json({ message : "Action name already exist"})
            if( isRelayUsed ) return res.status(409).json({ message : "Relay is already used by other actions"})

            const insert = await configs.create({category : 'actions',config_name, description, value : { target_relay, duration, caller }, uby : editorDetails._id})
            // insert

            const upconf = await configs.updateOne({ config_name : target_relay }, {$set : { "value.isUsed" : false , uby : editorDetails._id}})
            // update relay to use

        }else if(mode === -1){
            const del = await configs.deleteOne({ config_name })

            const updateRelay = await configs.updateOne({ config_name : target_relay }, { $set : {
                "value.isUsed" : false, uby : editorDetails._id
            }})
            // update relay to unused
        }

        res.status(200).json({ message : "Ok"})
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Internal Server Error 😥"
        })
    }
}

export default handler;