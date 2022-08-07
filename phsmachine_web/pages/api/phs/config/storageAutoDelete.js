import dbConnect from "../../../../configs/dbConnection";
import { VERIFY_AUTHORIZATION } from "../../../../helpers/api/index";

const configs = require("../../../../models/configs");
dbConnect();

const handler = async (req, res) => {
  try {
    const auth = req.cookies.authorization;
    const editorDetails = VERIFY_AUTHORIZATION(auth);

    const { mode, value } = req.body;
    let dataReturn = {};

    if (mode === 0) {
      let getStorage = await configs.findOne({
        category: "config",
        config_name: "storageAutoDelete",
      });
      dataReturn = getStorage;
    }

    if (mode === 1) {
      let updateStorage = await configs.updateOne({
        category: "config",
        config_name: "storageAutoDelete",
      }, {
        $set : {
            value
        }
      });
      dataReturn = { message: "ok" };
    }

    // set app config to forceUpdate(broadcast) all info in phs machine
    const updateStamp = `${new Date().valueOf()}`;
    const updatePHSSys = await configs.updateOne(
      { category: "update", config_name: "update_stamp" },
      {
        $set: {
          category: "update",
          config_name: "update_stamp",
          description: "This will update phs system infos forced",
          value: updateStamp,
          uby: editorDetails._id,
        },
      },
      { upsert: true }
    );

    res.status(200).json(dataReturn);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal Server Error 😥",
    });
  }
};

export default handler;
