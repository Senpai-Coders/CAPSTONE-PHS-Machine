import Layout from "../components/layout";
import Head from "next/head";

const analysis = () => {
  return (
    <>
      <Head>
        <title>Analysis</title>
      </Head>
      <p className="text-xl card-title font-lato font-semibold">Analysis</p>
    </>
  );
};

analysis.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default analysis;
