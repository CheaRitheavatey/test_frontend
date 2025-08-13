import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppSettings } from "../types";

interface SubtitleOverlayProps {
  currentSubtitle: string;
  settings: AppSettings;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  currentSubtitle,
  settings,
}) => {
  const getPositionClasses = () => {
    switch (settings.subtitlePosition) {
      case "top":
        return "top-8";
      case "center":
        return "top-1/2 -translate-y-1/2";
      case "bottom":
      default:
        return "bottom-8";
    }
  };

  const getSizeClasses = () => {
    switch (settings.subtitleSize) {
      case "small":
        return "text-lg px-3 py-1.5";
      case "large":
        return "text-2xl px-6 py-3";
      case "medium":
      default:
        return "text-xl px-4 py-2";
    }
  };

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 ${getPositionClasses()} z-10`}
    >
      <AnimatePresence mode="wait">
        {currentSubtitle && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className={`
              ${getSizeClasses()}
              bg-black/80 backdrop-blur-sm text-white rounded-lg
              font-medium text-center max-w-4xl mx-auto
              border border-white/20 shadow-2xl
              ${settings.theme === "dark" ? "bg-gray-900/90" : "bg-black/80"}
            `}
            style={{
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            {currentSubtitle}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
