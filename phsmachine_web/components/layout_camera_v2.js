import { useState } from "react";
import CamLayout_Side from "./cameras_v2/3_Side_Cams";

const cameras = ({ canStream }) => {
  const [viewMode, setViewMode] = useState(0);

  return (
    <div className="">
      {viewMode == 0 && <CamLayout_Side canStream={canStream} />}
    </div>
  );
};

export default cameras;
