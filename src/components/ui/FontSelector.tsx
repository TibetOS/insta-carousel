import { useState, useEffect } from 'react';
import { TIER1_FONTS, TIER2_FONTS, loadTier2Fonts } from '../../utils/fonts';

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

export function FontSelector({ value, onChange }: FontSelectorProps) {
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (showAll) {
      loadTier2Fonts();
    }
  }, [showAll]);

  const fonts = showAll ? [...TIER1_FONTS, ...TIER2_FONTS] : TIER1_FONTS;

  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">Font</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setShowAll(true)}
        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded bg-white"
      >
        {fonts.map(font => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </option>
        ))}
      </select>
    </div>
  );
}
