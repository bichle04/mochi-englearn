import React from 'react';
import Svg, { Rect, Path, G } from 'react-native-svg';

export const StackedCardsIcon = ({ size = 80, color = '#FFFFFF' }) => {
  return (
    <Svg width={size} height={size * 1.2} viewBox="0 0 100 120" fill="none">
      {/* Back card */}
      <Rect
        x="35"
        y="15"
        width="60"
        height="85"
        rx="15"
        fill="#FFFFFF"
        fillOpacity="0.3"
        transform="rotate(15 65 57)"
      />
      {/* Middle card */}
      <Rect
        x="20"
        y="15"
        width="60"
        height="85"
        rx="15"
        fill="#FFFFFF"
        fillOpacity="0.6"
        transform="rotate(5 50 57)"
      />
      {/* Front card */}
      <Rect x="0" y="20" width="65" height="90" rx="15" fill={color} />
      <Path
        d="M20 50 L45 50 M20 65 L45 65"
        stroke="#55B95D"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Little circle or symbol */}
      <Rect x="20" y="32" width="12" height="12" rx="6" fill="#55B95D" />
    </Svg>
  );
};
