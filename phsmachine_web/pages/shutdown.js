import { motion } from "framer-motion";
import { FiZapOff } from "react-icons/fi";
import Head from "next/head";

export default function shutdown() {
  return (
    <div className="gifbg bg-no-repeat bg-cover">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      exit={{ opacity: 0 }}
      className="flex items-center backdrop-blur-xl bg-base-100/80 justify-center w-screen h-screen"
    >
      <Head>
        <title>PHS Shutdown</title>
      </Head>
      <div className="flex animate-pulse items-center space-x-4">
        <FiZapOff className="text-error text-3xl" />
        <h1 className="text-2xl font-inter">PHS is currently off</h1>
      </div>
    </motion.div>
    </div>
  );
}
