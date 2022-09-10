import { useState } from "react";

import HeatmapRaw from "./heatmapRaw";
import { appendToFSUrl, tempParser } from "../../helpers";

const index = ({ data, nth }) => {
  const [toggleRaw, setToggleRaw] = useState(false);

  return (
    <div
      className={`p-4 ${
        toggleRaw ? "h-[40rem]" : "h-[24rem]"
      } gap-4 flex justify-between items-center`}
    >
      <div className="w-5/12 shadow-xl mockup-window border h-full">
        {/* <img className="h-40" src={appendToFSUrl(data.normal_thumb)} /> */}
        <div className="p-4">
          <p className="text-lg" onClick={() => setToggleRaw(!toggleRaw)}>
            Info
          </p>
          <div className="mt-2 font-inter">
            {data.info ? (
              <>
                <p className="text-lg">
                  Min Temp:{" "}
                  <span className="font-medium text-primary">
                    {tempParser(data.info.min_temp, 1)} °C
                  </span>{" "}
                </p>
                <p className="text-lg">
                  Average Temp:{" "}
                  <span className="font-medium text-primary">
                    {tempParser(data.info.avg_temp, 1)} °C
                  </span>{" "}
                  {"   "}{" "}
                </p>
                <p className="text-lg">
                  Max Temp: {"   "}{" "}
                  <span className="font-medium text-error">
                    {tempParser(data.info.max_temp, 1)} °C
                  </span>
                </p>
              </>
            ) : (
              <p className="text-xs opacity-80"> No Sub Info To Show </p>
            )}
          </div>
        </div>
      </div>
      <div className="h-full w-full card bg-neutral p-4">
        {!toggleRaw && (
          <div
            className={`duration-300 gap-4 flex items-center relative h-full shadow-xl rounded-lg`}
          >
            <div className="w-1/2 h-full">
              <img
                className={`h-full w-full coverStretch rounded-lg `}
                src={appendToFSUrl(data.normal_thumb)}
              />
            </div>
            <div className="w-1/2 h-full">
              <img
                className="h-full w-full rounded-lg saturate-200"
                src={appendToFSUrl(data.thermal_thumb)}
              />
            </div>
          </div>
        )}
        {toggleRaw && (
          <HeatmapRaw
            textColor={"#7d6d72"}
            title={`Raw HeatMap`}
            subTitle={`Pig ${nth + 1}`}
            data={data.raw}
          />
        )}
      </div>
    </div>
  );
};

export default index;
