import React from "react";
import { motion } from "framer-motion";
import { Settings, Globe, Type, Monitor, Eye, Sliders } from "lucide-react";
import type { AppSettings } from "../types";

interface SettingsPanelProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
}) => {
  const updateSetting = (key: keyof AppSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="text-blue-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Settings
        </h3>
      </div>

      <div className="space-y-6">
        {/* Language Settings */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Globe size={16} className="text-gray-600 dark:text-gray-400" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Output Language
            </label>
          </div>
          <select
            value={settings.language}
            onChange={(e) => updateSetting("language", e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="english">English</option>
            <option value="spanish">Español</option>
            <option value="khmer">ខ្មែរ</option>
          </select>
        </div>

        {/* Model Selection */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Monitor size={16} className="text-gray-600 dark:text-gray-400" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Detection Model
            </label>
          </div>
          <select
            value={settings.modelType}
            onChange={(e) => updateSetting("modelType", e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="basic">Basic ASL</option>
            <option value="advanced">Advanced ASL</option>
            <option value="multilingual">Multilingual</option>
          </select>
        </div>

        {/* Subtitle Position */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Type size={16} className="text-gray-600 dark:text-gray-400" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Subtitle Position
            </label>
          </div>
          <div className="flex space-x-2">
            {["top", "center", "bottom"].map((position) => (
              <motion.button
                key={position}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateSetting("subtitlePosition", position)}
                className={`flex-1 p-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.subtitlePosition === position
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {position.charAt(0).toUpperCase() + position.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Subtitle Size */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Type size={16} className="text-gray-600 dark:text-gray-400" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Subtitle Size
            </label>
          </div>
          <div className="flex space-x-2">
            {["small", "medium", "large"].map((size) => (
              <motion.button
                key={size}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateSetting("subtitleSize", size)}
                className={`flex-1 p-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.subtitleSize === size
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Confidence Settings */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Sliders size={16} className="text-gray-600 dark:text-gray-400" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Min Confidence: {Math.round(settings.minConfidence * 100)}%
            </label>
          </div>
          <input
            type="range"
            min="0.5"
            max="1"
            step="0.05"
            value={settings.minConfidence}
            onChange={(e) =>
              updateSetting("minConfidence", parseFloat(e.target.value))
            }
            className="w-full"
          />
        </div>

        {/* Toggle Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye size={16} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show Confidence Scores
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showConfidence}
                onChange={(e) =>
                  updateSetting("showConfidence", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
