import React, { useRef, useState, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Upload, RotateCcw } from "lucide-react";
import { VideoState } from "../types";
import { motion } from "framer-motion";

interface VideoPlayerProps {
  isLiveMode: boolean;
  onModeChange: (isLive: boolean) => void;
  cameraRef: React.RefObject<HTMLVideoElement>;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onVideoLoad?: (video: HTMLVideoElement) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  isLiveMode,
  onModeChange,
  cameraRef,
  canvasRef,
  onVideoLoad,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLVideoElement>(null);
  const [videoState, setVideoState] = useState<VideoState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
  });

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && videoFileRef.current) {
        const url = URL.createObjectURL(file);
        videoFileRef.current.src = url;
        videoFileRef.current.load();
        onModeChange(false);
        if (onVideoLoad) {
          onVideoLoad(videoFileRef.current);
        }
      }
    },
    [onModeChange, onVideoLoad]
  );

  const togglePlayPause = useCallback(() => {
    if (videoFileRef.current) {
      if (videoState.isPlaying) {
        videoFileRef.current.pause();
      } else {
        videoFileRef.current.play();
      }
    }
  }, [videoState.isPlaying]);

  const handleVolumeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const volume = parseFloat(event.target.value);
      setVideoState((prev) => ({ ...prev, volume }));
      if (videoFileRef.current) {
        videoFileRef.current.volume = volume;
      }
    },
    []
  );

  const toggleMute = useCallback(() => {
    setVideoState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
    if (videoFileRef.current) {
      videoFileRef.current.muted = !videoState.isMuted;
    }
  }, [videoState.isMuted]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
      <div className="aspect-video relative">
        {isLiveMode ? (
          <>
            <video
              ref={cameraRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ display: "none" }}
            />
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              className="w-full h-full object-cover"
            />
          </>
        ) : (
          <video
            ref={videoFileRef}
            className="w-full h-full object-cover"
            onLoadedMetadata={() => {
              if (videoFileRef.current) {
                setVideoState((prev) => ({
                  ...prev,
                  duration: videoFileRef.current!.duration,
                }));
              }
            }}
            onTimeUpdate={() => {
              if (videoFileRef.current) {
                setVideoState((prev) => ({
                  ...prev,
                  currentTime: videoFileRef.current!.currentTime,
                }));
              }
            }}
            onPlay={() =>
              setVideoState((prev) => ({ ...prev, isPlaying: true }))
            }
            onPause={() =>
              setVideoState((prev) => ({ ...prev, isPlaying: false }))
            }
          />
        )}

        {/* Video overlay indicator */}
        <div className="absolute top-4 left-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isLiveMode
                ? "bg-red-500/90 text-white"
                : "bg-blue-500/90 text-white"
            }`}
          >
            {isLiveMode ? "🔴 LIVE" : "📹 VIDEO"}
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onModeChange(true);
                if (videoFileRef.current) {
                  videoFileRef.current.pause();
                }
              }}
              className={`p-2 rounded-lg transition-colors ${
                isLiveMode
                  ? "bg-red-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <RotateCcw size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-lg transition-colors ${
                !isLiveMode
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <Upload size={20} />
            </motion.button>

            {!isLiveMode && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlayPause}
                className="p-2 rounded-lg bg-white text-black hover:bg-gray-200 transition-colors"
              >
                {videoState.isPlaying ? (
                  <Pause size={20} />
                ) : (
                  <Play size={20} />
                )}
              </motion.button>
            )}
          </div>

          {!isLiveMode && (
            <div className="flex items-center space-x-4 text-white text-sm">
              <span>
                {formatTime(videoState.currentTime)} /{" "}
                {formatTime(videoState.duration)}
              </span>

              <div className="flex items-center space-x-2">
                <button onClick={toggleMute}>
                  {videoState.isMuted ? (
                    <VolumeX size={16} />
                  ) : (
                    <Volume2 size={16} />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={videoState.volume}
                  onChange={handleVolumeChange}
                  className="w-20"
                />
              </div>
            </div>
          )}
        </div>

        {!isLiveMode && videoState.duration > 0 && (
          <div className="mt-2">
            <div className="w-full bg-gray-600 rounded-full h-1">
              <div
                className="bg-blue-500 h-1 rounded-full transition-all"
                style={{
                  width: `${
                    (videoState.currentTime / videoState.duration) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
