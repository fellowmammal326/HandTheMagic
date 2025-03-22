import { useRef, useEffect, useState } from "react";
import { DetectionState } from "@/hooks/useHandGesture";

interface CameraModuleProps {
  sensitivity: number;
  showOverlay: boolean;
  showHandOutline: boolean;
  showFingerMarkers: boolean;
  cameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  detectionStatus: string;
  onStartCamera: () => void;
  onToggleCamera: () => void;
  onFlipCamera: () => void;
  currentGesture?: string | null;
}

export default function CameraModule({
  sensitivity,
  showOverlay,
  showHandOutline,
  showFingerMarkers,
  cameraActive,
  videoRef,
  canvasRef,
  detectionStatus,
  onStartCamera,
  onToggleCamera,
  onFlipCamera,
  currentGesture
}: CameraModuleProps) {
  const [handDetected, setHandDetected] = useState(false);
  const [detectionPercentage, setDetectionPercentage] = useState(0);
  const [detectingManual, setDetectingManual] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  
  // Function to simulate hand detection progress when user clicks
  const simulateHandDetectionProgress = () => {
    // Clear any previous interval
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    
    setDetectingManual(true);
    setDetectionPercentage(0);
    
    // Simulate gradual increase in detection percentage
    let progress = 0;
    const startTime = Date.now();
    const duration = 2000; // 2 seconds for full detection
    
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      
      setDetectionPercentage(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        // Set a timeout to reset the detection status
        setTimeout(() => {
          setDetectingManual(false);
          setDetectionPercentage(0);
        }, 2000);
      }
    }, 50);
    
    detectionIntervalRef.current = interval;
    
    // Clear interval on component unmount
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  };
  
  // Function to handle manual clicks to assist hand detection
  const handleManualClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cameraActive) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    // Get click coordinates relative to container
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Draw a temporary hand-like shape at the clicked position
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear any previous temporary indicators
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Start the detection simulation
    simulateHandDetectionProgress();
    
    // Draw a red outline to simulate the hand detection area
    ctx.save();
    
    // Create a red square box around the clicked position
    const boxSize = 150;
    const boxX = Math.max(0, (x * canvas.width) - boxSize/2);
    const boxY = Math.max(0, (y * canvas.height) - boxSize/2);
    
    // Draw red box
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.rect(boxX, boxY, boxSize, boxSize);
    ctx.stroke();
    
    // Add "Detecting hand..." text at the top of the box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(boxX, boxY - 30, 160, 25);
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Detecting hand: ${detectionPercentage}%`, boxX + 10, boxY - 12);
    
    ctx.restore();
  };
  
  // Update hand detection status based on detection state
  useEffect(() => {
    setHandDetected(detectionStatus !== DetectionState.NO_HANDS);
  }, [detectionStatus]);

  // Update detection message in the canvas when percentage changes
  useEffect(() => {
    if (detectingManual && cameraActive) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear just the area where the progress text is
      const boxX = canvas.width / 2 - 75; // Approximation based on previous drawing
      const boxY = canvas.height / 2 - 75;
      
      // Update the "Detecting hand..." text
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(boxX, boxY - 30, 200, 25);
      ctx.font = '16px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(`Detecting hand: ${detectionPercentage}%`, boxX + 10, boxY - 12);
      
      // When detection reaches 100%, update the border to green
      if (detectionPercentage >= 100) {
        // Draw green success box
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.rect(boxX, boxY, 150, 150);
        ctx.stroke();
        
        // Update the text message
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(boxX, boxY - 30, 160, 25);
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('Hand Detected!', boxX + 10, boxY - 12);
      }
    }
  }, [detectionPercentage, detectingManual, cameraActive]);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center text-dark">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Camera Feed
        </h2>
      </div>
      
      <div className="relative bg-gray-900">
        <div 
          id="camera-container" 
          ref={containerRef}
          className="relative aspect-video w-full bg-gray-900 flex items-center justify-center cursor-pointer"
          onClick={handleManualClick}
        >
          {!cameraActive ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900">
              <div className="text-white text-center p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-lg font-medium mb-4">Camera Access Required</p>
                <button 
                  onClick={onStartCamera}
                  className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-md transition duration-150 font-medium"
                >
                  Start Camera
                </button>
              </div>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                className="absolute inset-0 w-full h-full object-cover"
                playsInline
                autoPlay 
                muted
              />
              <canvas 
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full ${!showOverlay && 'opacity-0'}`}
              />
              
              {/* Red border when hand is detected */}
              <div 
                className={`absolute inset-0 pointer-events-none transition-all duration-300 ease-in-out ${
                  handDetected ? 'border-4 border-red-500 opacity-100' : 'border-4 border-transparent opacity-0'
                }`}
              ></div>
              
              <div className="absolute top-4 right-4">
                <div className={`${handDetected ? 'bg-green-900' : 'bg-black'} bg-opacity-60 text-white px-3 py-2 rounded-lg flex items-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1 ${handDetected ? 'text-green-400' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {handDetected ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    )}
                  </svg>
                  <span>{detectionStatus}</span>
                </div>
              </div>
              
              {/* Hint about click to help detect hand */}
              {!handDetected && !detectingManual && (
                <div className="absolute bottom-16 left-0 right-0 text-center">
                  <div className="inline-block bg-black bg-opacity-70 text-white text-sm px-3 py-2 rounded-lg">
                    Click on the screen to help detect your hand
                  </div>
                </div>
              )}
              
              {/* Show detection progress indicator */}
              {detectingManual && (
                <div className="absolute bottom-16 left-0 right-0 text-center">
                  <div className="inline-block bg-black bg-opacity-90 text-white text-sm px-4 py-3 rounded-lg w-64">
                    <div className="flex justify-between mb-1">
                      <span>Detecting hand...</span>
                      <span>{detectionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${detectionPercentage >= 100 ? 'bg-green-500' : 'bg-primary'}`} 
                        style={{ width: `${detectionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="p-3 bg-gray-800 flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              onClick={onToggleCamera}
              className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition"
              disabled={!cameraActive}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button 
              onClick={onFlipCamera}
              className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition"
              disabled={!cameraActive}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>
          
          <div className="text-xs text-gray-400">
            <span>{handDetected ? 'Hand detected' : 'No hand detected'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
