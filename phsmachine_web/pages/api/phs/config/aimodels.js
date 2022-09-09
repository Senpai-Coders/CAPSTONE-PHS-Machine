import { VERIFY_AUTHORIZATION } from "../../../../helpers/api/index";
import dbConnect from "../../../../configs/dbConnection";
const configs = require("../../../../models/configs");

dbConnect();

const handler = async (req, res) => {
  try {
    const auth = req.cookies.authorization;
    const editorDetails = VERIFY_AUTHORIZATION(auth);
    const { mode, search, changes } = req.body;
    if (mode === 0) {
      const models = await configs.find({ ...search });
      return res.status(200).json(models);
    } else if (mode === 1) {
      const models = await configs.updateOne(
        { ...search },
        { $set: { ...changes } }
      );
      return res.status(200).json(models);
    } else if (mode === -1) {
      const del = await configs.deleteOne({ ...search });
    }

    res.status(200).json({ message: "Ok" });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal Server Error 😥",
    });
  }
};

export default handler;
