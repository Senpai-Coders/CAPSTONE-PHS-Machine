const { exec } = require("child_process");

const handler = async (req, res) => {
  try {

    const { mode } = req.body

    if(mode === 0){
        const shutdown = exec("shutdown", function (error, stdout, stderr) {
            if (error) {
              console.log(error.stack);
              console.log("Error code: " + error.code);
              console.log("Signal received: " + error.signal);
            }
            console.log("Child Process STDOUT: " + stdout);
            console.log("Child Process STDERR: " + stderr);
          });
      
          shutdown.on("exit", function (code) { console.log("Child process exited with exit code " + code); });
    }else if( mode === 1){
        const reboot = exec("reboot", function (error, stdout, stderr) {
            if (error) {
              console.log(error.stack);
              console.log("Error code: " + error.code);
              console.log("Signal received: " + error.signal);
            }
            console.log("Child Process STDOUT: " + stdout);
            console.log("Child Process STDERR: " + stderr);
          });
      
          reboot.on("exit", function (code) { console.log("Child process exited with exit code " + code); });
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
