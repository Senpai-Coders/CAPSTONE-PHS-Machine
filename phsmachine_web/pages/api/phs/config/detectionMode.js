import dbConnect from "../../../../configs/dbConnection";
import { VERIFY_AUTHORIZATION } from "../../../../helpers/api/index";

const configs = require("../../../../models/configs");
dbConnect();

const hasUpdate = async (editorDetails) => {
  // set app config to forceUpdate all info in phs machine
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
    }
  );
};

const handler = async (req, res) => {
  try {
    const auth = req.cookies.authorization;
    const editorDetails = VERIFY_AUTHORIZATION(auth);

    const { mode, value } = req.body;
    let dataReturn = {};

    if (mode === 0) {
      let getConfig = await configs.findOne({
        category: "config",
        config_name: "DetectionMode",
      });
      dataReturn = getConfig;
    }

    if (mode === 1) {
      let configUpdate = await configs.updateOne(
        { category: "config", config_name: "DetectionMode" },
        {
          $set: { value },
        }
      );
      hasUpdate(editorDetails);
      dataReturn = { message: "ok" };
    }

    res.status(200).json(dataReturn);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal Server Error 😥",
    });
  }
};

export default handler;
