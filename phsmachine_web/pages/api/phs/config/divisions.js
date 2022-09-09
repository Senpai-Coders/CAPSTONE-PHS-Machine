import { VERIFY_AUTHORIZATION } from "../../../../helpers/api/index";
import dbConnect from "../../../../configs/dbConnection";
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

    var toRet = { message: "Ok" };

    if (mode === 0) {
      // check if action exist
      const data = await configs.findOne({
        category: "config",
        config_name: "divisions",
      });
      toRet = data;
      // update relay to use
    } else if (mode === 1) {
      // gettingAllDbActions
      const data = await configs.updateOne(
        { config_name: "divisions" },
        { $set: { value } }
      );
      toRet = data;
      hasUpdate(editorDetails);
    }

    res.status(200).json(toRet);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal Server Error 😥",
    });
  }
};

export default handler;
