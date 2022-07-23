import dbConnect from "../../../configs/dbConnection";
const users = require("../../../models/user");

dbConnect();

const handler = async (req, res) => {
  try {
    const token = req.cookies.authorization;
    const { _id } = req.body;
    let userData = {};

    if (!_id) {
      let base64Url = token.split(".")[1];
      let base64 = base64Url.replace("-", "+").replace("_", "/");
      let curUserPayload = JSON.parse(atob(base64));

      userData = await users.findOne({ _id: curUserPayload._id });
    } else userData = await users.findOne({ _id });

    res.status(200).json({ userData });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal Server Error 😥",
    });
  }
};

export default handler;
