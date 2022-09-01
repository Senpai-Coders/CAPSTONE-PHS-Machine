import { motion } from "framer-motion";
import PhsScanner from "../components/Phs_Scanner/PhsScanner";
import Layout from "../components/layout";

import { PI_IP } from "../helpers";

export default function phsScan() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      exit={{ opacity: 0 }}
      className="w-full md:justify-between md:flex"
    >
      {/* Current Device */}
      <div className="shadow-lg md:mr-2 py-5 px-6 md:w-6/12 lg:w-4/12 card bg-neutral text-neutral-content">
        <p className="text-xl text-center">Currently <span className="text-success">Connected</span> To</p>
        {/* Device Info */}
        <div className="mx-2">
          <div className="flex justify-center">
            <img className="my-4" src={`http://${PI_IP}:3000/pig.png`} />
          </div>

          <p className="w-full mt-1 text-lg text-center font-light">PHS1</p>

          <p className="mt-6 font-medium  opacity-40">PHS TYPE</p>
          <p className="mt-1 text-sm">Standalone</p>

          <p className="mt-6 font-medium opacity-40">PHS IP</p>
          <p className="mt-1 text-sm">192.168.1.8</p>

          <p className="mt-6 font-medium  opacity-40">PHS URL</p>
          <p className="mt-1 text-sm">http://192.168.1.8:3000</p>

          <p className="mt-6 font-medium  opacity-40">PHS CORE URL</p>
          <p className="mt-1 text-sm">http://192.168.1.8:8000</p>
        </div>
      </div>
      <div className="card w-full shadow-lg p-4">
        <PhsScanner />
      </div>
    </motion.div>
  );
}

phsScan.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
