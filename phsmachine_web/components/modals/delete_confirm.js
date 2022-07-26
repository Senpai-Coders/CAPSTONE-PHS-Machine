import React from "react";
import { IoTrashBinSharp } from "react-icons/io5"

const deleteConfirm = ({ close, shown, onAccept }) => {
  return (
    <div
      className={`modal modal-bottom sm:modal-middle ${
        shown ? "modal-open" : ""
      }`}
    >
      <div className="modal-box">
        <div className="flex justify-between">
          <h3 className="font-bold text-lg">Delete</h3>
          <IoTrashBinSharp className="w-6 h-6 text-primary"/>
        </div>
        <p className="py-4">
          Selected record will be deleted forever. Are you sure to proceed?
        </p>
        <div className="modal-action">
          <label onClick={() => { close(); onAccept(); }} className="btn">
            Yes
          </label>
          <label onClick={() => close()} className="btn">
            No
          </label>
        </div>
      </div>
    </div>
  );
};

export default deleteConfirm;
