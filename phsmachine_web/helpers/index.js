import axios from "axios";

import { BsFillShieldLockFill, BsFillShieldFill } from "react-icons/bs";
import { FaUserAlt, FaConnectdevelop } from "react-icons/fa";
import { AiFillEye, AiOutlineLoading } from "react-icons/ai";
import { FiZapOff, FiSlash } from "react-icons/fi";
import { BsFillBugFill } from "react-icons/bs";
import { GiCyberEye } from "react-icons/gi";

export const PI_IP = process.env.PI_IP;

export const getMyData = async () => {
  try {
    const myData = await axios.post("/api/phs/userDetails");
    return myData.data.userData;
  } catch (e) {
    console.log("Internal Server Error : 500");
  }
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

export const loadTheme = () => {
  let savedTheme = localStorage.getItem("phs-theme");
  document
    .getElementsByTagName("html")[0]
    .setAttribute("data-theme", savedTheme);
};

export const tempParser = (C) => {
  return C.toFixed(2);
};

export const CtoF = (C) => {
  var cTemp = C;
  var cToFahr = (cTemp * 9) / 5 + 32;
  return C.toFixed(2);
};

export let API = axios.create({ baseURL: "", withCredentials: true });
API.defaults.withCredentials = true;

export const amISignedIn = async () => {
  try {
    const resp = await API.post("/api/phs/checkCreds");
    return true;
  } catch (e) {
    console.log("err");
  }
  return false;
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
