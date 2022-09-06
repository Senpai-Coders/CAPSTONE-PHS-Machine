import { writeError } from "../../../helpers/api/index";

// This route is for Python PHS
const handler = async (req, res) => {
  try {
    const { mode,obj } = req.body;

    const writtenError = await writeError(obj)

    return res.status(200)
  } catch (e) {
    console.log(e);
    res.status(500)
  }
};

export default handler;
