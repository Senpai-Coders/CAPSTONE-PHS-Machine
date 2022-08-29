import React from "react";

import { PI_IP } from "../../helpers";

const triple = () => {
  return (
    <div className="relative" style={{ height: "calc(100vh * 0.70)" }}>
      <img
        style={{ height: "calc(100vh * 0.70)" }}
        className="w-full object-fill absolute outline outline-1 outline-base-200 rounded-sm left-0 top-0"
        src={`http://${PI_IP}:8000/normal_feed`}
      />
      <img
        style={{ height: "calc(100vh * 0.70)" }}
        className="w-full object-fill saturate-100 absolute left-0 top-0 opacity-60"
        src={`http://${PI_IP}:8000/thermal_feed`}
      />
    </div>
  );
};

export default triple;
