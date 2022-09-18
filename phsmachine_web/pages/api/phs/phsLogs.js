import { readLogs, readDirContent } from "../../../helpers/api";
import logger from "../../../services/logger";

const handler = async (req, res) => {
  try {
    const { mode, category, name } = req.body;
    const basePath = "public/logs";

    if (mode === 0 && category) {
      let folders = await readDirContent(`${basePath}/${category}`);
      logger.info(`Retrieve Logs -> ${category} -> ${name}`);
      return res.status(200).json(folders);
    } else if (mode === 1 && category && name) {
      logger.info(`Retrieve Logs -> ${category} -> ${name}`);
      let content = await readLogs(`${basePath}/${category}/${name}`);
      return res.status(200).json({ content: content });
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
