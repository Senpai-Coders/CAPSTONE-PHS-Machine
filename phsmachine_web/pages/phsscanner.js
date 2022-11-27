import { motion } from "framer-motion";
import PhsScanner from "../components/Phs_Scanner/PhsScanner";
import Layout from "../components/layout";
import Head from "next/head";

import PhsCard from "../components/Phs_Scanner/PhsCard";

import { PI_IP } from "../helpers";
import { useEffect, useState } from "react";
import axios from "axios";

export default function phsScan() {
  axios.defaults.timeout = 4 * 1000;
  const [selected, setSelected] = useState({
    connectivity: "ok",
    server_name: "-",
    type: "-",
    ip: "-",
    url: "-",
    core_ip: "-",
    core_url: "-",
    version: "-",
  });

  const [curIp, setCurIp] = useState("-");

  const init = async () => {
    try {
      const data = await axios.get("/api/connectivity");
      setSelected({ ...data.data });
      setCurIp(data.data.ip);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      exit={{ opacity: 0 }}
      className="w-full md:justify-between md:flex"
    >
      {/* Current Device */}
      <Head>
        <title>Scan Other PHS</title>
      </Head>
      <PhsCard
        phs_data={selected}
        showConnect={selected.ip !== curIp ? true : false}
        title={selected.ip === curIp ? "Current PHS" : "Conect To"}
      />
      <div className="card w-full shadow-lg p-4">
        <PhsScanner curIp={curIp} onSwitch={setSelected} />
      </div>
    </motion.div>
  );
}

phsScan.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
