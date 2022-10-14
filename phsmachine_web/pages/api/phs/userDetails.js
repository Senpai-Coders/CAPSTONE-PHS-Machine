import dbConnect from "../../../configs/dbConnection";
const users = require("../../../models/user");

import { VERIFY_AUTHORIZATION } from "../../../helpers/api";
import logger from "../../../services/logger";

dbConnect();

const handler = async (req, res) => {
  try {
    const token = req.cookies.authorization;
    let { _id } = req.body;

    if (!token) res.status(401).json({ message: "No token provided" });

    if (!_id) {
      let tokenPayload = VERIFY_AUTHORIZATION(token);
      _id = tokenPayload._id;
    }

    let userData = {};

    userData = await users.findOne({ _id });

    res.status(200).json({ userData });
  } catch (e) {
    logger.error(e.stack);
    res.status(500).json({
      message: "Internal Server Error 😥",
    });
  }
};

export default handler;
