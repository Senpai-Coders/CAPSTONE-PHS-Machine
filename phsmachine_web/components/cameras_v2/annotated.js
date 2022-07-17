import { useState, Fragment, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";

import { HiOutlineSelector } from "react-icons/hi";
import { AiOutlineCheck } from "react-icons/ai";

const PI_IP = process.env.PI_IP

const normal = ({ canStream }) => {
       // stream_url: `http://${PI_IP}:8000/annotate_feed`,
  const [camstat, setCamStat] = useState(false);

  useEffect(()=>{
    setCamStat(canStream)
  }, [canStream])

  return (
    <div className="">
      <div className="relative">
        {camstat ? (
          <>
            <img
              className="rounded-lg w-full aspect-video"
              src={`http://${PI_IP}:8000/annotate_feed`}
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
