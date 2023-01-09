import { readFile, writeFile, exec_command, PI_IP } from "../../../helpers/api";
import logger from "../../../services/logger";
const { exec } = require("child_process");
import axios from "axios";

function execShellCommand(cmd) {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
     exec(cmd, (error, stdout, stderr) => {
      if (error) {
       console.warn(error);
      }
      resolve(stdout? stdout : stderr);
     });
    });
   }

const handler = async (req, res) => {
  try {
    const { mode } = req.body;

    if (mode === 0) { // get known update
      let update = await readFile(`tracking_hasupdate.tmp`);
      logger.info(`Retrieve Update`);
      return res.status(200).json({ update: update.replace("\n", "") });
    }

    if (mode === 1) { // set update on restart
      logger.info(`Set system to update on boot`);
      const { stdout, stderr } = await execShellCommand("./phs_updater.sh");
      let shouldUpdate = await writeFile("tracking_lastipbuild.tmp", "-");
      const { stdout, stderr } = await execShellCommand("sudo reboot now");
      return res.status(200).json({ message: "ok" });
    }

    if (mode === 2) { // fetch update from repo
        logger.info(`Retrieving updates from PHS repository`)
        const { stdout, stderr } = await execShellCommand("./phs_fetcher.sh");
        return res.status(200).json({ message: "ok" });
    }

    return res
      .status(400)
      .json({ message: "You might have missed some request parameters" });
  } catch (e) {
    logger.error(e.stack);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export default handler;
