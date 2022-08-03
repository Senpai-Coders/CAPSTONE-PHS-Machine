import React from "react";
import { AiOutlineInfo } from "react-icons/ai"

const deleteConfirm = ({ close, shown, onAccept, onAcceptText, title, content}) => {
  return (
    <div
      className={`modal backdrop-blur-sm modal-bottom sm:modal-middle ${
        shown ? "modal-open" : ""
      }`}
    >
      <div className="modal-box">
        <div className="flex justify-between">
          <h3 className="font-bold text-lg">{title}</h3>
          <AiOutlineInfo className="w-6 h-6 text-primary"/>
        </div>
        { content }
        <div className="modal-action">
          <label onClick={() => close(-1)} className="btn">
            {onAcceptText}
          </label>
        </div>
      </div>
    </div>
  );
};

export default deleteConfirm;
