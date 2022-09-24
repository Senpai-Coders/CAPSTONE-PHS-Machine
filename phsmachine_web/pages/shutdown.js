import { motion } from "framer-motion";
import { FiZapOff } from "react-icons/fi";

export default function shutdown() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center w-screen h-screen"
    >
      <div className="flex animate-pulse items-center space-x-4">
        <FiZapOff className="text-error text-3xl" />
        <h1 className="text-2xl font-inter">PHS is currently off</h1>
      </div>
    </motion.div>
  );
}
