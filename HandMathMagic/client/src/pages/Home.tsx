import { useRef, useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Instructions from "@/components/Instructions";
import Settings from "@/components/Settings";
import CameraModule from "@/components/CameraModule";
import CalculationDisplay from "@/components/CalculationDisplay";
import useCamera from "@/hooks/useCamera";
import useHandGesture, { DetectionState } from "@/hooks/useHandGesture";
import useCalculation from "@/hooks/useCalculation";

export default function Home() {
  // Settings state
  const [sensitivity, setSensitivity] = useState(7);
  const [showOverlay, setShowOverlay] = useState(true);
  const [voiceReadout, setVoiceReadout] = useState(true);
  const [showHandOutline, setShowHandOutline] = useState(true);
  const [showFingerMarkers, setShowFingerMarkers] = useState(false);
  
  // Canvas ref for drawing hand landmarks
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Custom hooks
  const { 
    videoRef, 
    cameraActive, 
    startCamera, 
    toggleCamera, 
    flipCamera 
  } = useCamera();
  
  // Manual mode state
  const [manualMode, setManualMode] = useState(false);
  const [captureStage, setCaptureStage] = useState('first');
  
  const { 
    detectionState, 
    firstNumber, 
    operator, 
    secondNumber, 
    result,
    resetCalculation,
    captureGesture,
    calculateResult,
    currentGesture
  } = useHandGesture(videoRef, canvasRef, cameraActive, sensitivity, showHandOutline, showFingerMarkers);
  
  const {
    calculationHistory,
    saveCalculation,
    speakResult
  } = useCalculation();
  
  // Handler for toggling between manual and automatic mode
  const handleManualModeToggle = () => {
    setManualMode(!manualMode);
    resetCalculation();
    setCaptureStage('first');
  };
  
  // Handler for manual capture
  const handleCapture = (stage: string) => {
    const success = captureGesture(stage);
    
    if (success) {
      // Update to the next stage
      if (stage === 'first') {
        setCaptureStage('operator');
      } else if (stage === 'operator') {
        setCaptureStage('second');
      } else if (stage === 'second') {
        setCaptureStage('result');
      }
    } else {
      // Show some feedback that the capture failed
      console.log(`Failed to capture ${stage}. Make a valid gesture for this step.`);
      // We could add a toast notification here
    }
  };
  
  // Handler for manual calculation
  const handleCalculate = () => {
    const calculatedResult = calculateResult();
    
    if (calculatedResult !== null) {
      saveCalculation(
        firstNumber as number, 
        operator as string, 
        secondNumber as number, 
        calculatedResult
      );
      
      speakResult(
        firstNumber as number, 
        operator as string, 
        secondNumber as number, 
        calculatedResult, 
        voiceReadout
      );
    }
  };
  
  // Handler for reset
  const handleReset = () => {
    resetCalculation();
    setCaptureStage('first');
  };
  
  // Auto mode: Save calculation when complete
  useEffect(() => {
    if (!manualMode && 
        detectionState === DetectionState.COMPLETE && 
        firstNumber !== null && 
        operator !== null && 
        secondNumber !== null && 
        result !== null) {
      saveCalculation(firstNumber, operator, secondNumber, result);
      speakResult(firstNumber, operator, secondNumber, result, voiceReadout);
      
      // Reset calculation after a delay
      const timer = setTimeout(() => {
        resetCalculation();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [manualMode, detectionState, firstNumber, operator, secondNumber, result, voiceReadout]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column: Instructions and Settings */}
            <div className="md:col-span-1 space-y-6">
              <Instructions />
              
              <Settings 
                sensitivity={sensitivity}
                showOverlay={showOverlay}
                voiceReadout={voiceReadout}
                showHandOutline={showHandOutline}
                showFingerMarkers={showFingerMarkers}
                onSensitivityChange={setSensitivity}
                onShowOverlayChange={setShowOverlay}
                onVoiceReadoutChange={setVoiceReadout}
                onShowHandOutlineChange={setShowHandOutline}
                onShowFingerMarkersChange={setShowFingerMarkers}
              />
            </div>
            
            {/* Center and Right Columns: Camera and Calculation */}
            <div className="md:col-span-2 space-y-6">
              <CameraModule 
                sensitivity={sensitivity}
                showOverlay={showOverlay}
                showHandOutline={showHandOutline}
                showFingerMarkers={showFingerMarkers}
                cameraActive={cameraActive}
                videoRef={videoRef}
                canvasRef={canvasRef}
                detectionStatus={detectionState}
                onStartCamera={startCamera}
                onToggleCamera={toggleCamera}
                onFlipCamera={flipCamera}
              />
              
              <CalculationDisplay 
                firstNumber={firstNumber}
                operator={operator}
                secondNumber={secondNumber}
                result={result}
                calculationHistory={calculationHistory}
                manualMode={manualMode}
                captureStage={captureStage}
                onManualModeToggle={handleManualModeToggle}
                onCapture={handleCapture}
                onCalculate={handleCalculate}
                onReset={handleReset}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
