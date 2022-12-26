import { exec_command, VERIFY_AUTHORIZATION } from "../../../../helpers/api";
import logger from "../../../../services/logger";
import { PI_IP } from "../../../../helpers/api";
import axios from "axios";

const handler = async (req, res) => {
  const debs = false;

  try {
    const auth = req.cookies.authorization;
    const editorDetails = VERIFY_AUTHORIZATION(auth);
    const { mode } = req.body;

    if (mode === 0) {
      try {
        const response = await axios.get(
          `http://${PI_IP}:8000/shutdown_reboot?tostate=shutdown`
        );
      } catch (e) {}

      logger.info(
        `User ID : (${editorDetails._id}) executes -> Shutdown System`
      );
      if (!debs) {
        const shutdown = await exec_command("sudo shutdown now");
      }
    } else if (mode === 1) {
      try {
        const response = await axios.get(
          `http://${PI_IP}:8000/shutdown_reboot?tostate=reboot`
        );
      } catch (e) {}

      logger.info(
        `User ID : (${editorDetails._id}) executes -> Restart System`
      );
      if (!debs) {
        const reboot = await exec_command("sudo reboot now");
      }
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
