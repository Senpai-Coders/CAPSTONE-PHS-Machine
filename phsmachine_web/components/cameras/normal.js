import { useState, Fragment, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";

import { HiOutlineSelector } from "react-icons/hi";
import { AiOutlineCheck } from "react-icons/ai";

const normal = ({ canStream }) => {
  const cam_var1 = [
    {
      name: "Camera",
      stream_url: "http://192.168.1.8:8000/normal_feed",
    },
    {
        name: "Annotate",
        stream_url: "http://192.168.1.8:8000/annotate_feed",
    }
  ];

  const [camstat, setCamStat] = useState(false);
  const [view1, setView1] = useState(cam_var1[0]);

  useEffect(()=>{
    setCamStat(false)
  }, [canStream])

  return (
    <div className="">
      <div className="flex flex-wrap bg-stone-900/5 rounded-md px-2 justify-between items-center mb-3">
        <div className="w-72">
          <Listbox value={view1} onChange={setView1}>
            <div className="relative">
              <Listbox.Button className="relative bg-base-100/5 w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{view1.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiOutlineSelector className="h-5 w-5 " aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 bg-base-100/60 backdrop-blur-md mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {cam_var1.map((th, personIdx) => (
                    <Listbox.Option
                      key={personIdx}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? "opacity-100" : "opacity-75"
                        }`
                      }
                      value={th}
                    >
                      {({ view1 }) => (
                        <>
                          <span
                            className={`block truncate ${
                              view1 ? "font-medium" : "font-normal"
                            }`}
                          >
                            {th.name}
                          </span>
                          {view1 ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <AiOutlineCheck
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        <div className="flex justify-end items-center space-x-3">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              disabled={ canStream }
              className="toggle"
              checked={camstat}
              onChange={() => setCamStat(!camstat)}
            />
          </label>
          <div className="relative">
            <p
              className={` bg-stone-700 text-white px-3 py-1 rounded-xl text-xs border ${
                camstat ? "border-rose-400" : "border-stone-500"
              } `}
            >
              {camstat ? "LIVE" : "disconnected"}
            </p>
            {camstat && (
              <span className="animate-ping absolute w-2 h-2 rounded-full -top-0 right-0 bg-rose-400 opacity-95"></span>
            )}
          </div>
        </div>
      </div>
      <div className="relative">
        {camstat ? (
          <>
            <img
              className="rounded-lg w-full aspect-video"
              src={view1.stream_url}
            ></img>
          </>
        ) : (
          <div className="rounded-lg border w-full flex items-center justify-center aspect-video">
            <p className="font-lato tracking-widest text-">disconnected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default normal;
