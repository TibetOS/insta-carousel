import { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  '#ffffff', '#000000', '#f44336', '#e91e63', '#9c27b0',
  '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688',
  '#4caf50', '#8bc34a', '#ffeb3b', '#ff9800', '#ff5722',
  '#795548', '#607d8b', '#1a1a2e', '#16213e', '#0f3460',
];

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {label && <label className="block text-xs text-gray-500 mb-1">{label}</label>}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
        style={{ backgroundColor: value }}
        aria-label={`Color: ${value}`}
      />
      {isOpen && (
        <div className="absolute z-50 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-48">
          <div className="grid grid-cols-5 gap-1 mb-2">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                onClick={() => { onChange(color); setIsOpen(false); }}
                className="w-8 h-8 rounded border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full h-8 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
