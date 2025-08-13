import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, TrendingUp, Activity } from "lucide-react";
import type { AppSettings, DetectedSign } from "../types";
import type { HandGesture } from "../utils/signLanguageProcessor";

interface DetectionPanelProps {
  detectedSigns: DetectedSign[];
  currentGesture: HandGesture | null;
  isDetecting: boolean;
  isInitialized: boolean;
  settings: AppSettings;
  translateSign: (sign: string) => string;
}

export const DetectionPanel: React.FC<DetectionPanelProps> = ({
  detectedSigns,
  currentGesture,
  isDetecting,
  isInitialized,
  settings,
  translateSign,
}) => {
  const recentSigns = detectedSigns.slice(-5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Eye className="text-blue-500" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sign Detection
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isDetecting ? "bg-green-500 animate-pulse" : "bg-gray-300"
            }`}
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {!isInitialized
              ? "Initializing..."
              : isDetecting
              ? "Active"
              : "Inactive"}
          </span>
        </div>
      </div>

      {/* Current Gesture Display */}
      {currentGesture && isDetecting && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <Activity className="text-blue-500" size={16} />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Current: {translateSign(currentGesture.name)}
            </span>
            {settings.showConfidence && (
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
                {Math.round(currentGesture.confidence * 100)}%
              </span>
            )}
          </div>
        </motion.div>
      )}

      <div className="space-y-3 max-h-64 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {recentSigns.map((sign) => (
            <motion.div
              key={sign.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {translateSign(sign.sign)}
                  </span>
                  {sign.sign !== translateSign(sign.sign) && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({sign.sign})
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(sign.timestamp).toLocaleTimeString()}
                </div>
              </div>

              {settings.showConfidence && (
                <div className="flex items-center space-x-1">
                  <TrendingUp size={14} className="text-blue-500" />
                  <span className="text-sm font-mono text-blue-600 dark:text-blue-400">
                    {Math.round(sign.confidence * 100)}%
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {recentSigns.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Eye size={32} className="mx-auto mb-2 opacity-50" />
            <p>
              {!isInitialized
                ? "Initializing MediaPipe..."
                : "No signs detected yet"}
            </p>
            <p className="text-sm">
              {!isInitialized
                ? "Please wait..."
                : "Start detection to see results"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
