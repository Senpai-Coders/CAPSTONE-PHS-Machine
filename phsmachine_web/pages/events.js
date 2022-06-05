import Layout from "../components/layout";
import Head from "next/head";
import { useState } from "react";

const Events = () => {
  const [detections, setDetections] = useState([
    {
      _id: "asu0agn0a90ah0e24jy",
      thumb: "/annotated/annotated2022_06_03-09:57:47_AM.png",
      data: {
        pig_count: 2,
        stressed_pig: 2,
        actions : [
            "Mist", "Fan"
        ]
      },
      date: "6/3/2022",
    },
    {
      _id: "asu0agn0a90ah0e24jz",
      thumb: "/annotated/annotated2022_06_03-09:57:44_AM.png",
      data: {
        pig_count: 2,
        stressed_pig: 1,
        actions : [
            "Mist", "Fan"
        ]
      },
      date: "6/3/2022",
    },
    {
      _id: "asu0agn0a90ah0e24ja",
      thumb: "/annotated/annotated2022_06_03-09:55:40_AM.png",
      data: {
        pig_count: 3,
        stressed_pig: 1 ,
        actions : [
            "Mist", "Fan"
        ]
      },
      date: "6/3/2022",
    },
    {
      _id: "asu0agn0a90ah0e24jb",
      thumb: "/annotated/annotated2022_06_03-09:57:30_AM.png",
      data: {
        pig_count: 1,
        stressed_pig: 1,
        actions : [
            "Mist", "Fan"
        ]
      },
      date: "6/3/2022",
    },
  ]);

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
              <figure className="m-4 w-1/2">
                <img className=" rounded-lg" src={record.thumb}></img>
              </figure>
              <div className="w-1/2 card-body font-inter">
                <p className="font-bold text-lg">
                  {record.data.pig_count} Pigs Onframe
                </p>
                <p className="text-lg">
                  Temps:{" "}
                  <span className="font-medium text-primary">34.4°C</span>{" "}
                  {"   "}{" "}
                  <span className="font-medium text-secondary">37.4°C</span>{" "}
                  {"   "} <span className="font-medium text-error">39.4°C</span>
                </p>
                <p className="font-bold text-lg">
                  {record.data.stressed_pig} Stressed Pig
                </p>
                <p className="text-sm">{record.date}</p>
                <div className="card-actions justify-end">
                  <button className="btn">View Detection Info</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

Events.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Events;
