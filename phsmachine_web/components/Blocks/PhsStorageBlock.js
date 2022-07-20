import { FiHardDrive } from "react-icons/fi";

const PhsStorageBlock = () => {
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
        <p>6.4 used out of 32Gb</p>
        <progress
          className="mt-1 progress progress-primary"
          value={6.4}
          max={32}
        ></progress>
        <p className="text-warning text-xs mt-2">If the storage get's too small, PHS will stop saving detections & you must delete some detection records to free some storage</p>
      </div>
    </div>
  );
};

export default PhsStorageBlock;
