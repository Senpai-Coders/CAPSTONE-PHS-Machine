import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { BsClipboardData } from "react-icons/bs";
import { FaThermometerHalf } from "react-icons/fa";
import { IoPeopleSharp, IoRemoveOutline } from "react-icons/io5";
import { GoGear } from "react-icons/go";
import { GiHamburgerMenu } from "react-icons/gi";
import { API, amISignedIn, getMyData, getRole } from "../helpers";

import ThemeChooser from "./configuration/themeChooser";
import Notification from "./Notification/Notification";

import Time_Strip from "./Time_Strp";

const navbar = ({ toggled, setToggled }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState();

  const signout = async () => {
    try {
      console.log("signedout");
      const response = await API.post("/api/authentication/signout");
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
  ];

  const init = async () => {
    if (!(await amISignedIn())) router.push("/auth/signin");
    const usrData = await getMyData();
    setUserData(usrData);
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  // hidden
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
        <div
          className={`z-40 overflow-y-scroll w-64 px-4 py-2 h-screen bg-base-100 shadow-lg absolute duration-300 ease-in-out top-0 ${
            toggled ? "left-0" : "-left-96 "
          }`}
        >
          <div className="mt-2 flex justify-between items-center">
            <p>PHS A1</p>
            <button
              className="btn btn-square btn-sm btn-outline btn-ghost"
              onClick={() => {
                setToggled(false);
              }}
            >
              <IoRemoveOutline className="h-5 w-5" />
            </button>
          </div>
          <div className="divider" />
          <div className="mt-2">
            <div className="w-full flex justify-evenly">
              <ul className="menu w-full overflow-y-auto bg-transparent py-2 text-base-content">
                {PHS_ROUTES.map((routes, idx) => (
                  <li className="" key={idx}>
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
            <div className="flex items-center justify-start mb-2">
              {!userData ? (
                <div className="w-5/12 flex items-center space-x-4">
                  <progress className="progress progress-primary"></progress>
                </div>
              ) : (
                <div
                  className="tooltip tooltip-right"
                  data-tip={`Your Role : ${getRole(userData.role)}`}
                >
                  <div className="avatar">
                    <div className="w-10 ring-1 mask mask-hexagon-2">
                      <img src={userData.photo} />
                    </div>
                  </div>
                </div>
              )}
              {userData ? (
                <p className="ml-2 text-sm">{userData.user_name}</p>
              ) : (
                <p>...</p>
              )}
            </div>
            <ThemeChooser textMode={false} />
            <label
              htmlFor="my-modal-6"
              className="font-medium btn btn-outline btn-sm mt-2 btn-ghost cursor-pointer duration-300"
            >
              Sign Out
            </label>
          </div>
        </div>
        <div className="grid text-sm grid-cols-3 mx-4">
          <div className="flex justify-start items-center space-x-20 my-1 text-neutral-content">
            <GiHamburgerMenu
              className="h-5 w-5"
              onClick={() => {
                setToggled(true);
              }}
            />
          </div>

          {/* PHS TITLE */}
          <div className="flex justify-center items-center my-4 text-neutral-content">
            <Link
              className="lg:block font-inter text-2xl font-bold"
              href="/"
            >
              <span className="text-xl tracking-widest cursor-pointer">
                PHS
              </span>
            </Link>
          </div>

          {/*  */}
          <div className="flex justify-end items-center space-x-8">
            {/* <Time_Strip /> */}
            <Notification userData={userData} />
          </div>
        </div>
      </nav>
    </>
  );
};

export default navbar;

