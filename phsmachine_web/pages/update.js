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
    fetch(`/api/phs/phsUpdate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: 1,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        
      })
      .catch(function (error) {

      });

    axios.post("/api/phs/config/power", { mode: 1 });
  }, []);

  useEffect(() => {
    let connectChecker = setInterval(async () => {
      try {
        if (started) return;
        const response = await axios.post("/api/connectivity");
        if (started) return;
        router.push("/");
      } catch (e) {}
    }, 3000);
    return () => clearInterval(connectChecker);
  }, []);

  return (
    <div className="gifbg bg-no-repeat bg-cover">
      <Head>
        <title>PHS Update</title>
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        exit={{ opacity: 0 }}
        className="flex items-center backdrop-blur-xl bg-base-100/80 justify-center w-screen h-screen"
      >
        <div className="p-4 md:p-0 items-center text-center space-x-4">
          <img src="/pig.png" className="mx-auto animate-bounce" />
          <h1 className="text-lg opacity-90 font-inter mt-4">
            Doing Update.. Update may take a while
          </h1>
          <p className="text-sm mt-2 opacity-70">
            PHS will automatically redirect you after the update
          </p>
        </div>
      </motion.div>
    </div>
  );
}
