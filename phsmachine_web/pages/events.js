import Layout from "../components/layout";
import Head from "next/head";
import { useEffect, useState } from "react";

import { API } from "../helpers";
import axios from "axios";

const Events = () => {
  const [detections, setDetections] = useState([]);

  const init = async () => {
    try{
        const resp = await axios.post("/api/phs/detection",{ mode : 0 })
        setDetections(resp.data.detection_data)
    }catch(e){
        console.log(e)
    }
  }

  useEffect(()=>{
    init();
  }, [])

  return (
    <>
      <Head>
        <title>Events</title>
      </Head>
      <p className="text-xl card-title font-lato font-semibold">
        Event History
      </p>
      <div className="mt-8">
        <div className="grid gap-4 md:grid-cols-2">
          {detections.map((record) => (
            <div
              key={record._id}
              className="card card-side space-x-2 shadow-xl"
            >
              <figure className="w-1/2 flex space-x-4">
                <img className="rounded-l-lg object-cover h-full w-1/2" src={record.img_normal}></img>
                <img className=" rounded-r-lg object-cover h-full w-1/2" src={record.img_thermal}></img>
              </figure>
              <div className="w-1/2 card-body font-inter">
                <p className="font-bold text-lg">
                  {record.data.pig_count} Pigs Onframe
                </p>
                <p className="text-lg">
                  Min Temp:{" "}
                  <span className="font-medium text-primary">34.4°C</span>{" "}
                </p>
                <p className="text-lg">
                  Average Temp:{" "}
                  <span className="font-medium text-primary">34.4°C</span>{" "}
                  {"   "}{" "}
                </p>
                <p className="text-lg">
                  Max Temp:{" "}
                  {"   "} <span className="font-medium text-error">39.4°C</span>
                </p>
                <p className="font-bold text-lg">
                  <span className="text-warning">{record.data.stressed_pig}</span> Stressed Pig
                </p>
                <p className="text-sm">{record.date}</p>
                <div className="card-actions justify-end">
                  <button className="btn">More Info</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {
              detections.length === 0 && <p className="tracking-wider opacity-70 text-sm font-inter text-center">There are 0 detections</p>
        }
      </div>
    </>
  );
};

Events.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Events;
