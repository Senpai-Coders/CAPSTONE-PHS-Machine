const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

export const HASH_PASSWORD = async (PASSWORD) => {
  const HASHED = await bcrypt.hash(PASSWORD, 10);
  return HASHED;
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
