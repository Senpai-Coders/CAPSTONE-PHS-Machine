"use strict";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { exec } = require("child_process");
var XLSX = require("xlsx");
import { zip } from "zip-a-folder";
import logger from "../../services/logger"
var ip = require('ip');

export const PI_IP = ip.address();

// export const fileServerUrl = `http://${PI_IP}:8001`;

export const createPathIfNotExist = async (path) => {
  try {
    await fs.promises.mkdir(path);
  } catch (e) {
    return true;
  }
};

createPathIfNotExist("public/exports");
createPathIfNotExist("public/detections");
createPathIfNotExist("public/images");
createPathIfNotExist("public/logs/web");
createPathIfNotExist("public/logs/core");

export const VERSION = "v1.0 - c7effd8";

export const ToExcel = async (data) => {
  await createPathIfNotExist("public/exports");
  const timeStamp = new Date();
  const pth = `/exports/${timeStamp
    .toDateString()
    .replaceAll(" ", "_")}_Detection_Export_${timeStamp.getTime()}.xlsx`;
  let exportLink = "";
  try {
    var workbook = XLSX.utils.book_new();
    var worksheet = XLSX.utils.json_to_sheet(data);
    worksheet["!cols"] = [
      { width: 14 },
      { width: 14 },
      { width: 12 },
      { width: 12 },
      { width: 20 },
      { width: 15 },
      { width: 20 },
      { width: 20 },
      { width: 150 },
    ];
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `Detection ${timeStamp.toLocaleDateString().replaceAll("/", "_")}`,
      true
    );
    let writeResult = await XLSX.writeFile(workbook, "public" + pth);
    if (writeResult === undefined) exportLink = pth;
  } catch (e) {
    logger.error(e.stack)
  }
  return exportLink;
};

export const ToCsv = async (data) => {
  await createPathIfNotExist("public/exports");
  const timeStamp = new Date();
  const pth = `/exports/${timeStamp
    .toDateString()
    .replaceAll(" ", "_")}_Detection_Export_${timeStamp.getTime()}.csv`;
  let exportLink = "";
  try {
    var worksheet = XLSX.utils.json_to_sheet(data);
    var CsvSheet = XLSX.utils.sheet_to_csv(worksheet);
    const writeResult = await fs.promises.writeFile("public" + pth, CsvSheet);
    if (writeResult === undefined) exportLink = pth;
  } catch (e) {
    logger.error(e.stack)
  }
  return exportLink;
};

export const ToZip = async (path) => {
  await createPathIfNotExist("public/exports");
  const timeStamp = new Date();
  const pth = `/exports/${timeStamp
    .toDateString()
    .replaceAll(" ", "_")}_Detection_Export_${timeStamp.getTime()}.zip`;
  try {
    const result = await zip(path, "public" + pth);
    if (result === undefined) return pth;
    return "";
  } catch (e) {
    logger.error(e.stack)
    return "";
  }
};

export const exec_command = async (comnd) => {
  let exec_res = exec(comnd, function (error, stdout, stderr) {
    if (error) {
        logger.error(e.stack)
      logger.error("Error code: " + error.code);
      logger.error("Signal received: " + error.signal);
    }
    logger.error("Child Process STDOUT: " + stdout);
    logger.error("Child Process STDERR: " + stderr);
  });
  exec_res.on("exit", function (code) {
    logger.info("Child process exited with exit code " + code);
  });
};

export const deletePathOrFile = async (paths) => {
  let result = { done: 0, failed: 0 };
  paths.forEach(async (path) => {
    try {
      if (path.isFile) {
        const data = await fs.promises.writeFile(path.path, path.defaultValue);
      } else {
        await fs.promises.rm(path.path, { recursive: true });
        await fs.promises.mkdir(path.path);
      }
      result.done += 1;
    } catch (e) {
      logger.error(e.stack)
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
      "public/logs/error-logs.json",
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
      "public/logs/error-logs.json",
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
    const data = await fs.promises.readFile("public/logs/error-logs.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    const data = await fs.promises.writeFile(
      "public/logs/error-logs.json",
      JSON.stringify([])
    );
    return [];
  }
};

export const readJsonFile = async (path) => {
    try {
        const content = await fs.promises.readFile(path, "utf8");
        return JSON.parse(content);
      } catch (err) {
        return { sendGrid : "" };
      }
}

export const readDirContent = async (path) => {
  try {
    let files = fs.readdirSync(path, { withFileTypes: true })
      .filter((item) => !item.isDirectory())
      .map((item) => item.name );
    return files;
  } catch (e) {
    logger.error(e.stack)
    return [];
  }
};

export const readLogs = async (logFileName) => {
  try {
    const data = await fs.promises.readFile(logFileName, "utf8");
    return data;
  } catch (err) {
    const data = await fs.promises.writeFile(logFileName, "");
    return "";
  }
};

export const clearError = async () => {
  try {
    const prev = await readError();
    const data = await fs.promises.writeFile(
      "public/logs/error-logs.json",
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

export const bytesToMegaBytes = (bytes) => bytes / 1000000; //bytes / (1024 ** 2)

export const mbToGB = (mb) => mb / 1000;

export const getPercentUsage = (total, taken) => {
    var tk = (taken / total) * 100;
    return isNaN(tk) ? 0 : tk;
  };

export const dateToBeutify = (date) => {
    let thisDate = new Date(date);
    let wordDate = `${thisDate.toLocaleString("en-us", {
      month: "short",
    })} ${thisDate.getDate()}, ${thisDate.getFullYear()} at ${thisDate.toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
    return wordDate;
  };
  

export default {};
