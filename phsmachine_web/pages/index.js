import Layout from "../components/layout";
import Cameras from "../components/cameras";
import SystemState from "../components/systemState";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>System State</title>
      </Head>
      <h1 className="text-xl card-title font-lato font-semibold mb-2">
        Detection
      </h1>
      <SystemState />
      <div className="divider my-8">Realtime View</div>
      <Cameras />
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
