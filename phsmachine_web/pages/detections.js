import Layout from "../components/layout";
import Head from "next/head";
import { useState } from "react";

import DetectionList from "../components/detection";
import Statistics from "../components/detection/Statistics";

const Events = () => {
  const [tab, setTab] = useState(0);

  return (
    <>
      <Head>
        <title>Detections</title>
      </Head>

      <div className="mb-4">
        <div className="tabs">
          <a
            onClick={() => setTab(0)}
            className={`${tab === 0 ? "tab-active" : ""} tab-lg tab tab-lifted`}
          >
            Records
          </a>
          <a
            onClick={() => setTab(1)}
            className={`${tab === 1 ? "tab-active" : ""} tab-lg tab tab-lifted`}
          >
            Visualization
          </a>
        </div>
      </div>

      {/** RECORD LIST */}
      {tab === 0 && <DetectionList />}
      {tab === 1 && <Statistics />}
    </>
  );
};

Events.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Events;
