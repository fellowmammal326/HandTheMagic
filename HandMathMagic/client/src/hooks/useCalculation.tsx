import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface Calculation {
  id: number;
  firstNumber: number | null;
  operator: string | null;
  secondNumber: number | null;
  result: number | null;
  timestamp: Date;
}

export default function useCalculation() {
  const [calculationHistory, setCalculationHistory] = useState<Calculation[]>([]);
  
  const saveCalculation = async (
    firstNumber: number | null, 
    operator: string | null, 
    secondNumber: number | null, 
    result: number | null
  ) => {
    // Don't save incomplete calculations
    if (firstNumber === null || operator === null || secondNumber === null || result === null) {
      return;
    }
    
    // Add to local state immediately
    const newCalculation: Calculation = {
      id: Date.now(), // Use timestamp as temporary ID
      firstNumber,
      operator,
      secondNumber,
      result,
      timestamp: new Date()
    };
    
    setCalculationHistory(prev => [newCalculation, ...prev].slice(0, 10)); // Keep only last 10
    
    // Optionally save to server
    try {
      await apiRequest('POST', '/api/calculations', {
        firstNumber,
        operator,
        secondNumber,
        result
      });
    } catch (error) {
      console.error('Failed to save calculation:', error);
    }
  };
  
  const fetchCalculationHistory = async () => {
    try {
      const response = await fetch('/api/calculations');
      if (response.ok) {
        const data = await response.json();
        // Convert dates from strings back to Date objects
        setCalculationHistory(data.map((calc: any) => ({
          ...calc,
          timestamp: new Date(calc.timestamp)
        })));
      }
    } catch (error) {
      console.error('Failed to fetch calculation history:', error);
    }
  };
  
  useEffect(() => {
    fetchCalculationHistory();
  }, []);
  
  // Speech readout of result
  const speakResult = (
    firstNumber: number | null, 
    operator: string | null, 
    secondNumber: number | null, 
    result: number | null,
    enableVoice: boolean
  ) => {
    if (!enableVoice || !window.speechSynthesis || 
        firstNumber === null || operator === null || 
        secondNumber === null || result === null) {
      return;
    }
    
    // Convert operator symbol to spoken words
    let operatorWord = 'plus';
    switch (operator) {
      case '+':
        operatorWord = 'plus';
        break;
      case '-':
        operatorWord = 'minus';
        break;
      case '×':
        operatorWord = 'times';
        break;
      case '÷':
        operatorWord = 'divided by';
        break;
    }
    
    let resultText = `${firstNumber} ${operatorWord} ${secondNumber} equals ${result}`;
    
    // Handle special cases for division
    if (operator === '÷' && secondNumber === 0) {
      resultText = `Cannot divide ${firstNumber} by zero`;
    } else if (operator === '÷' && result !== Math.floor(result)) {
      // For decimal results in division, round to 2 decimal places for speech
      resultText = `${firstNumber} ${operatorWord} ${secondNumber} equals ${result.toFixed(2)}`;
    }
    
    const utterance = new SpeechSynthesisUtterance(resultText);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };
  
  return {
    calculationHistory,
    saveCalculation,
    speakResult
  };
}
