interface Calculation {
  id: number;
  firstNumber: number | null;
  operator: string | null;
  secondNumber: number | null;
  result: number | null;
  timestamp: Date;
}

interface CalculationDisplayProps {
  firstNumber: number | null;
  operator: string | null;
  secondNumber: number | null;
  result: number | null;
  calculationHistory: Calculation[];
  manualMode: boolean;
  captureStage: string;
  onManualModeToggle: () => void;
  onCapture: (stage: string) => void;
  onCalculate: () => void; 
  onReset: () => void;
}

const formatTimestamp = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes === 1) return "1 min ago";
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function CalculationDisplay({
  firstNumber,
  operator,
  secondNumber,
  result,
  calculationHistory,
  manualMode,
  captureStage,
  onManualModeToggle,
  onCapture,
  onCalculate,
  onReset
}: CalculationDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center text-dark">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Calculation
        </h2>
        
        {/* Manual/Auto mode toggle switch */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Auto</span>
          <button 
            onClick={onManualModeToggle}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              manualMode 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {manualMode ? 'Manual Mode' : 'Auto Mode'}
          </button>
        </div>
      </div>
      
      <div className="p-6 flex flex-col items-center">
        <div className="flex items-center justify-center space-x-4 mb-6">
          {/* First number */}
          <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold ${
            captureStage === 'first' ? 'bg-blue-200 ring-2 ring-blue-500' : 'bg-blue-100'
          } text-primary relative`}>
            <span>{firstNumber !== null ? firstNumber : "?"}</span>
            {manualMode && captureStage === 'first' && (
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs animate-pulse">
                <span>1</span>
              </div>
            )}
          </div>
          
          {/* Operator */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${
            captureStage === 'operator' ? 'bg-amber-200 ring-2 ring-amber-500' : 'bg-amber-100'
          } text-amber-600 relative`}>
            <span>{operator || "?"}</span>
            {manualMode && captureStage === 'operator' && (
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs animate-pulse">
                <span>2</span>
              </div>
            )}
          </div>
          
          {/* Second number */}
          <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold ${
            captureStage === 'second' ? 'bg-blue-200 ring-2 ring-blue-500' : 'bg-blue-100'
          } text-primary relative`}>
            <span>{secondNumber !== null ? secondNumber : "?"}</span>
            {manualMode && captureStage === 'second' && (
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs animate-pulse">
                <span>3</span>
              </div>
            )}
          </div>
          
          {/* Equals sign */}
          <div className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-gray-600">
            <span>=</span>
          </div>
          
          {/* Result */}
          <div className={`w-20 h-20 rounded-lg flex items-center justify-center text-3xl font-bold ${
            captureStage === 'result' ? 'bg-green-200 ring-2 ring-green-500' : 'bg-green-100'
          } text-green-600 relative`}>
            <span>{result !== null ? result : "?"}</span>
            {manualMode && captureStage === 'result' && (
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs animate-pulse">
                <span>4</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Manual mode controls */}
        {manualMode && (
          <div className="w-full max-w-md flex flex-col space-y-4 mb-6">
            <div className="grid grid-cols-4 gap-2">
              <button 
                onClick={() => onCapture('first')}
                className={`px-3 py-2 rounded-md text-white text-sm font-medium ${
                  captureStage === 'first' ? 'bg-blue-600' : 'bg-blue-400'
                }`}
                disabled={captureStage !== 'first'}
              >
                1. Capture First Number
              </button>
              
              <button 
                onClick={() => onCapture('operator')}
                className={`px-3 py-2 rounded-md text-white text-sm font-medium ${
                  captureStage === 'operator' ? 'bg-amber-600' : 'bg-amber-400'
                }`}
                disabled={captureStage !== 'operator'}
              >
                2. Capture Operator
              </button>
              
              <button 
                onClick={() => onCapture('second')}
                className={`px-3 py-2 rounded-md text-white text-sm font-medium ${
                  captureStage === 'second' ? 'bg-blue-600' : 'bg-blue-400'
                }`}
                disabled={captureStage !== 'second'}
              >
                3. Capture Second Number
              </button>
              
              <button 
                onClick={onCalculate}
                className={`px-3 py-2 rounded-md text-white text-sm font-medium ${
                  captureStage === 'result' ? 'bg-green-600' : 'bg-green-400'
                }`}
                disabled={captureStage !== 'result' || firstNumber === null || operator === null || secondNumber === null}
              >
                4. Calculate Result
              </button>
            </div>
            
            <button
              onClick={onReset}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm font-medium transition-colors"
            >
              Reset Calculation
            </button>
          </div>
        )}
        
        <div className="w-full max-w-md bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Calculations:</h3>
          {calculationHistory.length > 0 ? (
            <ul className="divide-y divide-gray-200 text-sm">
              {calculationHistory.map((calc) => (
                <li key={calc.id} className="py-2 flex justify-between">
                  <span>
                    {calc.firstNumber} {calc.operator} {calc.secondNumber} = {calc.result}
                  </span>
                  <span className="text-gray-500">{formatTimestamp(calc.timestamp)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm py-2">No calculations yet. Try making some gestures!</p>
          )}
        </div>
      </div>
    </div>
  );
}
