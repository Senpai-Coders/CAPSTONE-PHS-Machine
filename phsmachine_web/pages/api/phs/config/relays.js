import { COMPARE_PASSWORD, VERIFY_AUTHORIZATION, GENERATE_JWT, setCookie } from "../../../../helpers/api/index"
import dbConnect from "../../../../configs/dbConnection"
const cookie = require("cookie")
const configs = require('../../../../models/configs')


dbConnect();

const handler = async (req, res) => {
    try {
        const auth = req.cookies.authorization
        const editorDetails = VERIFY_AUTHORIZATION(auth)
        const { mode, config_name, description, GPIO_PIN } = req.body
        if (mode === 0){
            // check if relay exist

            const doesExist = await configs.findOne({ category : "relays", config_name })
            const gpioExist = await configs.findOne({  "value.GPIO_PIN" : GPIO_PIN  })
            if (doesExist || gpioExist)
                return res.status(409).json({
                    status : 409,
                    message : "Component Name or the GPIO_PIN is already in used"
                })

            const creation = await configs.create({
                category : "relays",
                config_name,
                description,
                value : {
                    isUsed : false,
                    GPIO_PIN
                },
                uby : editorDetails._id
            })

        }else if(mode === -1){
            const del = await configs.deleteOne({ config_name })
        }

		// set app config to forceUpdate all info in phs machine
		const updateStamp = `${new Date().valueOf()}`
		const updatePHSSys = await configs.updateOne({ category : 'update', config_name : 'update_stamp'}, { $set : { category : 'update', config_name : 'update_stamp', description : 'This will update phs system infos forced', value : updateStamp, uby : editorDetails._id }},{upsert : true})

        res.status(200).json({ message : "Ok"})
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Internal Server Error 😥"
        })
    }
}

export default handler;
