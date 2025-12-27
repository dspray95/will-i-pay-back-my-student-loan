import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CarouselProps {
  currentStepIndex: number;
  children: React.ReactNode;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    position: "absolute" as const,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    position: "relative" as const,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    position: "absolute" as const,
  }),
};

export const Carousel = ({ currentStepIndex, children }: CarouselProps) => {
  const [[page, direction], setPage] = useState([currentStepIndex, 0]);

  useEffect(() => {
    // Only update if the index actually changed
    if (currentStepIndex !== page) {
      const newDirection = currentStepIndex > page ? 1 : -1;
      setPage([currentStepIndex, newDirection]);
    }
  }, [currentStepIndex, page]);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-background">
      <div className="max-w-4xl mx-auto w-full relative min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full"
          >
            <div className="p-8">{children}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
