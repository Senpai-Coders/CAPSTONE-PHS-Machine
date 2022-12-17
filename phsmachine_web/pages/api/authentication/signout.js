const cookie = require("cookie");
import logger from "../../../services/logger";

const handler = async (req, res) => {
  try {
    //create a COOKIE
    res.setHeader(
      "Set-Cookie",
      cookie.serialize(
        "authorization",
        {},
        {
          httpOnly: true,
        //   secure: process.env.NODE_ENV !== "development",
          expires: new Date(0),
          sameSite: "strict",
          path: "/",
        }
      )
    );
    logger.info(`Signed Out User `);
    res.status(200).json({ message: "Signed Out 👌" });
  } catch (e) {
    logger.error(e.stack);
    res.status(500).json({
      message: `Internal Server Error 😥`,
    });
  }
};

export default handler;
