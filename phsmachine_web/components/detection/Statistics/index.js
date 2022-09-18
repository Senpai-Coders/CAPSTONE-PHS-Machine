import CalendarHeatMap from "./CalendarHeatMap";
import WeekDetection from "./WeekDetection";
import axios from "axios";
import { useEffect, useState } from "react";

const index = () => {
  const [loading, setLoading] = useState(false);
  const [detections, setDetections] = useState([]);

  const init = async (t) => {
    try {
      setLoading(true);
      const resp = await axios.post("/api/phs/detection", { mode: 0 });
      let det = resp.data.detection_data;
      setDetections(det);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="min-h-screen">
      <CalendarHeatMap loading={loading} refresh={init} data={detections} />
      <div className="divider my-8"></div>
      <WeekDetection loading={loading} refresh={init} data={detections} />
    </div>
  );
};

export default index;
