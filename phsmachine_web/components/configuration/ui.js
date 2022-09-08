import React from "react";

import ThemeChoser from "./themeChooser";
import CamLayoutChoser from "./streamLayoutChoser";
import { FaPaintRoller, FaPlay, FaStop } from "react-icons/fa";
import { RiLayout4Fill } from "react-icons/ri";

const ui = () => {
  return (
    <div className="overflow-visible">
      <div className="mx-1 md:mx-2 overflow-visible rounded-md p-4 md:p-4 outline min-h-screen mt-4 bg-base-100 shadow-sm outline-1 outline-base-300">
        <p className="font-inter font-medium mb-2 text-lg md:text-xl">UI</p>
        <div className="mt-2 card overflow-visible">
            <div className="card-body p-2">
              <div className="md:flex items-center justify-between">
                <div className="mr-4">
                  <div className="flex items-center justify-start mb-2">
                    <div className="p-2 rounded-xl bg-base-300 mr-2">
                      <FaPaintRoller className="w-6 h-6" />
                    </div>
                    <p className="text-lg">System Theme</p>
                  </div>
                  <p className="text-xs md:text-sm">
                    Choose theme based on your preference
                  </p>
                </div>
                <div className=" mt-4 md:mt-0">
                  <ThemeChoser textMode={true} />
                </div>
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="mt-2 card overflow-visible">
            <div className="card-body p-2">
              <div className="md:flex items-center justify-between">
                <div className="mr-4">
                  <div className="flex items-center justify-start mb-2">
                    <div className="p-2 rounded-xl bg-base-300 mr-2">
                      <RiLayout4Fill className="w-6 h-6" />
                    </div>
                    <p className="text-lg">Stream Layout</p>
                  </div>
                  <p className="text-xs md:text-sm">
                    Choose your prefered realtime video feed layout
                  </p>
                </div>
                <div className=" mt-4 md:mt-0">
                  <CamLayoutChoser textMode={true} />
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default ui;
