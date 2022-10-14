import React from "react";
import {
  translateSystemState,
  translateSystemStateToIcon,
} from "../../helpers";

const SystemStateBlock = ({ SYSSTATE }) => {
  return (
    <div className="mb-2">
      <div className="shadow-lg rounded-2xl p-4 bg-base-100 w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="rounded-xl relative p-2 ">
              {translateSystemStateToIcon(SYSSTATE.status)}
            </span>
            <div className="flex flex-col">
              <span className="font-bold text-md  ml-2">System Status</span>
              <span className="text-sm ml-2">
                {translateSystemState(SYSSTATE.status)}
              </span>
              <span className="text-xs text-error ml-2">
                {SYSSTATE.status === -2 ? "core system is not running" : ""}
                {SYSSTATE.status === -1 ? "core system is disabled" : ""}
                {SYSSTATE.status === 0 ? "reading pigs..." : ""}
                {SYSSTATE.status === 1 ? "resolving found heat stress..." : ""}
                {SYSSTATE.status === 2 ? "debug/testing mode" : ""}
                {SYSSTATE.status === 3
                  ? "connecting to phs core system..."
                  : ""}
              </span>
            </div>
          </div>
        </div>
        {SYSSTATE.status === 1 && (
          <progress className="progress progress-primary"></progress>
        )}
      </div>
    </div>
  );
};

export default SystemStateBlock;
