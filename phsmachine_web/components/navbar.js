import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { BsClipboardData } from "react-icons/bs";
import { FaThermometerHalf, FaSignOutAlt } from "react-icons/fa";
import { IoPeopleSharp, IoRemoveOutline } from "react-icons/io5";
import { GoGear } from "react-icons/go";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiPagesFill } from "react-icons/ri";
import { API, amISignedIn, getMyData, getRole } from "../helpers";
import ThemeChooser from "./configuration/themeChooser";

import Time_Strip from "./Time_Strp";

const navbar = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState();

  const [toggled, setToggled] = useState(false);

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
      name: "Config ",
      path: "/configuration",
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

      {/* <div className="md:hidden flex w-full justify-evenly my-4 items-center">
        {PHS_ROUTES.map((routes, idx) => (
          <routes.icon
            key={idx}
            onClick={() => router.push(routes.path)}
            className={`${
              router.pathname === routes.path ? "scale-110" : "opacity-50"
            } h-5 w-5 text-primary cursor-pointer duration-300`}
          />
        ))}

        <label htmlFor="my-modal-6" className="modal-button">
          <FaSignOutAlt
            className={`hover:scale-110 hover:opacity-100 opacity-50 h-5 w-5 text-primary cursor-pointer duration-300`}
          />
        </label>
      </div> */}

      {/* NAV MOBILE */}
      <nav className="lg:hidden fixed z-30 flex-shrink-0 href w-screen bg-base-200 shadow-lg block">
        {/* <div className="overflow-y-auto overflow-x-hidden flex justify-between px-8"> */}
        {/* SideBar Show/Hide */}
        <div
          className={`z-40 overflow-y-scroll w-64 px-6 py-2 h-screen bg-base-300 absolute duration-300 ease-in-out top-0 ${
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
          <div className="mt-4">
            <div className="flex items-center justify-start mb-2">
              <div className="py-2 pr-2 rounded-xl bg-base-300">
                <RiPagesFill className="w-5 h-5" />
              </div>
              <p className="text-lg">Pages</p>
            </div>
            {PHS_ROUTES.map((routes, idx) => (
              <p
                key={idx}
                onClick={() => router.push(routes.path)}
                className={`${
                  router.pathname === routes.path
                    ? "text-lg text-primary"
                    : "opacity-50 text-sm "
                } cursor-pointer duration-300 my-2`}
              >
                {routes.name}
              </p>
            ))}
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
              {userData ? <p className="ml-2 text-sm">{userData.user_name}</p> : <p>...</p>}
            </div>
            <ThemeChooser />
            <label
              htmlFor="my-modal-6"
              className="font-medium btn mt-4 btn-sm modal-button cursor-pointer duration-300 text-primary"
            >
              Sign Out
            </label>
          </div>
          
        </div>

        <div className="grid text-sm grid-cols-3 mx-4">
          <div className="flex justify-start items-center space-x-20 my-1">
            <GiHamburgerMenu
              className="h-5 w-5"
              onClick={() => {
                setToggled(true);
              }}
            />
            {/*<GiStopSign
                className={`opacity-90 h-7 w-7 text-error cursor-pointer duration-300`}
              />*/}
          </div>

          {/* PHS TITLE */}
          <div className="flex justify-center items-center my-4">
            <Link
              className="lg:block font-inter text-2xl font-bold text-gray-800 dark:text-gray-200"
              href="/"
            >
              <span className="text-xl tracking-widest cursor-pointer">
                PHS
              </span>
            </Link>
          </div>

          {/*  */}
          <div className="flex justify-end items-center space-x-8">
            <Time_Strip />
          </div>
        </div>
      </nav>

      {/* NAV Tablet + Md + Lg + Full */}
      <nav className="hidden left-0 fixed z-30 w-full flex-shrink-0 px-5 href dark:bg-gray-800 bg-base-200 shadow-lg lg:block">
        {/* <div className="overflow-y-auto overflow-x-hidden flex justify-between px-8"> */}
        <div className=" grid text-sm grid-cols-3 mx-4">
          <div className="flex justify-evenly items-center space-x-20 my-1">
            {PHS_ROUTES.map((routes, idx) => (
              <p
                key={idx}
                onClick={() => router.push(routes.path)}
                className={`${
                  router.pathname === routes.path
                    ? "scale-110 text-primary"
                    : "opacity-50"
                } cursor-pointer duration-300`}
              >
                {routes.name}
              </p>
            ))}
            {/*<GiStopSign
                className={`opacity-90 h-7 w-7 text-error cursor-pointer duration-300`}
              />*/}
          </div>

          {/* PHS TITLE */}
          <div className="flex justify-center items-center my-4">
            <Link
              className="lg:block font-inter text-2xl font-bold text-gray-800 dark:text-gray-200"
              href="/"
            >
              <span className="text-xl tracking-widest cursor-pointer">
                PHS
              </span>
            </Link>
          </div>

          {/* USER INFO & SIGNOUT */}
          <div className="flex justify-end items-center space-x-8">
          <div className="md:hidden lg:block"><Time_Strip /></div>
            <ThemeChooser />
            {!userData ? (
              <div className="w-5/12 flex items-center space-x-4">
                <progress className="progress progress-primary"></progress>
              </div>
            ) : (
              <>
                <div
                  className="tooltip tooltip-bottom"
                  data-tip={`Your Role : ${getRole(userData.role)}`}
                >
                  <div className="avatar">
                    <div className="w-10 mask mask-hexagon-2">
                      <img src={userData.photo} />
                    </div>
                  </div>
                </div>

                <p>{userData.user_name}</p>
                <p></p>
              </>
            )}
            <label
              htmlFor="my-modal-6"
              className="font-medium modal-button cursor-pointer duration-300 text-primary"
            >
              Signout
            </label>
          </div>
        </div>
      </nav>
    </>
  );
};

export default navbar;
