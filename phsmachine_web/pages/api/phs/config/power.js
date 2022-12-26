import { exec_command, VERIFY_AUTHORIZATION } from "../../../../helpers/api";
import logger from "../../../../services/logger";
import { PI_IP } from "../../../../helpers/api";

const handler = async (req, res) => {
  try {
    const auth = req.cookies.authorization;
    const editorDetails = VERIFY_AUTHORIZATION(auth);
    const { mode } = req.body;

    if (mode === 0) {
      const response = fetch(`http://${PI_IP}:8000/shutdown_reboot?tostate=shutdown`, {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tostate: "shutdown",
        }),
      })
        .then((response) => response.json())
        .then((data) => {})
        .finally(async () => {
          logger.info(
            `User ${editorDetails.user_name}(${editorDetails._id}) -> Shutdown System`
          );
        //   const shutdown = await exec_command("sudo shutdown now");
        });
    } else if (mode === 1) {
      const reboot = await exec_command("sudo reboot now");
      logger.info(
        `User ${editorDetails.user_name}(${editorDetails._id}) -> Restart System`
      );

      const response = fetch(`http://${PI_IP}:8000/shutdown_reboot?tostate=reboot`, {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tostate: "reboot",
        }),
      })
        .then((response) => response.json())
        .then((data) => {})
        .finally(async () => {
          logger.info(
            `User ${editorDetails.user_name}(${editorDetails._id}) -> Shutdown System`
          );
        //   const shutdown = await exec_command("sudo shutdown now");
        });
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
