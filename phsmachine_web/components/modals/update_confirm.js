import React from "react";
import { IoMdGitMerge } from "react-icons/io";
import { AiFillGithub } from "react-icons/ai"

const RebootConfirm = ({ close, shown, onAccept }) => {
  return (
    <div
      className={`modal backdrop-blur-sm modal-bottom sm:modal-middle ${
        shown ? "modal-open" : ""
      }`}
    >
      <div className="modal-box">
        <div className="flex justify-between">
          <h3 className="font-bold text-lg">Download & Install Update PHS</h3>
              <IoMdGitMerge className="text-3xl mr-2" />
        </div>
        <div className="py-4">
          <p>The PHS system will download update from official repository </p>
          <div className=" mt-4 flex flex-wrap space-x-2 items-center text-xs ">
            <p className="font-medium">From </p>
            <span>
              <AiFillGithub />
            </span>
            <a
              className="link font-medium"
              href="https://github.com/Senpai-Coders/CAPSTONE-PHS-Machine"
            >
              https://github.com/Senpai-Coders/CAPSTONE-PHS-Machine
            </a>
          </div>
          <p className="mt-4">The system will turn off & install the update. Do you want to proceed?</p>
          <p className="mt-4 text-xs opacity-90">Update might introduce errors or incompatible packages that might break the software, proceed at your own risk</p>
        </div>
        <div className="modal-action">
          <label
            onClick={() => {
              close();
              onAccept();
            }}
            className="btn"
          >
            Update
          </label>
          <label onClick={() => close()} className="btn">
            Cancel
          </label>
        </div>
      </div>
    </div>
  );
};

export default RebootConfirm;
