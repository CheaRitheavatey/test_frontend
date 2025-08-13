import { useState, useEffect, useCallback, useRef } from "react";
import { useMediaPipeDetection } from "./hooks/useMediapipeDetection";
import type { AppSettings } from "./types";
// import { DetectedSign, AppSettings } from "../types";
// import { useMediaPipeDetection } from "./useMediaPipeDetection";

const SIGN_TRANSLATIONS = {
  english: {
    Hello: "Hello",
    "Thank you": "Thank you",
    Please: "Please",
    Sorry: "Sorry",
    Yes: "Yes",
    No: "No",
    Help: "Help",
    Good: "Good",
    Bad: "Bad",
    Happy: "Happy",
    Sad: "Sad",
    Love: "Love",
    Family: "Family",
    Work: "Work",
    Home: "Home",
  },
  spanish: {
    Hello: "Hola",
    "Thank you": "Gracias",
    Please: "Por favor",
    Sorry: "Lo siento",
    Yes: "Sí",
    No: "No",
    Help: "Ayuda",
    Good: "Bueno",
    Bad: "Malo",
    Happy: "Feliz",
    Sad: "Triste",
    Love: "Amor",
    Family: "Familia",
    Work: "Trabajo",
    Home: "Casa",
  },
  khmer: {
    Hello: "សួស្តី",
    "Thank you": "អរគុណ",
    Please: "សូម",
    Sorry: "សុំទោស",
    Yes: "បាទ",
    No: "ទេ",
    Help: "ជួយ",
    Good: "ល្អ",
    Bad: "មិនល្អ",
    Happy: "រីករាយ",
    Sad: "ព្រួយ",
    Love: "ស្រលាញ់",
    Family: "គ្រួសារ",
    Work: "ការងារ",
    Home: "ផ្ទះ",
  },
};

export const useSignDetection = (settings: AppSettings) => {
  const {
    isInitialized,
    isDetecting,
    currentGesture,
    detectedSigns: rawDetectedSigns,
    canvasRef,
    startDetection: startMediaPipeDetection,
    stopDetection: stopMediaPipeDetection,
    clearDetections: clearMediaPipeDetections,
  } = useMediaPipeDetection();

  // Filter signs based on confidence threshold
  const detectedSigns = rawDetectedSigns.filter(
    (sign) => sign.confidence >= settings.minConfidence
  );

  const startDetection = useCallback(
    (videoElement?: HTMLVideoElement) => {
      if (videoElement && isInitialized) {
        startMediaPipeDetection(videoElement);
      }
    },
    [startMediaPipeDetection, isInitialized]
  );

  const stopDetection = useCallback(() => {
    stopMediaPipeDetection();
  }, [stopMediaPipeDetection]);
  // const translateSign = useCallback(
  //   (sign: string): string => {
  //     const translations = SIGN_TRANSLATIONS[settings.language];
  //     return translations[sign] || sign;
  //   },
  //   [settings.language]
  // );

  const clearDetections = useCallback(() => {
    clearMediaPipeDetections();
  }, [clearMediaPipeDetections]);

  return {
    isInitialized,
    detectedSigns,
    currentGesture,
    isDetecting,
    canvasRef,
    startDetection,
    stopDetection,
    clearDetections,
    // translateSign,
  };
};
