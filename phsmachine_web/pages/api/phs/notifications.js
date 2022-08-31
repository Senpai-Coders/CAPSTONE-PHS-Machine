import { VERIFY_AUTHORIZATION } from "../../../helpers/api/index";
import dbConnect from "../../../configs/dbConnection";
const notifications = require("../../../models/notification");

dbConnect();

const handler = async (req, res) => {
  try {
    const auth = req.cookies.authorization;
    const editorDetails = VERIFY_AUTHORIZATION(auth);
    const { mode, ids } = req.body;

    if(mode === 0){
        const data = await notifications.find({})

        let toRet = []
        let unreads = 0

        data.forEach((notifs)=>{
            var focused = notifs.toObject()
            var seen = false

            for(var x = 0; x < focused.seenBy.length; x++){
                var focId = focused.seenBy[x]
                if(`${focId}` === editorDetails._id){
                    seen = true;
                    break
                }
            }
            
            toRet.push({ ...focused, isMarkedSeen : seen })

            if(!seen) unreads += 1
        })

        return res.status(200).json({ notifications : toRet, unreads })
    }

    if(mode === 1){ // add user id to read
        const data = await notifications.updateMany({ _id : { $in : [ids] } }, {
            $push : {
                seenBy : editorDetails._id
            }
        })
        return res.status(200).json({ notifications : data })
    }

    if(mode === -2){ // delete all
        const data = await notifications.deleteMany({})
        return res.status(200).json({ message : "deleted all"})
    }

    return res.status(200).json({
        notifications : [] 
    })
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "",
    });
  }
};

export default handler;
