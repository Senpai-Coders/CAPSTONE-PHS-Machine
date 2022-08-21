import { useState, useEffect } from "react";

import { RiListSettingsLine, RiTimerFill } from "react-icons/ri";
import { AiFillThunderbolt } from "react-icons/ai";

const ActionBlock = ({ db_actions, phsActions, state }) => {
  const [mergedActions, setMergedActions] = useState([]);
  const getMatchingAction = (action) => {
    let toReturn = { state: false, duration: "-", caller: "-" };
    if (!phsActions || phsActions.length === 0) return toReturn;
    else
      for (var x = 0; x < phsActions.length; x++) {
        if (phsActions[x].config_name === action.config_name) {
          toReturn = { ...phsActions[x] };
          break;
        }
      }
    return toReturn;
  };

  useEffect(() => {
    let merge = [...db_actions];

    if (state >= 0 && state !== 3)
      for (var x = 0; x < merge.length; x++) {
        let new_fields = getMatchingAction(merge[x]);
        merge[x] = { ...merge[x], ...new_fields };
      }

    setMergedActions(merge);
  }, [db_actions]);

  const getActiveStyle = (state) => {
    return state
      ? "animate-pulse py-2 px-4 bg-blue-100 dark:bg-gray-800 text-gray-600 border-l-4 border-primary flex items-center justify-between"
      : "py-2 px-4 text-gray-600 flex items-center justify-between border-b border-stone-600";
  };

  const getIconActiveStyle = (state) => {
    return state ? "text-accent mr-2 h-5 w-5" : "text-gray-600 mr-2 h-5 w-5";
  };

  return (
    <div className="mb-4">
      <div className="shadow-lg rounded-2xl card bg-base-100 w-full">
        <div className="flex items-center p-4 justify-between">
          <div className="flex justify-start items-center">
            <RiListSettingsLine className="h-7 w-7 text-primary mr-2" />
            <p className="font-bold text-md ">Actions</p>
          </div>
          <a href="/configuration" className="text-sm p-1 text-primary">
            Manage Actions
          </a>
        </div>
        <div className="mb-6">
          {mergedActions.map((action, idx) => (
            <div key={idx} className={getActiveStyle(action.state)}>
              <div>
                <p className="text-xs mb-1 flex items-center dark:text-white">
                  <RiTimerFill className={getIconActiveStyle(action.state)} />
                  {action.config_name}
                </p>
                <p className="text-xs">{action.value.target_relay}</p>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-400 mr-2 ml-2 md:ml-4">
                  {action.state ? "Active" : "Stndby"}
                </span>
                {action.state && (
                  <span className="countdown text-xs text-accent mr-1">
                    <span style={{ "--value": action.elapsed }}></span>s
                  </span>
                )}
                <AiFillThunderbolt
                  className={getIconActiveStyle(action.state)}
                />
              </div>
            </div>
          ))}

          {mergedActions.length === 0 && (
            <p className="opacity-40 text-center my-2 text-sm">No Actions</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionBlock;
