import dbConnect from "../../../configs/dbConnection";
const users = require("../../../models/user");

import { HASH_PASSWORD } from "../../../helpers/api/index";

dbConnect();

const handler = async (req, res) => {
  try {
    const { updates, _id, mode, hasNewPassword, old_u_name } = req.body;
    let action = {};
    if (mode === -1) {
      action = await users.deleteOne({ _id });
    } else if (mode === 1) {
      let up_userName = updates.user_name;

      if( up_userName && up_userName !== old_u_name ){

        if( up_userName.length === 0 )
            return res.status(400).json({error : 400, message : "Username must not be empty"})

        const hasDuplicate = await users.find({ user_name : up_userName}) 
        if( hasDuplicate.length > 0 )
            return res.status(409).json({error : 409, message : "User Already Exist With That Username"})
      }

      if (!hasNewPassword)
        action = await users.updateOne({ _id }, { $set: { ...updates } });
      else {
        let up_password = await HASH_PASSWORD(updates.password);

        action = await users.updateOne(
          { _id },
          { $set: { user_name: up_userName, password: up_password } }
        );
      }
    } else if (mode === 0) {
      const genNum = Math.floor(Math.random() * 10000000);
      const user_name = `New User ${genNum}`;
      const pass = await HASH_PASSWORD(`New User ${genNum}`);
      action = await users.create({ user_name, password: pass, role: 0 });
    }

    res.status(200).json({ status: "ok" });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal Server Error 😥",
    });
  }
};

export default handler;
