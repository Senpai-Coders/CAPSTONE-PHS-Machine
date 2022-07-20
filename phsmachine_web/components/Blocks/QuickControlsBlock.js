import React from "react";

import { RiRemoteControlLine } from "react-icons/ri";
import { FiZapOff } from "react-icons/fi";
import { FaStopCircle } from "react-icons/fa"

const QuickControlsBlock = () => {
  return (
    <div class="mb-4 mx-0 sm:ml-4 xl:mr-4">
      <div class="shadow-lg rounded-2xl card bg-base-100 w-full">
        <div className="p-4 flex items-center justify-start">
          <RiRemoteControlLine className="w-7 h-7 text-secondary" />
          <p class="ml-2 font-bold text-md">PHS Quick Controls</p>
        </div>
        <div className="form-control mx-4 mb-4">
          <label className="label cursor-pointer">
            <span className="label-text">Debug Mode</span>
            <input type="checkbox" className="toggle toggle-accent" />
          </label>
          <label className="label cursor-pointer">
            <span className="label-text">Disable Detection</span>
            <input type="checkbox" className="toggle toggle-accent" />
          </label>
          <label className="label cursor-pointer">
            <span className="label-text">Stop Camera's</span>
            <input type="checkbox" className="toggle toggle-accent" />
          </label>
          <button className="btn glass bg-orange-500 text-white btn-xs my-1">
            <FaStopCircle className="w-4 h-4 text-error mr-2" />
            Stop All Actions
          </button>
          <button className="btn glass btn-xs my-1 text-white bg-red-600">
            <FiZapOff className="w-4 h-4 text-error-content mr-2" />
            Shutdown PHS
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickControlsBlock;
