import React from "react";
import { motion } from "framer-motion";
import { FileText, Download, Trash2, Clock } from "lucide-react";
import type { Subtitle } from "../types";

interface SubtitleHistoryProps {
  subtitles: Subtitle[];
  onExportSRT: () => void;
  onClearHistory: () => void;
}

export const SubtitleHistory: React.FC<SubtitleHistoryProps> = ({
  subtitles,
  onExportSRT,
  onClearHistory,
}) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="text-blue-500" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Subtitle History
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExportSRT}
            disabled={subtitles.length === 0}
            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Download size={16} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClearHistory}
            disabled={subtitles.length === 0}
            className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-2">
        {subtitles.map((subtitle, index) => (
          <motion.div
            key={subtitle.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white font-medium">
                  {subtitle.text}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock size={12} className="text-gray-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(subtitle.startTime)}
                  </span>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                    {Math.round(subtitle.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {subtitles.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FileText size={32} className="mx-auto mb-2 opacity-50" />
            <p>No subtitles generated yet</p>
            <p className="text-sm">Detected signs will appear here</p>
          </div>
        )}
      </div>

      {subtitles.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {subtitles.length} subtitle{subtitles.length !== 1 ? "s" : ""}{" "}
            generated
          </p>
        </div>
      )}
    </div>
  );
};
