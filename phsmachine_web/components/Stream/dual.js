import React from "react";

import { PI_IP } from "../../helpers";

const triple = () => {
  return (
    <div className="md:grid md:grid-cols-2 w-full">
      {/* normal */}
      <div className="min-h-12">
        <img
          className="w-full outline outline-1 outline-base-100 rounded-sm"
          src={`http://${PI_IP}:8000/normal_feed`}
        />
      </div>
      {/* thermal */}
      <div className="min-h-12">
        <img
          className="w-full outline outline-1 outline-base-100 rounded-sm"
          src={`http://${PI_IP}:8000/thermal_feed`}
        />
      </div>
    </div>
  );
};

export default triple;
