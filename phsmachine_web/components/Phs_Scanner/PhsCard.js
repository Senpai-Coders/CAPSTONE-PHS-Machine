import { useEffect, useState } from 'react';
import { mbToGB, bytesToMegaBytes, getPercentUsage } from "../../helpers";

import { GrConnect } from "react-icons/gr"

const PhsCard = ({ phs_data, showConnect, title }) => {

  const [used, setUsed] = useState(0)
  const [free, setFree] = useState(0)
  const [size, setSize] = useState(0)
  const [perc, setPerc] = useState(0)

  useEffect(()=>{
    if(!phs_data.storage) return; 
    let Size = mbToGB(bytesToMegaBytes(phs_data.storage.size)), Free = mbToGB(bytesToMegaBytes(phs_data.storage.free)), Used = Size - Free

    setSize(Size.toFixed(1))
    setFree(Free.toFixed(1))
    setUsed((Used).toFixed(1))
    setPerc(getPercentUsage(Size, Used))
  },[phs_data])

  return (
    <div className="shadow-lg md:mr-2 py-5 px-6 md:w-6/12 lg:w-4/12 card bg-neutral text-neutral-content">
      <p className="text-xl text-center">{title}</p>
      {/* Device Info */}
      <div className="mx-2">
        <div className="flex justify-center">
          <img className="my-4" src={phs_data.url+'/pig.png'} />
        </div>

        <p className="w-full mt-1 text-xl text-center font-inter font-bold">
          PHS1
        </p>

        <div className="mt-4 flex items-center justify-between">
          <p className=" font-medium  opacity-40">PHS TYPE</p>
          <p className="text-xs">{phs_data.type}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="font-medium opacity-40">PHS IP</p>
          <p className="text-xs">{phs_data.ip}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="font-medium  opacity-40">PHS URL</p>
          <p className="text-xs">{phs_data.url}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="font-medium  opacity-40">PHS CORE URL</p>
          <p className="text-xs">{phs_data.core_url}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="font-medium  opacity-40">PHS VERSION</p>
          <p className="text-xs">{phs_data.version}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="font-medium  opacity-40">Storage</p>
          <div className="flex items-center justify-center w-1/2">
            <progress
              className="progress progress-accent w-6/12 mr-2"
              value={used}
          max={size}
            ></progress>
            <p className="text-xs">{perc.toFixed(1)}% Used</p>
          </div>
        </div>

        {
            showConnect && <a className="btn gap-4 mt-4 btn-block btn-secondary" href={phs_data.url}>Connect </a>
        }
      </div>
    </div>
  );
};

export default PhsCard;
