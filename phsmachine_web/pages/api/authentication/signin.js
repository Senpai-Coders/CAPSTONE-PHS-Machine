import { COMPARE_PASSWORD, GENERATE_JWT } from "../../../helpers/api/index";
import dbConnect from "../../../configs/dbConnection";
const cookie = require("cookie");
const users = require("../../../models/user");

import logger from "../../../services/logger";

dbConnect();

const handler = async (req, res) => {
  try {
    let { username, password } = req.body;

    let USER = await users.findOne({ user_name: username }).lean();
    logger.info(`Attempt signin -> ${username}`);

    // check if not exist
    if (!USER) {
      logger.error(`User does not exist in database -> ${username}`);
      return res.status(404).json({
        error: 404,
        message: "Sorry but you are not in our database.",
      });
    }

    const PASSWORD = USER.password;

    // convert it to an object & remove password hash
    USER = { ...USER };
    delete USER.password;

    // compare password
    if (!(await COMPARE_PASSWORD(PASSWORD, password))) {
      logger.error(`Password not match for -> ${username}`);
      return res.status(404).json({
        error: 403,
        message: "Sorry but you entered a wrong password",
      });
    }

    const JWT = GENERATE_JWT(USER);
    const updateLastSignIn = await users.updateOne(
      { _id: USER._id },
      {
        $set: {
          sign_in: new Date(),
        },
        $inc: {
          login_count: 1,
        },
      }
    );

    //create a COOKIE
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("authorization", JWT, {
        httpOnly: true,
        maxAge: Number.parseInt(process.env.EXPIRATION),
        sameSite: "strict",
        path: "/",
      })
    );
    logger.info(`Authorization given to -> ${username} -> Signed in`);
    res.status(200).json(JWT);
  } catch (e) {
    logger.error(e.stack);
    res.status(500).json({
      message: "Error 😥",
    });
  }
};

export default handler;
