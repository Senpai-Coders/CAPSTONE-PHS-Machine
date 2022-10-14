import React from "react";
import { FiZapOff } from "react-icons/fi";
const off_alert = ({ close, shown }) => {
  return (
    <div
      className={`modal backdrop-blur-sm modal-bottom sm:modal-middle ${
        shown ? "modal-open" : ""
      }`}
    >
      <div className="modal-box">
        <div className="flex justify-between">
          <h3 className="font-bold text-lg">PHS Server Is Off</h3>
          <FiZapOff className="text-error w-6 h-6" />
        </div>
        <p className="py-4">
          The PHS server is currently off. The system cannot detect Pig Heat
          Stress & you cannot change some of the system configurations.
        </p>
        <div className="modal-action">
          <label onClick={() => close()} className="btn">
            Ok
          </label>
        </div>
      </div>
    </div>
  );
};

export default off_alert;
