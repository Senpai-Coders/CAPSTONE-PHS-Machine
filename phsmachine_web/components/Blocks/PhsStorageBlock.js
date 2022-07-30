import { useEffect, useState } from "react";
import { FiHardDrive } from "react-icons/fi";

import { bytesToMegaBytes, mbToGB } from "../../helpers"

const PhsStorageBlock = ({storageInfo}) => {

  const [used, setUsed] = useState(0)
  const [free, setFree] = useState(0)
  const [size, setSize] = useState(0)

  useEffect(()=>{
    console.log(storageInfo)
    let Size = mbToGB(bytesToMegaBytes(storageInfo.size)), Free = mbToGB(bytesToMegaBytes(storageInfo.free))
    setSize(Size.toFixed(1))
    setFree(Free.toFixed(1))
    setUsed((Size - Free).toFixed(1))
  },[storageInfo])

  return (
    <div className="mb-2">
      <div className="shadow-lg rounded-2xl p-4 card bg-base-100 w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="rounded-xl relative p-2 ">
              <FiHardDrive className="text-secondary w-4 h-4" />
            </span>
            <div className="flex flex-col">
              <span className="font-bold text-md  ml-2">
                PHS Server Storage
              </span>
            </div>
          </div>
        </div>
        <p>{used} GB used out of {size} Gb</p>
        <progress
          className="mt-1 progress progress-primary"
          value={used}
          max={size}
        ></progress>
        <p className="text-warning text-xs mt-2">
          If the storage get's too small, PHS will stop saving detections & you
          must delete some detection records to free some storage
        </p>
      </div>
    </div>
  );
};

export default PhsStorageBlock;
