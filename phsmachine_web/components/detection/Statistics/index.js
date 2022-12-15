import CalendarHeatMap from "./CalendarHeatMap";
import WeekDetection from "./WeekDetection";
import axios from "axios";
import { useEffect, useState } from "react";

const index = () => {
  const [loading, setLoading] = useState(false);
  const [detections, setDetections] = useState([]);

  const init = async (t) => {
    try {
    //   setLoading(true);
    //   const resp = await axios.post("/api/phs/detection", { mode: 0 });
    //   let det = resp.data.detection_data;
    //   setDetections(det);
    //   setLoading(false);

    setLoading(true)
    const response = fetch("/api/phs/detection", {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode : 0
        }),
      })
        .then((response) => response.json())
        .then((data) => {
            setDetections(data.detection_data);
            setLoading(false);
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="min-h-screen">
      { loading && 
      <p className="text-center mx-auto opacity-60 text-sm">loading data may take a while</p> }
      <CalendarHeatMap loading={loading} refresh={init} data={detections} />
      <div className="divider my-8"></div>
      <WeekDetection loading={loading} refresh={init} data={detections} />
    </div>
  );
};

export default index;
