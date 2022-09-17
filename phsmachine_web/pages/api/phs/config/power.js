import { exec_command, VERIFY_AUTHORIZATION } from "../../../../helpers/api";
import logger from "../../../../services/logger";

const handler = async (req, res) => {
  try {
    const auth = req.cookies.authorization;
    const editorDetails = VERIFY_AUTHORIZATION(auth);
    const { mode } = req.body;

    if (mode === 0) {
      const shutdown = await exec_command("sudo shutdown now");
      logger.info(
        `User ${editorDetails.user_name}(${editorDetails._id}) -> Shutdown System`
      );
    } else if (mode === 1) {
      const reboot = await exec_command("sudo reboot now");
      logger.info(
        `User ${editorDetails.user_name}(${editorDetails._id}) -> Restart System`
      );
    }
    res.status(200).json({ message: "Done" });
  } catch (e) {
    logger.info(e.stack);
    res.status(500).json({
      message: "Internal Server Error 😥",
    });
  }
};

export default handler;
