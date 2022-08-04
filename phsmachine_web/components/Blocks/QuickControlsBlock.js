import React from "react";

import { RiRemoteControlLine } from "react-icons/ri";
import { FiZapOff } from "react-icons/fi";
import { FaStopCircle } from "react-icons/fa";
import { BsBootstrapReboot } from "react-icons/bs"

const QuickControlsBlock = ({ state, setSelectedModal }) => {
  const chooseState = (state) => {
    // do something
  };

  /**
   * 
  if (status === 0) return "Detecting";
  if (status === 1) return "Resolving";
  if (status === 2) return "Debugging";
  if (status === 3) return "Connecting";
  if (status === -1) return "Disabled";
  if (status === -2) return "Off";
   * 
   */

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
            <input
              onChange={(e) => {
                chooseState(2);
              }}
              disabled={state < 0 || state === 3}
              checked={ state === 2 }
              type="checkbox"
              className="toggle toggle-accent"
            />
          </label>
          <label className="label cursor-pointer">
            <span className="label-text">{ state === -1 ? "Enable PHS" : "Disable PHS" }</span>
            <input
              onChange={(e) => {
                chooseState(state === -1 ? 0 : -1);
              }}
              disabled={state < 0 || state === 3}
              checked={ state === -1 }
              type="checkbox"
              className="toggle toggle-accent"
            />
          </label>
          {/* <label className="label cursor-pointer">
            <span className="label-text">Stop Camera's</span>
            <input
              onChange={(e) => {
                chooseState(2);
              }} type="checkbox" className="toggle toggle-accent" />
          </label> */}
          <button disabled={state < 0 || state === 3} className="btn glass bg-orange-500 text-white btn-xs my-1">
            <FaStopCircle className="w-4 h-4 text-error mr-2" />
            Stop All Actions
          </button>
          <button onClick={()=>setSelectedModal(-2)} className="btn glass btn-xs my-1 text-gray-400 bg-red-600">
            <FiZapOff className="w-4 h-4 text-error-content mr-2" />
            Shutdown PHS
          </button>          
          <button onClick={()=>setSelectedModal(-3)} className="btn glass btn-xs my-1 text-gray-400 bg-slate-700">
            <BsBootstrapReboot className="w-4 h-4 text-error-content mr-2" />
            Reboot PHS
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickControlsBlock;
