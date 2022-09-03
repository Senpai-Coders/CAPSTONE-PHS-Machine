const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { networkInterfaces } = require("os");

export const VERSION = 'v1.0 - c7effd8'

export const HASH_PASSWORD = async (PASSWORD) => {
  const HASHED = await bcrypt.hash(PASSWORD, 10);
  return HASHED;
};

export const GET_SERVER_IP = () => {
  var interfaces = require("os").networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      )
        return alias.address;
    }
  }
  return "0.0.0.0";
};

export const COMPARE_PASSWORD = async (HASH_PASSWORD, PASSWORD) => {
  let matched = false;
  matched = await bcrypt.compare(PASSWORD, HASH_PASSWORD);
  return matched;
};

export const GENERATE_JWT = (DATA) => {
  //May expiration
  //return jwt.sign(DATA, process.env.JWT_SCRT, { expiresIn: process.env.JWT_EXP_TIME, });
  return jwt.sign(DATA, process.env.JWT_SCRT);
};

export const VERIFY_AUTHORIZATION = (JWT) => {
  try {
    const DATA = jwt.verify(JWT, process.env.JWT_SCRT);
    return DATA;
  } catch (e) {
    return false;
  }
};

export default {};
