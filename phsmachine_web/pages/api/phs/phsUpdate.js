import { readFile, writeFile } from "../../../helpers/api";
import logger from "../../../services/logger";

const handler = async (req, res) => {
  try {
    const { mode } = req.body;

    if ( mode === 0 ) {
      let update = await readFile(`tracking_hasupdate.tmp`);
      logger.info(`Retrieve Update`);
      return res.status(200).json({ update : update.replace("\n","") });
    }

    if ( mode === 1 ){
        let shouldUpdate = await writeFile("tracking_shouldupdate.tmp", "true")
        return res.status(200).json({ message : "ok" })
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
