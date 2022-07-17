import Layout from "../components/layout";
import Head from "next/head";
import { useEffect, useState } from "react";

import { API, tempParser } from "../helpers";
import axios from "axios";

const Events = () => {
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);

  const init = async () => {
    try {
      const resp = await axios.post("/api/phs/detection", { mode: 0 });
      setDetections(resp.data.detection_data);
      setLoading(false);
    } catch (e) { console.log(e); }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Head>
        <title>Events</title>
      </Head>
      <div className="flex items-center">
        <p className="text-xl card-title font-lato font-semibold">
          Event History
        </p>
        {loading && (
          <div className="mx-10 w-1/12 flex items-center space-x-4">
            <progress className="progress"></progress>
          </div>
        )}
      </div>
      <div className="mt-8 relative">
        <div className="grid gap-4 md:grid-cols-2">
          {detections.map((record) => (
            <div
              key={record._id}
              className="card md:card-side space-x-2 shadow-xl"
            >
              <figure className="md:w-1/2 flex">
                <img
                  className="rounded-l-lg object-cover h-full w-1/2"
                  src={record.img_normal}
                ></img>
                <img
                  className=" rounded-r-lg object-cover h-full w-1/2"
                  src={record.img_thermal}
                ></img>
              </figure>
              <div className="md:w-1/2 card-body font-inter">
                <p className="font-bold text-lg">
                  {record.data.pig_count} Pigs Onframe
                </p>
                <p className="text-lg">
                  Min Temp:{" "}
                  <span className="font-medium text-primary">{tempParser(record.data.min_temp)}{" "}°C</span>{" "}
                </p>
                <p className="text-lg">
                  Average Temp:{" "}
                  <span className="font-medium text-primary">{tempParser(record.data.avg_temp)}{" "}°°C</span>{" "}
                  {"   "}{" "}
                </p>
                <p className="text-lg">
                  Max Temp: {"   "}{" "}
                  <span className="font-medium text-error">{tempParser(record.data.max_temp)}°C</span>
                </p>
                <p className="font-bold text-lg">
                  <span className="text-warning">
                    {record.data.stressed_pig}
                  </span>{" "}
                  Stressed Pig
                </p>
                <p className="text-sm">{record.date}</p>
                <div className="card-actions justify-end">
                  <a
                    href={`/detection_details?_id=${record._id}`}
                    target="blank"
                    className="btn btn-block"
                  >
                    More Info
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!loading && detections.length === 0 && (
          <p className="tracking-wider opacity-70 text-sm font-inter text-center">
            There are 0 detections
          </p>
        )}
      </div>
    </>
  );
};

Events.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Events;
