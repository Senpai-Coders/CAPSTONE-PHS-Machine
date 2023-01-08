import { motion } from "framer-motion";

export default function _404() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center w-screen h-screen"
    >
      <div>
        <h1 className="text-3xl font-inte font-light">404 | Page Not Found</h1>
      </div>
    </motion.div>
  );
}
