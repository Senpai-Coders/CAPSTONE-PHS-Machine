import dbConnect from "../../../configs/dbConnection";
const users = require("../../../models/user");

dbConnect();

const handler = async (req, res) => {
  try {
    let userData = await users.find({});

    let toRet = [];

    for (var x = 0; x < userData.length; x++) {
      //   let startDate = new Date(userData[x].last_active_date);
      //   let endDate = new Date();
      //   let milisDiff = endDate - startDate;
      //   let minutesPassed = Math.round(
      //     ((milisDiff % 86400000) % 3600000) / 60000
      //   );
      var past = new Date(userData[x].last_active_date).getTime();
      var fiveMin = 1000 * 60 * 5;
      var isPast = new Date().getTime() - past < fiveMin ? false : true;

      if (!isPast) {
        toRet.push(userData[x]);
      }
    }
    res.status(200).json({ activeUsers: toRet });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal Server Error 😥",
    });
  }
};

export default handler;
