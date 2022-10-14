import React from "react";
import { IoTrashBinSharp } from "react-icons/io5";

const deleteConfirm = ({ close, shown, onAccept, deleteWhat }) => {
  return (
    <div
      className={`modal backdrop-blur-sm modal-bottom sm:modal-middle ${
        shown ? "modal-open" : ""
      }`}
    >
      <div className="modal-box">
        <div className="flex justify-between">
          <h3 className="font-bold text-lg">Delete</h3>
          <IoTrashBinSharp className="w-6 h-6 text-primary" />
        </div>
        <p className="py-4">
          Selected {deleteWhat ? deleteWhat : "record"} will be deleted forever.
          Are you sure to proceed?
        </p>
        <div className="modal-action">
          <label
            onClick={() => {
              close(-1);
              onAccept();
            }}
            className="btn"
          >
            Yes
          </label>
          <label onClick={() => close(-1)} className="btn">
            No
          </label>
        </div>
      </div>
    </div>
  );
};

export default deleteConfirm;
