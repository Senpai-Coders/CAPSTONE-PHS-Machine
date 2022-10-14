import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiReset } from "react-icons/bi";

export default function reset() {
  const router = useRouter();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    let {
      default_users,
      settings,
      notifications,
      detections,
      del_user_photos,
      del_detect_files,
      del_exports,
      del_errors,
      del_system_logs,
      passed,
    } = router.query;

    default_users = default_users === "true";
    settings = settings === "true";
    notifications = notifications === "true";
    detections = detections === "true";
    del_user_photos = del_user_photos === "true";
    del_detect_files = del_detect_files === "true";
    del_exports = del_exports === "true";
    del_errors = del_errors === "true";
    del_system_logs = del_system_logs === "true";
    passed = passed === "true";

    console.log(
      del_user_photos,
      del_detect_files,
      del_exports,
      del_errors,
      del_system_logs,
      passed
    );

    if (passed) {
      reset(
        default_users,
        settings,
        notifications,
        detections,
        del_user_photos,
        del_detect_files,
        del_exports,
        del_errors,
        del_system_logs
      );
    }
  }, [router.isReady, router]);

  const reset = async (
    default_users,
    settings,
    notifications,
    detections,
    del_user_photos,
    del_detect_files,
    del_exports,
    del_errors,
    del_system_logs
  ) => {
    const callReset = await axios.post("api/init/", {
      default_users,
      settings,
      detections,
      notifications,
      del_detect_files,
      del_user_photos,
      del_exports,
      del_errors,
      del_system_logs,
    });
  };

  useEffect(() => {
    let connectChecker = setInterval(async () => {
      try {
        if (started) return;
        const response = await axios.post("/api/connectivity");
        if (started) return;
        router.push("/auth/signin");
      } catch (e) {}
    }, 3000);
    return () => clearInterval(connectChecker);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center w-screen h-screen"
    >
      <div className="flex animate-pulse items-center space-x-4">
        <BiReset className="text-primary text-3xl" />
        <h1 className="text-sm md:text-xl font-inter">
          Reset may take a while...
        </h1>
      </div>
    </motion.div>
  );
}
