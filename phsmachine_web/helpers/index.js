import axios from "axios";

import { BsFillShieldLockFill, BsFillShieldFill } from "react-icons/bs";
import { FaUserAlt, FaConnectdevelop } from "react-icons/fa";
import { AiFillEye, AiOutlineLoading } from "react-icons/ai";
import { FiZapOff, FiSlash } from "react-icons/fi";
import { BsFillBugFill } from "react-icons/bs";
import { GiCyberEye } from "react-icons/gi";

export const bytesToMegaBytes = (bytes) => bytes / 1000000; //bytes / (1024 ** 2)
export const mbToGB = (mb) => mb / 1000;

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
  
export const PI_IP = GET_SERVER_IP();

export const fileServerUrl = `http://${GET_SERVER_IP()}:8001`;

export const appendToFSUrl = (path) => {
  return fileServerUrl + path;
};


export const notify = (notifyObject) => {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    const notification = new Notification(notifyObject.title, {
      body: notifyObject.message,
      data: {},
      icon: "pig.png",
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        const notification = new Notification(notifyObject.title, {
          body: notifyObject.message,
          data: {},
          icon: "pig.png",
        });
      }
    });
  }
};

export const localErrorLoad = () => {
  if (!localStorage) return;
  var localError = JSON.parse(localStorage.getItem("local-errors"));
  if (!localError) {
    localStorage.setItem("local-errors", JSON.stringify([]));
    return [];
  }
  return localError;
};

export const localErrorAdd = (error_objj) => {
  let error_obj = { _id : `${new Date().toLocaleDateString()}_${new Date().getTime()}-LOCAL`, ...error_objj}
  if (!localStorage) return;
  var localError = JSON.parse(localStorage.getItem("local-errors"));
  var exist = false;
  if (!localError) localError = [];
  else {
    for (var i = 0; i < localError.length && !exist; i++) {
      if (
        localError[i].additional.error_code === error_obj.additional.error_code
      ) {
        exist = true;
      }
    }
  }
  if (!exist) {
    localError = [...localError, error_obj];
    localStorage.setItem("local-errors", JSON.stringify(localError));
  }
};

export const localErrorSetReadAll = (id) => {
  if (!localStorage) return;
  var localError = JSON.parse(localStorage.getItem("local-errors"));

  if (!localError) localError = [];

  for (var i = 0; i < localError.length; i++) localError[i].seenBy.push(id);

  localStorage.setItem("local-errors", JSON.stringify(localError));
};

export const localErrorRemoveCode = (error_code) => {
  if (!localStorage) return;
  var localError = JSON.parse(localStorage.getItem("local-errors")).filter(
    (ers) => ers.additional.error_code !== error_code
  );
  localStorage.setItem("local-errors", JSON.stringify(localError));
};

export const localErrorDeleteAll = () => {
  localStorage.setItem("local-errors", JSON.stringify([]));
};

export const getPercentUsage = (total, taken) => {
  var tk = (taken / total) * 100;
  return isNaN(tk) ? 0 : tk;
};

export const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const getMyData = async () => {
  try {
    const myData = await axios.post("/api/phs/userDetails");
    return myData.data.userData;
  } catch (e) {}
};

export const translateSystemStateToIcon = (status) => {
  if (status === 0)
    return <GiCyberEye className="w-7 h-7 animate-pulse text-accent" />;
  if (status === 1)
    return <FaConnectdevelop className="w-7 h-7 animate-spin" />;
  if (status === 2)
    return <BsFillBugFill className="w-7 h-7 animate-pulse text-warning" />;
  if (status === 3)
    return <AiOutlineLoading className="w-7 h-7 text-accent animate-spin" />;
  if (status === -1) return <FiSlash className="w-7 h-7 text-warning" />;
  if (status === -2) return <FiZapOff className="w-7 h-7 text-error" />;
};

export const getRoleIcon = (role) => {
  if (role === 3) return <BsFillShieldLockFill className="w-5 h-5" />;
  if (role === 2) return <BsFillShieldFill className="w-5 h-5" />;
  if (role === 1) return <FaUserAlt className="w-5 h-5" />;

  return <AiFillEye className="w-5 h-5" />;
};

export const getRole = (role) => {
  if (role === 3) return "Root";
  if (role === 2) return "Admin";
  if (role === 1) return "Employee";
  return "Viewer";
};

export const setTheme = (t) => {
  document.getElementsByTagName("html")[0].setAttribute("data-theme", t);
  window.localStorage.setItem("phs-theme", t);
};

export const setCamMode = (mode) => {
  window.localStorage.setItem("phs-CamMode", mode);
};

export const getCamMode = () => {
  let found = localStorage.getItem("phs-CamMode");
  return found ? found : 0;
};

export const loadTheme = () => {
  let savedTheme = localStorage.getItem("phs-theme");
  if(savedTheme === undefined || savedTheme === null) setTheme('dracula')
  savedTheme = localStorage.getItem("phs-theme");
  document
    .getElementsByTagName("html")[0]
    .setAttribute("data-theme", savedTheme);
  return savedTheme;
};

export const tempParser = (C, decimal_place) => {
  if (isNaN(Number.parseFloat(C))) return "-";
  return C.toFixed(decimal_place);
};

export const CtoF = (C) => {
  var cTemp = C;
  var cToFahr = (cTemp * 9) / 5 + 32;
  return C.toFixed(2);
};


export const translateSystemState = (status) => {
  if (status === 0) return "Detecting";
  if (status === 1) return "Resolving";
  if (status === 2) return "Debugging";
  if (status === 3) return "Connecting";
  if (status === -1) return "Disabled";
  if (status === -2) return "Off";
};

export const dateToWord = (date) => {
  let thisDate = new Date(date);
  let wordDate = `${thisDate.toLocaleString("en-us", {
    month: "short",
  })} ${thisDate.getDate()}, ${thisDate.getFullYear()} - ${thisDate.toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  )}`;
  return wordDate;
};

export const dateMMDDYYYY = (date, sep) => {
  if (isNaN(date)) return `-${sep}-${sep}`;
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");
  return `${month}${sep}${day}${sep}${year}`;
};

export const dateYYYYMMDD = (date, sep) => {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");
  let str = `${year}${sep}${month}${sep}${day}`;
  return str;
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

export const getMonthName = (date) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return monthNames[date.getMonth()];
};

export const dateMwDDYYYY = (date) => {
  return `${getMonthName(date)} ${date.getDate()}, ${date.getFullYear()}`;
};
