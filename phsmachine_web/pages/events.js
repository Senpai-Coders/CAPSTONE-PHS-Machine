import Layout from "../components/layout";
import Head from "next/head";

const Events = () => {
  return (
    <>
      <Head>
        <title>Events</title>
      </Head>
      <p className="text-xl card-title font-lato font-semibold"></p>
    </>
  );
};

Events.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Events;
