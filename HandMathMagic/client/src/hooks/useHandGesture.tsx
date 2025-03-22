import { useState, useEffect, useRef } from 'react';

// Define detection states
export const DetectionState = {
  NO_HANDS: 'No hands detected',
  DETECTING: 'Detecting gesture...',
  FIRST_NUMBER: 'First number detected',
  OPERATOR: 'Operator detected',
  SECOND_NUMBER: 'Second number detected',
  COMPLETE: 'Calculation complete'
} as const;

export type DetectionStateType = typeof DetectionState[keyof typeof DetectionState];

export default function useHandGesture(
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  cameraActive: boolean,
  sensitivity: number = 7,
  showHandOutline: boolean = true,
  showFingerMarkers: boolean = true
) {
  const [detectionState, setDetectionState] = useState<DetectionStateType>(DetectionState.NO_HANDS);
  const [firstNumber, setFirstNumber] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [secondNumber, setSecondNumber] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);
  
  // References to hold Mediapipe Hands and other detection helpers
  const handsRef = useRef<any>(null);
  const detectionTimerRef = useRef<number | null>(null);
  const lastGestureRef = useRef<string | null>(null);
  const stableDetectionCounterRef = useRef<number>(0);
  const detectionStateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize MediaPipe Hands
  useEffect(() => {
    if (!cameraActive) return;
    
    const loadMediaPipeHands = async () => {
      try {
        // Import MediaPipe Hands
        const Hands = await import('@mediapipe/hands').then(m => m.Hands);
        const drawingUtils = await import('@mediapipe/drawing_utils');
        const Camera = await import('@mediapipe/camera_utils').then(m => m.Camera);
        
        // Initialize hands model
        handsRef.current = new Hands({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          }
        });
        
        // Configure model
        await handsRef.current.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5 + (sensitivity / 20), // Adjust based on sensitivity
          minTrackingConfidence: 0.5 + (sensitivity / 20)   // Adjust based on sensitivity
        });
        
        // Set up result callback
        handsRef.current.onResults(onHandResults);
        
        // Start camera if video element is ready
        if (videoRef.current) {
          const cameraInstance = new Camera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current && handsRef.current) {
                await handsRef.current.send({ image: videoRef.current });
              }
            }
          });
          cameraInstance.start();
        }
      } catch (error) {
        console.error('Error loading MediaPipe Hands:', error);
      }
    };
    
    loadMediaPipeHands();
    
    return () => {
      if (handsRef.current) {
        handsRef.current.close();
      }
      if (detectionStateTimeoutRef.current) {
        clearTimeout(detectionStateTimeoutRef.current);
      }
    };
  }, [cameraActive, sensitivity, videoRef, showHandOutline, showFingerMarkers]);
  
  // Handler for MediaPipe Hands results
  const onHandResults = (results: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas and set dimensions
    canvas.width = results.image.width;
    canvas.height = results.image.height;
    
    // Draw hand landmarks if hands are detected
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setDetectionState(DetectionState.DETECTING);
      
      // Analyze hand for gesture detection
      const hand = results.multiHandLandmarks[0];
      const gesture = detectGesture(hand);
      
      // Draw landmarks
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Flip horizontally if using front camera
      if (videoRef.current?.style.transform === 'scaleX(-1)') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      
      // Draw a red outline around the hand area
      const handPoints = hand.map((landmark: any) => ({
        x: landmark.x * canvas.width,
        y: landmark.y * canvas.height
      }));
      
      // Find bounding box of hand
      let minX = Math.min(...handPoints.map((p: {x: number, y: number}) => p.x));
      let maxX = Math.max(...handPoints.map((p: {x: number, y: number}) => p.x));
      let minY = Math.min(...handPoints.map((p: {x: number, y: number}) => p.y));
      let maxY = Math.max(...handPoints.map((p: {x: number, y: number}) => p.y));
      
      // Add padding
      const padding = 20;
      minX = Math.max(0, minX - padding);
      maxX = Math.min(canvas.width, maxX + padding);
      minY = Math.max(0, minY - padding);
      maxY = Math.min(canvas.height, maxY + padding);
      
      // Draw red box around hand if outline is enabled
      if (showHandOutline) {
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.rect(minX, minY, maxX - minX, maxY - minY);
        ctx.stroke();
      }
      
      // Define finger names for finger markers
      const fingerNames = [
        "Thumb",  // 4
        "Index",  // 8
        "Middle", // 12
        "Ring",   // 16
        "Pinky"   // 20
      ];
      
      // Draw finger connections (simplified version)
      const fingerConnections = [
        // Thumb
        [0, 1], [1, 2], [2, 3], [3, 4],
        // Index finger
        [0, 5], [5, 6], [6, 7], [7, 8],
        // Middle finger
        [0, 9], [9, 10], [10, 11], [11, 12],
        // Ring finger
        [0, 13], [13, 14], [14, 15], [15, 16],
        // Pinky
        [0, 17], [17, 18], [18, 19], [19, 20],
        // Palm
        [0, 5], [5, 9], [9, 13], [13, 17]
      ];
      
      // Draw connections between landmarks
      ctx.strokeStyle = 'rgba(0, 128, 255, 0.5)';
      ctx.lineWidth = 3;
      
      for (const [i, j] of fingerConnections) {
        ctx.beginPath();
        ctx.moveTo(hand[i].x * canvas.width, hand[i].y * canvas.height);
        ctx.lineTo(hand[j].x * canvas.width, hand[j].y * canvas.height);
        ctx.stroke();
      }
      
      // Draw finger markers if enabled
      if (showFingerMarkers) {
        // Fingertip indices
        const fingertipIndices = [4, 8, 12, 16, 20];
        
        // Draw finger markers and labels
        ctx.font = '14px Arial';
        
        for (let i = 0; i < fingertipIndices.length; i++) {
          const idx = fingertipIndices[i];
          const x = hand[idx].x * canvas.width;
          const y = hand[idx].y * canvas.height;
          
          // Draw red dot at fingertip
          ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, 2 * Math.PI);
          ctx.fill();
          
          // Add finger name label
          ctx.fillStyle = 'white';
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 2;
          
          // Position the text above the dot
          const textX = x - 20;
          const textY = y - 15;
          
          // Draw text with outline for better visibility
          ctx.strokeText(fingerNames[i], textX, textY);
          ctx.fillText(fingerNames[i], textX, textY);
        }
      } else {
        // If finger markers disabled, just draw landmarks
        for (const landmark of hand) {
          ctx.fillStyle = 'rgba(0, 128, 255, 0.7)';
          ctx.beginPath();
          ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 5, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
      
      // Label current gesture on the canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(minX, minY - 30, 160, 25);
      ctx.font = '16px Arial';
      ctx.fillStyle = 'white';
      
      // Show the correct label based on the detected gesture
      let gestureLabel = 'Number';
      if (gesture === 'circle') gestureLabel = 'Addition (+)';
      else if (gesture === 'rock') gestureLabel = 'Subtraction (-)';
      else if (gesture === 'victory') gestureLabel = 'Multiply (×)';
      else if (gesture === 'thumbsup') gestureLabel = 'Division (÷)';
      else gestureLabel = `Number ${gesture}`;
      
      ctx.fillText(`Detected: ${gestureLabel}`, minX + 10, minY - 12);
      
      ctx.restore();
      
      // Process gesture for calculation
      processGesture(gesture);
    } else {
      // No hands detected
      setDetectionState(DetectionState.NO_HANDS);
      // Don't clear the canvas to preserve any manual click indicators
      // We'll only clear the parts that we know aren't manual indicators
      stableDetectionCounterRef.current = 0;
      lastGestureRef.current = null;
    }
  };
  
  // Detect gesture based on hand landmarks
  const detectGesture = (hand: any[]): string => {
    // Count extended fingers
    const fingerTips = [8, 12, 16, 20]; // Index, middle, ring, pinky tips
    const thumbTip = 4;
    
    // Check if fingers are extended by comparing positions
    let extendedFingersList = [];
    for (const tipIdx of fingerTips) {
      const tipY = hand[tipIdx].y;
      const baseY = hand[tipIdx - 2].y;
      const isExtended = tipY < baseY;
      extendedFingersList.push(isExtended);
    }
    
    const extendedFingers = extendedFingersList.filter(Boolean).length;
    
    // Check thumb separately
    const thumbTipX = hand[thumbTip].x;
    const thumbTipY = hand[thumbTip].y;
    const thumbBaseX = hand[thumbTip - 2].x;
    const thumbIsExtended = Math.abs(thumbTipX - thumbBaseX) > 0.1;
    
    // Determine if thumb is pointing up (thumbs up gesture)
    const thumbIsPointingUp = thumbTipY < hand[2].y && thumbIsExtended;
    
    // Check for circle gesture (thumb and index finger touch)
    const indexTipX = hand[8].x;
    const indexTipY = hand[8].y;
    
    const thumbIndexDistance = Math.sqrt(
      Math.pow(thumbTipX - indexTipX, 2) + 
      Math.pow(thumbTipY - indexTipY, 2)
    );
    
    // Check if only index and middle fingers are extended (victory sign)
    const isVictorySign = extendedFingersList[0] && extendedFingersList[1] && 
                         !extendedFingersList[2] && !extendedFingersList[3] && 
                         !thumbIsExtended;
                         
    // Check for rock gesture (closed fist with thumb sticking out)
    const isRockGesture = !extendedFingersList[0] && !extendedFingersList[1] && 
                         !extendedFingersList[2] && !extendedFingersList[3] && 
                         thumbIsExtended;
                         
    // Check for thumbs up gesture
    const isThumbsUp = !extendedFingersList[0] && !extendedFingersList[1] && 
                     !extendedFingersList[2] && !extendedFingersList[3] && 
                     thumbIsPointingUp;
                         
    // If thumb and index finger are close (circle gesture for addition)
    if (thumbIndexDistance < 0.05) {
      return 'circle'; // Addition (+)
    }
    
    // Detect other operator gestures
    if (isRockGesture) {
      return 'rock'; // Subtraction (-)
    }
    
    if (isVictorySign) {
      return 'victory'; // Multiplication (×)
    }
    
    if (isThumbsUp) {
      return 'thumbsup'; // Division (÷)
    }
    
    // Count total extended fingers including thumb
    const totalExtendedFingers = extendedFingers + (thumbIsExtended ? 1 : 0);
    return totalExtendedFingers.toString();
  };
  
  // Process detected gesture for calculation
  const processGesture = (gesture: string) => {
    // Implement a stability check - only consider a gesture if it's stable for a few frames
    if (gesture === lastGestureRef.current) {
      stableDetectionCounterRef.current++;
    } else {
      stableDetectionCounterRef.current = 0;
      lastGestureRef.current = gesture;
      return;
    }
    
    // Only process gesture if it's been stable for enough frames
    const stabilityThreshold = 10; // Frames of stability required
    if (stableDetectionCounterRef.current < stabilityThreshold) {
      return;
    }
    
    // Process the gesture based on current state
    if (firstNumber === null) {
      // Looking for first number
      if (!['circle', 'rock', 'victory', 'thumbsup'].includes(gesture) && parseInt(gesture) > 0) {
        setFirstNumber(parseInt(gesture));
        setDetectionState(DetectionState.FIRST_NUMBER);
        resetDetectionAfterDelay();
      }
    } else if (operator === null) {
      // Looking for operator
      if (gesture === 'circle') {
        setOperator('+');
        setDetectionState(DetectionState.OPERATOR);
        resetDetectionAfterDelay();
      } else if (gesture === 'rock') {
        setOperator('-');
        setDetectionState(DetectionState.OPERATOR);
        resetDetectionAfterDelay();
      } else if (gesture === 'victory') {
        setOperator('×');
        setDetectionState(DetectionState.OPERATOR);
        resetDetectionAfterDelay();
      } else if (gesture === 'thumbsup') {
        setOperator('÷');
        setDetectionState(DetectionState.OPERATOR);
        resetDetectionAfterDelay();
      }
    } else if (secondNumber === null) {
      // Looking for second number
      if (!['circle', 'rock', 'victory', 'thumbsup'].includes(gesture) && parseInt(gesture) > 0) {
        const num = parseInt(gesture);
        setSecondNumber(num);
        
        // Calculate result based on operator
        if (firstNumber !== null) {
          let calculatedResult: number;
          
          switch (operator) {
            case '+':
              calculatedResult = firstNumber + num;
              break;
            case '-':
              calculatedResult = firstNumber - num;
              break;
            case '×':
              calculatedResult = firstNumber * num;
              break;
            case '÷':
              calculatedResult = num === 0 ? NaN : firstNumber / num;
              break;
            default:
              calculatedResult = 0;
          }
          
          setResult(calculatedResult);
        }
        
        setDetectionState(DetectionState.COMPLETE);
        resetDetectionAfterDelay();
      }
    }
    
    // Reset detection counter to prevent repeated triggers
    stableDetectionCounterRef.current = 0;
  };
  
  // Reset detection state after a delay to prepare for next gesture
  const resetDetectionAfterDelay = () => {
    if (detectionStateTimeoutRef.current) {
      clearTimeout(detectionStateTimeoutRef.current);
    }
    
    detectionStateTimeoutRef.current = setTimeout(() => {
      if (firstNumber !== null && operator !== null && secondNumber !== null) {
        // Reset after complete calculation with a longer delay
        setDetectionState(DetectionState.DETECTING);
        stableDetectionCounterRef.current = 0;
        lastGestureRef.current = null;
      } else {
        // Just reset the detection state for next input
        setDetectionState(DetectionState.DETECTING);
      }
    }, 2000);
  };
  
  // Reset calculation to start a new one
  const resetCalculation = () => {
    setFirstNumber(null);
    setOperator(null);
    setSecondNumber(null);
    setResult(null);
    setDetectionState(DetectionState.DETECTING);
  };
  
  // Function to manually capture a gesture (for manual mode)
  const captureGesture = (stage: string) => {
    if (stage === 'first' && lastGestureRef.current && !isNaN(parseInt(lastGestureRef.current))) {
      setFirstNumber(parseInt(lastGestureRef.current));
      setDetectionState(DetectionState.FIRST_NUMBER);
      return true;
    } else if (stage === 'operator' && lastGestureRef.current) {
      if (lastGestureRef.current === 'circle') {
        setOperator('+');
        setDetectionState(DetectionState.OPERATOR);
        return true;
      } else if (lastGestureRef.current === 'rock') {
        setOperator('-');
        setDetectionState(DetectionState.OPERATOR);
        return true;
      } else if (lastGestureRef.current === 'victory') {
        setOperator('×');
        setDetectionState(DetectionState.OPERATOR);
        return true;
      } else if (lastGestureRef.current === 'thumbsup') {
        setOperator('÷');
        setDetectionState(DetectionState.OPERATOR);
        return true;
      }
    } else if (stage === 'second' && lastGestureRef.current && !isNaN(parseInt(lastGestureRef.current))) {
      setSecondNumber(parseInt(lastGestureRef.current));
      setDetectionState(DetectionState.SECOND_NUMBER);
      return true;
    }
    
    return false;
  };
  
  // Function to manually calculate the result
  const calculateResult = () => {
    if (firstNumber !== null && operator !== null && secondNumber !== null) {
      let calculatedResult: number;
      
      switch (operator) {
        case '+':
          calculatedResult = firstNumber + secondNumber;
          break;
        case '-':
          calculatedResult = firstNumber - secondNumber;
          break;
        case '×':
          calculatedResult = firstNumber * secondNumber;
          break;
        case '÷':
          calculatedResult = secondNumber === 0 ? NaN : firstNumber / secondNumber;
          break;
        default:
          calculatedResult = 0;
      }
      
      setResult(calculatedResult);
      setDetectionState(DetectionState.COMPLETE);
      return calculatedResult;
    }
    
    return null;
  };

  return {
    detectionState,
    firstNumber,
    operator,
    secondNumber,
    result,
    resetCalculation,
    captureGesture,
    calculateResult,
    currentGesture: lastGestureRef.current
  };
}
