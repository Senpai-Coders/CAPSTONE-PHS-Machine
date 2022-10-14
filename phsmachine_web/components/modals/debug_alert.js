import React from "react";

const debug_alert = ({ close, selectedModal }) => {
  return (
    <div
      className={`modal backdrop-blur-sm modal-bottom sm:modal-middle ${
        selectedModal === 1 ? "modal-open" : ""
      }`}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">PHS Server Is Off</h3>
        <p className="py-4">
          The system seems off or not working.. The system cannot detect Pig
          Heat Stress & you cannot change some of the system configurations.
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

export default debug_alert;
