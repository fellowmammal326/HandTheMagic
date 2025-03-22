import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { useState } from "react";

interface SettingsProps {
  sensitivity: number;
  showOverlay: boolean;
  voiceReadout: boolean;
  showHandOutline: boolean;
  showFingerMarkers: boolean;
  onSensitivityChange: (value: number) => void;
  onShowOverlayChange: (checked: boolean) => void;
  onVoiceReadoutChange: (checked: boolean) => void;
  onShowHandOutlineChange: (checked: boolean) => void;
  onShowFingerMarkersChange: (checked: boolean) => void;
}

export default function Settings({
  sensitivity,
  showOverlay,
  voiceReadout,
  showHandOutline,
  showFingerMarkers,
  onSensitivityChange,
  onShowOverlayChange,
  onVoiceReadoutChange,
  onShowHandOutlineChange,
  onShowFingerMarkersChange
}: SettingsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center text-dark">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        Settings
      </h2>
      <div className="space-y-5">
        <div>
          <label htmlFor="detectionSensitivity" className="block text-sm font-medium text-gray-700 mb-1">
            Detection Sensitivity
          </label>
          <Slider 
            id="detectionSensitivity" 
            min={1} 
            max={10} 
            step={1}
            value={[sensitivity]}
            onValueChange={(value) => onSensitivityChange(value[0])}
          />
          <span className="block mt-1 text-xs text-gray-500">
            Higher values make detection more sensitive (easier to trigger)
          </span>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Visual Options</h3>
          
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700">Show detection overlay</label>
            <Switch 
              checked={showOverlay} 
              onCheckedChange={onShowOverlayChange} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700">Show hand outline box</label>
            <Switch 
              checked={showHandOutline} 
              onCheckedChange={onShowHandOutlineChange} 
              disabled={!showOverlay}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700">Show finger markers with labels</label>
            <Switch 
              checked={showFingerMarkers} 
              onCheckedChange={onShowFingerMarkersChange} 
              disabled={!showOverlay}
            />
          </div>
        </div>
        
        <Separator />
        
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700">Voice readout of results</label>
            <Switch 
              checked={voiceReadout} 
              onCheckedChange={onVoiceReadoutChange} 
            />
          </div>
          <span className="block mt-1 text-xs text-gray-500">
            Speaks the calculation result when complete
          </span>
        </div>
      </div>
    </div>
  );
}
