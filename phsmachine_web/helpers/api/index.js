"use strict";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { exec } = require("child_process");

export const VERSION = "v1.0 - c7effd8";

export const exec_command = async (comnd) => {
  let exec_res = exec(comnd, function (error, stdout, stderr) {
    if (error) {
      console.log(error.stack);
      console.log("Error code: " + error.code);
      console.log("Signal received: " + error.signal);
    }
    console.log("Child Process STDOUT: " + stdout);
    console.log("Child Process STDERR: " + stderr);
  });
  exec_res.on("exit", function (code) {
    console.log("Child process exited with exit code " + code);
  });
};

export const deletePathOrFile = async (paths) => {
  let result = { done: 0, failed: 0 };
  paths.forEach(async (path) => {
    try {
      if (path.isFile) {
        console.log(`Replaced content of ${path.path} -> ${path.defaultValue}`);
        const data = await fs.promises.writeFile(path.path, path.defaultValue);
      } else {
        console.log("Deleted all content -> ", path.path);
        await fs.promises.rm(path.path, { recursive: true });
        await fs.promises.mkdir(path.path);
      }
      result.done += 1;
    } catch (e) {
      console.log(e);
      result.failed += 1;
    }
  });
  return result;
};

export const readDefaults = async () => {
  try {
    const data = await fs.promises.readFile(
      "defaults/phsV1Defaults.json",
      "utf8"
    );
    return JSON.parse(data);
  } catch (err) {
    return undefined;
  }
};

export const writeError = async (obj) => {
  try {
    const prev = await readError();

    let dupl = false;
    prev.forEach((err, id) => {
      if (err.additional.error_code === obj.additional.error_code) dupl = true;
    });

    if (dupl) return [];

    const data = await fs.promises.writeFile(
      "logs/error-logs.json",
      JSON.stringify([...prev, obj])
    );
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

export const removeErrorCode = async (error_code) => {
  try {
    const prev = await readError();

    const data = await fs.promises.writeFile(
      "logs/error-logs.json",
      JSON.stringify(
        prev.filter((err_obj) => err_obj.additional.error_code !== error_code)
      )
    );
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

export const readError = async () => {
  try {
    const data = await fs.promises.readFile("logs/error-logs.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    const data = await fs.promises.writeFile(
      "logs/error-logs.json",
      JSON.stringify([])
    );
    return [];
  }
};

export const clearError = async () => {
  try {
    const prev = await readError();
    const data = await fs.promises.writeFile(
      "logs/error-logs.json",
      JSON.stringify([])
    );
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

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
