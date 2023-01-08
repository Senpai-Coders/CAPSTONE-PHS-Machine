import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiRestartLine } from "react-icons/ri";
import Head from "next/head";

export default function reboot() {
  const router = useRouter();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let connectChecker = setInterval(async () => {
      try {
        if (started) return;
        const response = await axios.post("/api/connectivity");
        if (started) return;
        router.push("/");
      } catch (e) {}
    }, 10000);
    return () => clearInterval(connectChecker);
  }, []);

  return (
        <div className="gifbg bg-no-repeat bg-cover">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      exit={{ opacity: 0 }}
      className="flex backdrop-blur-xl bg-base-100/80 items-center justify-center w-screen h-screen"
    >
        <Head>
        <title>PHS Reboot</title>
      </Head>
      <div className="flex animate-pulse items-center space-x-4">
        <RiRestartLine className="animate-spin text-primary text-3xl" />
        <h1 className="text-xl font-inter">
          Please wait.. Rebooting may take a while
        </h1>
      </div>
    </motion.div></div>
  );
}
