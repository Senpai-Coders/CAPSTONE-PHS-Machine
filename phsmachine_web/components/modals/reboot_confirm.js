import React from "react";
import { BsBootstrapReboot } from "react-icons/bs";

const RebootConfirm = ({ close, shown, onAccept }) => {
  return (
    <div
      className={`modal backdrop-blur-sm modal-bottom sm:modal-middle ${
        shown ? "modal-open" : ""
      }`}
    >
      <div className="modal-box">
        <div className="flex justify-between">
          <h3 className="font-bold text-lg">Reboot Confirmation</h3>
          <BsBootstrapReboot className="w-6 h-6 text-primary" />
        </div>
        <p className="py-4">
          The PHS system will be rebooted (restart). Any actions will be
          stopped. Are you sure to proceed rebooting?
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

export default RebootConfirm;
