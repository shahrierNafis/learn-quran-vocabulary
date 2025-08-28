import { motion } from "framer-motion";
import React from "react";

export default function MotionDiv({ children, key, ...props }: { children: React.ReactNode; key?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      {...{ key }}
      transition={{ duration: 0.25, type: "tween" }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      layout
    >
      <div {...{ key, ...props }}>{children}</div>
    </motion.div>
  );
}
