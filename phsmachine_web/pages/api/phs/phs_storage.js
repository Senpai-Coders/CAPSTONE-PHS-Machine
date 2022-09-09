import checkDiskSpace from "check-disk-space";

const handler = async (req, res) => {
  try {
    const storage = await checkDiskSpace("/");
    res.status(200).json({ storage });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Sorry, you are not authorized",
    });
  }
};

export default handler;
