import type { Results } from '@mediapipe/hands';

// Hand landmark indices for key positions
const LANDMARK_INDICES = {
  WRIST: 0,
  THUMB_TIP: 4,
  INDEX_TIP: 8,
  MIDDLE_TIP: 12,
  RING_TIP: 16,
  PINKY_TIP: 20,
  INDEX_PIP: 6,
  MIDDLE_PIP: 10,
  RING_PIP: 14,
  PINKY_PIP: 18,
};

export interface HandGesture {
  name: string;
  confidence: number;
  landmarks: number[][];
}

export class SignLanguageProcessor {
  private gestureHistory: HandGesture[] = [];
  private readonly historySize = 5;

  // Calculate distance between two landmarks
  private calculateDistance(point1: number[], point2: number[]): number {
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Check if finger is extended
  private isFingerExtended(landmarks: number[][], tipIndex: number, pipIndex: number): boolean {
    const tip = landmarks[tipIndex];
    const pip = landmarks[pipIndex];
    const wrist = landmarks[LANDMARK_INDICES.WRIST];
    
    // Calculate distances
    const tipToWrist = this.calculateDistance(tip, wrist);
    const pipToWrist = this.calculateDistance(pip, wrist);
    
    return tipToWrist > pipToWrist;
  }

  // Detect basic ASL letters and common gestures
  private detectGesture(landmarks: number[][]): HandGesture {
    const extendedFingers = {
      thumb: this.isThumbExtended(landmarks),
      index: this.isFingerExtended(landmarks, LANDMARK_INDICES.INDEX_TIP, LANDMARK_INDICES.INDEX_PIP),
      middle: this.isFingerExtended(landmarks, LANDMARK_INDICES.MIDDLE_TIP, LANDMARK_INDICES.MIDDLE_PIP),
      ring: this.isFingerExtended(landmarks, LANDMARK_INDICES.RING_TIP, LANDMARK_INDICES.RING_PIP),
      pinky: this.isFingerExtended(landmarks, LANDMARK_INDICES.PINKY_TIP, LANDMARK_INDICES.PINKY_PIP),
    };

    // ASL Letter Recognition
    if (this.isLetterA(landmarks, extendedFingers)) {
      return { name: 'A', confidence: 0.85, landmarks };
    }
    if (this.isLetterB(landmarks, extendedFingers)) {
      return { name: 'B', confidence: 0.88, landmarks };
    }
    if (this.isLetterC(landmarks, extendedFingers)) {
      return { name: 'C', confidence: 0.82, landmarks };
    }
    if (this.isLetterD(landmarks, extendedFingers)) {
      return { name: 'D', confidence: 0.86, landmarks };
    }
    if (this.isLetterE(landmarks, extendedFingers)) {
      return { name: 'E', confidence: 0.84, landmarks };
    }
    if (this.isLetterF(landmarks, extendedFingers)) {
      return { name: 'F', confidence: 0.87, landmarks };
    }
    if (this.isLetterG(landmarks, extendedFingers)) {
      return { name: 'G', confidence: 0.83, landmarks };
    }
    if (this.isLetterH(landmarks, extendedFingers)) {
      return { name: 'H', confidence: 0.85, landmarks };
    }
    if (this.isLetterI(landmarks, extendedFingers)) {
      return { name: 'I', confidence: 0.89, landmarks };
    }
    if (this.isLetterL(landmarks, extendedFingers)) {
      return { name: 'L', confidence: 0.87, landmarks };
    }
    if (this.isLetterO(landmarks, extendedFingers)) {
      return { name: 'O', confidence: 0.85, landmarks };
    }
    if (this.isLetterU(landmarks, extendedFingers)) {
      return { name: 'U', confidence: 0.86, landmarks };
    }
    if (this.isLetterV(landmarks, extendedFingers)) {
      return { name: 'V', confidence: 0.88, landmarks };
    }
    if (this.isLetterW(landmarks, extendedFingers)) {
      return { name: 'W', confidence: 0.84, landmarks };
    }
    if (this.isLetterY(landmarks, extendedFingers)) {
      return { name: 'Y', confidence: 0.87, landmarks };
    }

    // Common words and phrases
    if (this.isHello(landmarks, extendedFingers)) {
      return { name: 'Hello', confidence: 0.90, landmarks };
    }
    if (this.isThankYou(landmarks, extendedFingers)) {
      return { name: 'Thank you', confidence: 0.88, landmarks };
    }
    if (this.isPlease(landmarks, extendedFingers)) {
      return { name: 'Please', confidence: 0.85, landmarks };
    }
    if (this.isYes(landmarks, extendedFingers)) {
      return { name: 'Yes', confidence: 0.87, landmarks };
    }
    if (this.isNo(landmarks, extendedFingers)) {
      return { name: 'No', confidence: 0.86, landmarks };
    }

    return { name: 'Unknown', confidence: 0.3, landmarks };
  }

  private isThumbExtended(landmarks: number[][]): boolean {
    const thumbTip = landmarks[LANDMARK_INDICES.THUMB_TIP];
    const thumbIP = landmarks[3]; // Thumb IP joint
    const wrist = landmarks[LANDMARK_INDICES.WRIST];
    
    const tipToWrist = this.calculateDistance(thumbTip, wrist);
    const ipToWrist = this.calculateDistance(thumbIP, wrist);
    
    return tipToWrist > ipToWrist;
  }

  // ASL Letter Detection Methods
  private isLetterA(landmarks: number[][], fingers: any): boolean {
    return !fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && fingers.thumb;
  }

  private isLetterB(landmarks: number[][], fingers: any): boolean {
    return fingers.index && fingers.middle && fingers.ring && fingers.pinky && !fingers.thumb;
  }

  private isLetterC(landmarks: number[][], fingers: any): boolean {
    const thumbTip = landmarks[LANDMARK_INDICES.THUMB_TIP];
    const indexTip = landmarks[LANDMARK_INDICES.INDEX_TIP];
    const distance = this.calculateDistance(thumbTip, indexTip);
    return distance > 0.05 && distance < 0.15; // Curved hand shape
  }

  private isLetterD(landmarks: number[][], fingers: any): boolean {
    return fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && fingers.thumb;
  }

  private isLetterE(landmarks: number[][], fingers: any): boolean {
    return !fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && !fingers.thumb;
  }

  private isLetterF(landmarks: number[][], fingers: any): boolean {
    const thumbTip = landmarks[LANDMARK_INDICES.THUMB_TIP];
    const indexTip = landmarks[LANDMARK_INDICES.INDEX_TIP];
    const distance = this.calculateDistance(thumbTip, indexTip);
    return distance < 0.05 && fingers.middle && fingers.ring && fingers.pinky;
  }

  private isLetterG(landmarks: number[][], fingers: any): boolean {
    return fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && !fingers.thumb;
  }

  private isLetterH(landmarks: number[][], fingers: any): boolean {
    return fingers.index && fingers.middle && !fingers.ring && !fingers.pinky && !fingers.thumb;
  }

  private isLetterI(landmarks: number[][], fingers: any): boolean {
    return !fingers.index && !fingers.middle && !fingers.ring && fingers.pinky && !fingers.thumb;
  }

  private isLetterL(landmarks: number[][], fingers: any): boolean {
    return fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && fingers.thumb;
  }

  private isLetterO(landmarks: number[][], fingers: any): boolean {
    const thumbTip = landmarks[LANDMARK_INDICES.THUMB_TIP];
    const indexTip = landmarks[LANDMARK_INDICES.INDEX_TIP];
    const distance = this.calculateDistance(thumbTip, indexTip);
    return distance < 0.03; // Fingers touching in O shape
  }

  private isLetterU(landmarks: number[][], fingers: any): boolean {
    return fingers.index && fingers.middle && !fingers.ring && !fingers.pinky && !fingers.thumb;
  }

  private isLetterV(landmarks: number[][], fingers: any): boolean {
    const indexTip = landmarks[LANDMARK_INDICES.INDEX_TIP];
    const middleTip = landmarks[LANDMARK_INDICES.MIDDLE_TIP];
    const distance = this.calculateDistance(indexTip, middleTip);
    return fingers.index && fingers.middle && !fingers.ring && !fingers.pinky && distance > 0.05;
  }

  private isLetterW(landmarks: number[][], fingers: any): boolean {
    return fingers.index && fingers.middle && fingers.ring && !fingers.pinky && !fingers.thumb;
  }

  private isLetterY(landmarks: number[][], fingers: any): boolean {
    return !fingers.index && !fingers.middle && !fingers.ring && fingers.pinky && fingers.thumb;
  }

  // Common word detection methods
  private isHello(landmarks: number[][], fingers: any): boolean {
    // Hello is typically a waving motion with open hand
    return fingers.index && fingers.middle && fingers.ring && fingers.pinky && fingers.thumb;
  }

  private isThankYou(landmarks: number[][], fingers: any): boolean {
    // Thank you involves touching chin and moving hand forward
    const indexTip = landmarks[LANDMARK_INDICES.INDEX_TIP];
    return indexTip[1] < 0.3 && fingers.index && fingers.middle && fingers.ring && fingers.pinky;
  }

  private isPlease(landmarks: number[][], fingers: any): boolean {
    // Please involves circular motion on chest
    return fingers.index && fingers.middle && fingers.ring && fingers.pinky && fingers.thumb;
  }

  private isYes(landmarks: number[][], fingers: any): boolean {
    // Yes is a nodding fist motion
    return !fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && fingers.thumb;
  }

  private isNo(landmarks: number[][], fingers: any): boolean {
    // No involves index and middle finger together moving side to side
    const indexTip = landmarks[LANDMARK_INDICES.INDEX_TIP];
    const middleTip = landmarks[LANDMARK_INDICES.MIDDLE_TIP];
    const distance = this.calculateDistance(indexTip, middleTip);
    return fingers.index && fingers.middle && distance < 0.03;
  }

  // Process MediaPipe results
  processResults(results: Results): HandGesture | null {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      return null;
    }

    // Use the first detected hand
    const landmarks = results.multiHandLandmarks[0].map(landmark => [
      landmark.x,
      landmark.y,
      landmark.z
    ]);

    const gesture = this.detectGesture(landmarks);
    
    // Add to history for smoothing
    this.gestureHistory.push(gesture);
    if (this.gestureHistory.length > this.historySize) {
      this.gestureHistory.shift();
    }

    // Return smoothed result
    return this.getSmoothGesture();
  }

  private getSmoothGesture(): HandGesture {
    if (this.gestureHistory.length === 0) {
      return { name: 'Unknown', confidence: 0, landmarks: [] };
    }

    // Find most common gesture in recent history
    const gestureCounts: { [key: string]: { count: number; confidence: number } } = {};
    
    this.gestureHistory.forEach(gesture => {
      if (!gestureCounts[gesture.name]) {
        gestureCounts[gesture.name] = { count: 0, confidence: 0 };
      }
      gestureCounts[gesture.name].count++;
      gestureCounts[gesture.name].confidence += gesture.confidence;
    });

    let bestGesture = 'Unknown';
    let bestScore = 0;

    Object.entries(gestureCounts).forEach(([name, data]) => {
      const avgConfidence = data.confidence / data.count;
      const score = data.count * avgConfidence;
      
      if (score > bestScore) {
        bestScore = score;
        bestGesture = name;
      }
    });

    const avgConfidence = gestureCounts[bestGesture].confidence / gestureCounts[bestGesture].count;
    
    return {
      name: bestGesture,
      confidence: Math.min(avgConfidence, 0.95),
      landmarks: this.gestureHistory[this.gestureHistory.length - 1].landmarks
    };
  }

  // Clear gesture history
  clearHistory(): void {
    this.gestureHistory = [];
  }
}