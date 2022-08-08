import {
  COMPARE_PASSWORD,
  VERIFY_AUTHORIZATION,
  GENERATE_JWT,
  setCookie,
} from "../../../../helpers/api/index";
import dbConnect from "../../../../configs/dbConnection";
const cookie = require("cookie");
const configs = require("../../../../models/configs");

dbConnect();

const handler = async (req, res) => {
  try {
    const auth = req.cookies.authorization;
    const editorDetails = VERIFY_AUTHORIZATION(auth);
    const {
      mode,
      old_config_name,
      config_name,
      description,
      target_relay,
      old_target_relay,
      duration,
      caller,
      eventLocation
    } = req.body;
    if (mode === 0) {
      // check if action exist
      const isExist = await configs.findOne({ config_name });
      const isRelayUsed = await configs.findOne({
        config_name,
        "value.isUsed": true,
      });
      // check if relay in use

      if (isExist)
        return res.status(409).json({ message: "Action name already exist" });
      if (isRelayUsed)
        return res
          .status(409)
          .json({ message: "Relay is already used by other actions" });

      const insert = await configs.create({
        category: "actions",
        config_name,
        description,
        value: { target_relay, duration, caller, eventLocation : eventLocation? eventLocation : -1 },
        uby: editorDetails._id,
      });
      // insert

      const upconf = await configs.updateOne(
        { config_name: target_relay },
        { $set: { "value.isUsed": true, uby: editorDetails._id } }
      );
      // update relay to use
    } else if (mode === -1) {
      const del = await configs.deleteOne({ config_name });

      // update relay to unused
      const updateRelay = await configs.updateOne(
        { config_name: target_relay },
        {
          $set: {
            "value.isUsed": false,
            uby: editorDetails._id,
          },
        }
      );
    } else if (mode === 2) {
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
      // check if relay in use

      if (isExist)
        return res.status(409).json({ message: "Action name already exist" });
      if (isRelayUsed)
        return res
          .status(409)
          .json({ message: "Relay is already used by other actions" });

      const insert = await configs.updateOne(
        { config_name: old_config_name },
        {
          $set: {
            category: "actions",
            config_name,
            description,
            value: { target_relay, duration, caller, eventLocation : eventLocation? eventLocation : -1 },
            uby: editorDetails._id,
          },
        }
      );

      console.log( config_name, old_config_name ,insert, eventLocation)

      // insert
      const upconf = await configs.updateOne(
        { config_name: target_relay },
        { $set: { "value.isUsed": true, uby: editorDetails._id } }
      );

      if (old_target_relay !== target_relay) {
        const upconf2 = await configs.updateOne(
            { config_name: old_target_relay },
            { $set: { "value.isUsed": false, uby: editorDetails._id } }
          );
      }
      // update relay to use
    }

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

    res.status(200).json({ message: "Ok" });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal Server Error 😥",
    });
  }
};

export default handler;
