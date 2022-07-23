import React from "react";
import { RiLayout4Fill } from "react-icons/ri";

const StreamLayoutBlock = ({ layout, set }) => {
  return (
    <div class="mb-4 mx-0 sm:ml-4 xl:mr-4">
      <div class="shadow-lg rounded-2xl card bg-base-100 w-full">
        <div className="p-4 flex items-center justify-start">
          <RiLayout4Fill className="w-7 h-7 text-secondary" />
          <p class="ml-1 font-bold text-md">Stream Layout Mode</p>
        </div>
        <div className="form-control mx-4 mb-4">
          <label className="label cursor-pointer">
            <span className="label-text">Triple View</span>
            <input
              type="checkbox"
              onChange={() => set(0)}
              className="toggle toggle-accent"
              checked={layout === 0}
            />
          </label>
          <label className="label cursor-pointer">
            <span className="label-text">Dual View</span>
            <input
              type="checkbox"
              onChange={() => set(1)}
              className="toggle toggle-accent"
              checked={layout === 1}
            />
          </label>
          <label className="label cursor-pointer">
            <span className="label-text">Merged (Cam & Thermal)</span>
            <input
              type="checkbox"
              onChange={() => set(2)}
              className="toggle toggle-accent"
              checked={layout === 2}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default StreamLayoutBlock;
