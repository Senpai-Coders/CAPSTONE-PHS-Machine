import Layout from "../components/layout";
import Head from "next/head";
import { useState } from "react";

import WebLogs from "../components/SystemLogs/weblogs";
import CoreLogs from "../components/SystemLogs/corelogs";

const Events = () => {
  const [tab, setTab] = useState(0);

  return (
    <>
      <Head>
        <title>System Logs</title>
      </Head>

      <div className="mb-4">
        <div className="tabs ">
          <a
            onClick={() => setTab(0)}
            className={`${
              tab === 0 ? "tab-active" : ""
            } tab-sm md:tab-md tab tab-lifted`}
          >
            PHS Web Logs
          </a>
          <a
            onClick={() => setTab(1)}
            className={`${
              tab === 1 ? "tab-active" : ""
            } tab-sm md:tab-md tab tab-lifted`}
          >
            PHS Core Logs
          </a>
        </div>
      </div>

      {tab === 0 && <WebLogs />}
      {tab === 1 && <CoreLogs />}
    </>
  );
};

Events.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Events;
