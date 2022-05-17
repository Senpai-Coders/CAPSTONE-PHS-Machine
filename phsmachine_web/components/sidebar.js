import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { BsClipboardData } from "react-icons/bs";
import { FaThermometerHalf, FaSignOutAlt } from "react-icons/fa";
import { GoGear } from "react-icons/go";

import { API, amISignedIn } from "../helpers";

const sidebar = () => {
  const router = useRouter();

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
      name: "System State",
      icon: FaThermometerHalf,
    },
    {
      name: "Analysis",
      path: "/analysis",
      icon: BsClipboardData,
    },
    {
      name: "Configuration ",
      path: "/configuration",
      icon: GoGear,
    },
  ];

  const init = async () => {
    if (!(await amISignedIn())) router.push("/auth/signin");
  };

  useEffect(() => {
    init();
  });

  // hidden
  return (
    <>
      <input type="checkbox" id="my-modal-6" className="modal-toggle " />
      <div className="modal font-inter backdrop-blur-sm modal-bottom sm:modal-middle">
        <div className="modal-box ">
          <h3 className="font-bold text-lg">
            Signout 
          </h3>
          <p className="py-4">
            You are about to signout. Do you wish to proceed?
          </p>
          <div className="modal-action">
            <label htmlFor="my-modal-6" className="btn">
              No
            </label>
            <label onClick={() => signout()} htmlFor="my-modal-6" className="btn">
              Yes
            </label>
          </div>
        </div>
      </div>
      <aside className="hidden relative z-30 flex-shrink-0 px-5 overflow-y-auhref dark:bg-gray-800 lg:block">
        <div className="overflow-y-auto mt-8 overflow-x-hidden space-y-14 flex-grow">
          <div className="flex items-center my-4">
            <Link
              className="lg:block ml-6 text-2xl font-bold text-gray-800 dark:text-gray-200"
              href="/"
            >
              PHS
            </Link>
          </div>
          <div className="flex flex-col items-center py-2 space-y-14 mb-3">
            {PHS_ROUTES.map((routes, idx) => (
              <routes.icon
                key={idx}
                onClick={() => router.push(routes.path)}
                className={`${
                  router.pathname === routes.path ? "scale-110" : "opacity-50"
                } h-7 w-7 text-primary cursor-pointer duration-300`}
              />
            ))}
          </div>
        </div>

        <label htmlFor="my-modal-6" className="modal-button">
          <FaSignOutAlt
            className={`hover:scale-110 hover:opacity-100 opacity-50 absolute bottom-5 h-7 w-7 text-primary cursor-pointer duration-300`}
          />
        </label>
      </aside>
    </>
  );
};

export default sidebar;
