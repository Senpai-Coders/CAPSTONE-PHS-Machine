import {
  COMPARE_PASSWORD,
  VERIFY_AUTHORIZATION,
  GENERATE_JWT,
  setCookie,
} from "../../../../helpers/api/index";
import dbConnect from "../../../../configs/dbConnection";
const cookie = require("cookie");
const configs = require("../../../../models/configs");

let ObjectId = require("mongoose").Types.ObjectId;

import logger from "../../../../services/logger";

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
    const { mode, _id, config_name, description, value } = req.body;

    if (mode === 0) {
      // gettingAllDbActions
      const actions = await configs.find({ category: "actions" });
      return res.status(200).json({ actions });
    } else if (mode === 1) {
      // check if action exist
      const isExist = await configs.findOne({ config_name });
      const isRelayUsed = await configs.findOne({
        config_name,
        "value.isUsed": true,
      });

      const insert = await configs.create({
        category: "actions",
        config_name,
        description,
        value,
        uby: editorDetails._id,
      });
      // insert

      logger.info(
        `User ${editorDetails.user_name}(${editorDetails._id}) -> Created new action`
      );
      hasUpdate(editorDetails);
    } else if (mode === 2) {
      const isExist = await configs.findOne({ config_name });

      if (isExist) {
        if (isExist._id.toString() !== _id)
          return res.status(409).json({ message: "Action name already exist" });
      }

      const updateRelay = await configs.updateOne(
        { _id },
        {
          $set: {
            config_name,
            description,
            value,
            uby: editorDetails._id,
          },
        }
      );

      logger.info(
        `User ${editorDetails.user_name}(${editorDetails._id}) -> Updated Action -> ${_id}`
      );
      hasUpdate(editorDetails);
    } else if (mode === -1) {
      const del = await configs.deleteOne({ config_name });
      logger.info(
        `User ${editorDetails.user_name}(${editorDetails._id}) -> Deleted Action -> ${config_name}`
      );
      hasUpdate(editorDetails);
    }

    res.status(200).json({ message: "Ok" });
  } catch (e) {
    logger.error(e.stack);
    res.status(500).json({
      message: "Internal Server Error 😥",
    });
  }
};

export default handler;
