import React from "react";
import { FiZapOff } from "react-icons/fi";
const ShutdownConfirm = ({ close, shown, onAccept }) => {
  return (
    <div
      className={`modal backdrop-blur-sm modal-bottom sm:modal-middle ${
        shown ? "modal-open" : ""
      }`}
    >
      <div className="modal-box">
        <div className="flex justify-between">
          <h3 className="font-bold text-lg">Shutdown Confirmation</h3>
          <FiZapOff className="text-error w-6 h-6" />
        </div>
        <p className="py-4">
          The PHS system will be shutdown (entirely). You can start it back
          again by turning the power supply 'off' 'on'. Are you sure to proceed?
        </p>
        <div className="modal-action">
          <label
            onClick={() => {
              close();
              onAccept();
            }}
            className="btn"
          >
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

export default ShutdownConfirm;
