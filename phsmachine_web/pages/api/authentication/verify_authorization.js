import { VERIFY_AUTHORIZATION } from "../../../helpers/api/index";
import dbConnect from "../../../configs/dbConnection";
const users = require("../../../models/user");

dbConnect();

const handler = async (req, res) => {
  try {
    const { auth } = req.query;
    const data = VERIFY_AUTHORIZATION(auth);

    const updateLastSignInStamp = await users.updateOne(
      { _id: data._id },
      { $set: { last_active_date: new Date() } }
    );

    res.status(200).json({
      value: data !== false,
      data,
    });
  } catch (e) {
    res.status(500).json({
      value: false,
      message: "Error 😥",
    });
  }
};

export default handler;
