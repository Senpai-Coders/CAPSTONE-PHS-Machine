import Layout from "../components/layout";
import Head from "next/head";
import { useState } from "react";

import DetectionList from "../components/detection";

const Events = () => {
  const [tab, setTab] = useState(0);

  return (
    <>
      <Head>
        <title>Detections</title>
      </Head>


      {/* <div className="flex items-center">
        <p className="text-xl card-title font-lato font-semibold">
          Event History
        </p>
        {loading && (
          <div className="mx-10 w-1/12 flex items-center space-x-4">
            <progress className="progress"></progress>
          </div>
        )}
      </div> */}

      <div className="mb-4">
        <div className="tabs">
          <a
            onClick={() => setTab(0)}
            className={`${tab === 0 ? "tab-active" : ""} tab-lg tab tab-lifted`}
          >
            Heat Stress Events
          </a>
          <a
            onClick={() => setTab(1)}
            className={`${tab === 1 ? "tab-active" : ""} tab-lg tab tab-lifted`}
          >
            Statistics
          </a>
        </div>
      </div>

      {/** RECORD LIST */}
      {tab === 0 && <DetectionList />}
    </>
  );
};

Events.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Events;
