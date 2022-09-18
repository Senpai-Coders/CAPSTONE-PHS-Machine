import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

import { BsClipboardData } from "react-icons/bs";
import { FaThermometerHalf } from "react-icons/fa";
import { IoPeopleSharp, IoBookSharp } from "react-icons/io5";
import { GoGear, GoSignOut } from "react-icons/go";
import { GiHamburgerMenu } from "react-icons/gi";
import { appendToFSUrl } from "../helpers";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import ThemeChooser from "./configuration/themeChooser";
import Notification from "./Notification/Notification";
import UserCard from "./userCard";

import { PI_IP } from "../helpers";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const navbar = ({ toggled, setToggled, userToggled, setUserToggled }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState();
  const [phsInfo, setPhsInfo] = useState();

  const signout = async () => {
    try {
      const response = await axios.post("/api/authentication/signout");
      router.push("/auth/signin");
    } catch (e) {
      console.log("err", e);
    }
  };

  const PHS_ROUTES = [
    {
      path: "/",
      name: "Monitor",
      icon: FaThermometerHalf,
    },
    {
      name: "Detections",
      path: "/detections",
      icon: BsClipboardData,
    },
    {
      name: "Accounts ",
      path: "/accounts",
      icon: IoPeopleSharp,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: GoGear,
    },
    {
      name: "Switch PHS",
      path: "/phsscanner",
      icon: GoGear,
    },
    {
      name: "PHS Logs",
      path: "/systemlogs",
      icon: GoGear,
    },
  ];

  const init = async () => {
    let usrData;
    try{
        usrData = await axios.post("/api/phs/userDetails");
    }catch(e){ router.push("auth/signin") }
    const PHS_INFO = await axios.get("/api/connectivity");
    setPhsInfo(PHS_INFO.data);
    setUserData(usrData);
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <input type="checkbox" id="my-modal-6" className="modal-toggle " />
      <div className="modal font-inter backdrop-blur-sm modal-bottom sm:modal-middle">
        <div className="modal-box ">
          <h3 className="font-bold text-lg">Signout</h3>
          <p className="py-4">
            You are about to signout. Do you wish to proceed?
          </p>
          <div className="modal-action">
            <label htmlFor="my-modal-6" className="btn">
              No
            </label>
            <label
              onClick={() => signout()}
              htmlFor="my-modal-6"
              className="btn"
            >
              Yes
            </label>
          </div>
        </div>
      </div>

      {/* NAV ALL */}
      <nav className=" fixed z-30 flex-shrink-0 href w-screen bg-neutral shadow-lg block">
        <ToastContainer
          className={"z-50"}
          position="top-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          theme={"dark"}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* Left Nav */}
        <div
          className={`z-40 overflow-y-scroll w-64 px-4 py-2 h-screen bg-base-100 shadow-lg absolute duration-300 ease-in-out top-0 ${
            toggled ? "left-0" : "-left-96 "
          }`}
        >
          <div className="mt-2 flex justify-between items-center">
            <div>
              <p>{!phsInfo ? "PHS" : phsInfo.server_name}</p>
              <p className="text-xs mt-2">
                Host IP {!phsInfo ? "-" : phsInfo.ip}
              </p>
              <p className="text-xs mt-2">
                Version {!phsInfo ? "-" : phsInfo.version}
              </p>
            </div>
            <button
              className="btn btn-square btn-sm btn-outline btn-ghost"
              onClick={() => {
                setToggled(false);
              }}
            >
              <MdKeyboardArrowLeft className="h-5 w-5" />
            </button>
          </div>
          <div className="divider" />
          <div className="mt-2">
            <div className="w-full flex justify-evenly">
              <ul className="menu w-full overflow-y-auto bg-transparent py-2 text-base-content">
                {PHS_ROUTES.map((routes, idx) => (
                  <li className="mt-2" key={idx}>
                    <a
                      key={idx}
                      onClick={() => router.push(routes.path)}
                      className={`${
                        router.pathname === routes.path
                          ? "pl-3 pr-4 py-2 border-l-4 border-primary bg-base-200 text-base font-medium transition duration-200 ease-in-out"
                          : "pl-3 pr-4 py-2 border-l-4 border-transparent text-base hover:border-primary font-medium transition duration-200 ease-in-out"
                      } cursor-pointer rounded-md duration-300 w-full`}
                    >
                      {routes.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="divider" />
          <div className="mt-4 grid grid-cols-1">
            <ThemeChooser textMode={false} />
            <button
              onClick={() => {
                window.open(`http://${PI_IP}:3001`, "_blank");
              }}
              className="btn btn-md btn-ghost mt-4 btn-active"
            >
              <IoBookSharp className="text-xl mr-2" /> Manual
            </button>
          </div>
        </div>

        {/* User Nav */}
        <div
          className={`z-40 overflow-y-scroll md:w-96 px-4 py-2 h-screen bg-base-100 shadow-lg absolute duration-300 ease-in-out top-0 ${
            userToggled ? "right-0" : "-right-[32rem] md:-right-96"
          }`}
        >
          <div className="mt-2 flex justify-between items-center">
            <p>Your Account</p>
            <button
              className="btn btn-square btn-sm btn-outline btn-ghost"
              onClick={() => {
                setUserToggled(false);
              }}
            >
              <MdKeyboardArrowRight className="h-5 w-5" />
            </button>
          </div>

          {userData && (
            <div className="mt-4">
              <UserCard
                onNav={true}
                u={userData}
                editor_info={userData}
                onUpdate={init}
              />
            </div>
          )}

          <label
            htmlFor="my-modal-6"
            className="btn btn-active w-full btn-md mt-2 btn-ghost cursor-pointer duration-300"
          >
            <GoSignOut className="text-xl mr-2" />
            Sign Out
          </label>
          <button
            onClick={() => {
              window.open(`http://${PI_IP}:3001`, "_blank");
            }}
            className="btn btn-md btn-ghost mt-4 btn-active w-full"
          >
            <IoBookSharp className="text-xl mr-2" /> Manual
          </button>
        </div>

        {/* TOP BAR */}
        <div className="grid text-sm grid-cols-3 mx-4">
          <div className="flex justify-start items-center space-x-20 my-1 text-neutral-content">
            <GiHamburgerMenu
              className="h-5 w-5"
              onClick={() => {
                setToggled(true);
                setUserToggled(false);
              }}
            />
          </div>

          {/* PHS TITLE */}
          <div
            className="tooltip-bottom flex justify-center items-center my-4 text-neutral-content tooltip"
            data-tip={
              !phsInfo
                ? "You are connected to PHS"
                : `You are connected to ${phsInfo.server_name} @ ${phsInfo.ip}`
            }
          >
            <Link className="lg:block font-inter text-2xl font-bold" href="/">
              <span className="text-xl tracking-widest cursor-pointer">
                {!phsInfo ? "PHS" : phsInfo.server_name}
              </span>
            </Link>
          </div>

          {/*  */}
          <div className="flex justify-end items-center space-x-2">
            <Notification userData={userData} />

            <div
              className="avatar"
              onClick={() => {
                setUserToggled(true);
                setToggled(false);
              }}
            >
              <div className="w-8 cursor-pointer duration-500 ease-in-out rounded-full ring ring-accent/20 hover:ring-accent">
                {!userData ? (
                  <img src="/pig.png" />
                ) : (
                  <img src={appendToFSUrl(userData.photo)} />
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default navbar;
