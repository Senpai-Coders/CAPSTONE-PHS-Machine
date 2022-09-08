import { exec_command } from "../../../../helpers/api"

const handler = async (req, res) => {
  try {

    const { mode } = req.body

    if(mode === 0){
        const shutdown = await exec_command("sudo shutdown now");
    }else if( mode === 1){
        const reboot = await exec_command("sudo reboot now")
    }
    res.status(200).json({ message : "Done" });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal Server Error 😥",
    });
  }
};

export default handler;
