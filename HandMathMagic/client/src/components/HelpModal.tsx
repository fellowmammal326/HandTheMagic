interface HelpModalProps {
  onClose: () => void;
}

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-dark">How to Use HandMath</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="prose max-w-none">
            <h3>Getting Started</h3>
            <ol>
              <li>Click "Start Camera" to allow camera access</li>
              <li>Position your hand in the camera view with your palm facing the camera</li>
              <li>Follow the steps below to perform calculations</li>
            </ol>
            
            <h3>Performing Calculations</h3>
            <p>HandMath detects your fingers and understands simple addition based on your gestures:</p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold">Step 1: Show the first number</h4>
              <p>Hold up between 1-5 fingers. For example, if you want to use the number 2, hold up 2 fingers.</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold">Step 2: Make an operation gesture</h4>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Addition (+):</strong> Create a circle by touching your thumb and index finger together</li>
                <li><strong>Subtraction (-):</strong> Make a rock gesture (closed fist with thumb sticking out)</li>
                <li><strong>Multiplication (×):</strong> Form a victory/peace sign with index and middle fingers</li>
                <li><strong>Division (÷):</strong> Make a thumbs-up gesture</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold">Step 3: Show the second number</h4>
              <p>Hold up between 1-5 fingers for the second number. For example, if you want to add 3, hold up 3 fingers.</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold">Step 4: See the result</h4>
              <p>The application will recognize these gestures and display the calculation and result.</p>
            </div>
            
            <h3>Tips for Best Results</h3>
            <ul>
              <li>Ensure good lighting in your environment</li>
              <li>Keep your hand clearly visible in the camera frame</li>
              <li>Make distinct gestures with some space between fingers</li>
              <li>For the circle gesture, make a clear "O" shape</li>
              <li>Enable finger markers to see labeled fingertips (thumb, index, etc.)</li>
              <li>Use the hand outline feature to see the detected hand area</li>
              <li>Click anywhere on the screen to assist with hand detection if it fails</li>
            </ul>
            
            <h3>Visual Aids</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold">Finger Markers</h4>
              <p>Red dots with labels show each fingertip. This helps you understand how the app is detecting your fingers.</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold">Hand Outline</h4>
              <p>A red square shows the detected hand area. Make sure your hand stays within this area for reliable detection.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
