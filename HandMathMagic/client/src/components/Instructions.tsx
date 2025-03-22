export default function Instructions() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center text-dark">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        How It Works
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-primary font-bold">1</div>
          <div className="ml-3">
            <p className="text-sm text-gray-700">Show finger count for first number</p>
            <div className="mt-1 bg-gray-50 p-2 rounded text-xs text-gray-500 flex items-center">
              <span className="inline-block mr-2">Example: 2 fingers =</span>
              <span className="font-bold text-dark">2</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-primary font-bold">2</div>
          <div className="ml-3">
            <p className="text-sm text-gray-700">Make a hand gesture for the operator</p>
            <div className="mt-1 bg-gray-50 p-2 rounded text-xs text-gray-500">
              <div className="flex items-center mb-1">
                <span className="inline-block w-24">Circle gesture:</span>
                <span className="font-bold text-dark">+ (Addition)</span>
              </div>
              <div className="flex items-center mb-1">
                <span className="inline-block w-24">Rock gesture:</span>
                <span className="font-bold text-dark">- (Subtraction)</span>
              </div>
              <div className="flex items-center mb-1">
                <span className="inline-block w-24">Victory sign:</span>
                <span className="font-bold text-dark">× (Multiplication)</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-24">Thumbs-up:</span>
                <span className="font-bold text-dark">÷ (Division)</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-primary font-bold">3</div>
          <div className="ml-3">
            <p className="text-sm text-gray-700">Show finger count for second number</p>
            <div className="mt-1 bg-gray-50 p-2 rounded text-xs text-gray-500 flex items-center">
              <span className="inline-block mr-2">Example: 3 fingers =</span>
              <span className="font-bold text-dark">3</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-primary font-bold">4</div>
          <div className="ml-3">
            <p className="text-sm text-gray-700">The result will be calculated automatically</p>
            <div className="mt-1 bg-gray-50 p-2 rounded text-xs text-gray-500">
              <div className="flex items-center mb-1">
                <span className="inline-block mr-2">Addition: 2 + 3 =</span>
                <span className="font-bold text-dark">5</span>
              </div>
              <div className="flex items-center mb-1">
                <span className="inline-block mr-2">Subtraction: 5 - 2 =</span>
                <span className="font-bold text-dark">3</span>
              </div>
              <div className="flex items-center mb-1">
                <span className="inline-block mr-2">Multiplication: 3 × 2 =</span>
                <span className="font-bold text-dark">6</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block mr-2">Division: 6 ÷ 2 =</span>
                <span className="font-bold text-dark">3</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start mt-2">
          <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-primary font-bold">5</div>
          <div className="ml-3">
            <p className="text-sm text-gray-700">Visual aids to help with hand gestures</p>
            <div className="mt-1 bg-gray-50 p-2 rounded text-xs text-gray-500">
              <div className="flex items-center mb-1">
                <span className="inline-block w-24">Hand Outline:</span>
                <span className="font-bold text-dark">Red square showing detected hand area</span>
              </div>
              <div className="flex items-center mb-1">
                <span className="inline-block w-24">Finger Markers:</span>
                <span className="font-bold text-dark">Red dots with labels (Thumb, Index, etc.)</span>
              </div>
              <p className="text-xs mt-1">
                You can toggle these features in the Settings panel.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-start mt-4">
          <div className="ml-3 bg-blue-50 p-3 rounded-lg w-full">
            <p className="text-sm text-blue-600 font-medium mb-1">💡 Tips:</p>
            <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
              <li>Make sure your hand is well-lit and clearly visible</li>
              <li>Keep your hand steady for reliable detection</li>
              <li>Click on the screen to assist hand detection if needed</li>
              <li>Enable finger markers in settings to see labeled fingertips</li>
              <li>Toggle hand outline for better visual feedback</li>
              <li>Adjust sensitivity in settings if detection is difficult</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
