import React from 'react';

interface SchoolLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  light?: boolean;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  light = false
}) => {
  const sizePx = size === 'sm' ? 42 : size === 'md' ? 52 : 72;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Crest */}
      <svg
        width={sizePx}
        height={sizePx}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105 duration-200"
        aria-label="Ideal Global Islamic English Medium School Emblem"
      >
        <defs>
          <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="crestGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="50%" stopColor="#065F46" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>
          <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Gold Border */}
        <circle cx="50" cy="50" r="47" stroke="url(#crestGold)" strokeWidth="3" fill="none" />
        
        {/* Inner Emerald Field */}
        <circle cx="50" cy="50" r="43" fill="url(#crestGreen)" />
        <circle cx="50" cy="50" r="40" stroke="url(#crestGold)" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.6" />

        {/* Crescent Moon & Star at apex */}
        <path
          d="M 50 18 A 6 6 0 1 1 45 28 A 4.5 4.5 0 1 0 50 18 Z"
          fill="#FDE68A"
        />
        <polygon
          points="51,21 52.5,23.5 55.5,23.8 53.2,25.8 53.8,28.8 51,27.2 48.2,28.8 48.8,25.8 46.5,23.8 49.5,23.5"
          fill="#FDE68A"
          transform="scale(0.6) translate(36, 12)"
        />

        {/* Open Book of Knowledge (Iqra) */}
        <path
          d="M 28 55 Q 39 49 50 54 Q 61 49 72 55 L 70 70 Q 60 65 50 69 Q 40 65 30 70 Z"
          fill="#FFFFFF"
          filter="url(#subtleShadow)"
        />
        {/* Book Spine & Pages Lines */}
        <path d="M 50 54 L 50 69" stroke="#D97706" strokeWidth="1.5" />
        <path d="M 34 58 Q 42 54 48 57" stroke="#065F46" strokeWidth="0.8" opacity="0.7" />
        <path d="M 34 62 Q 42 58 48 61" stroke="#065F46" strokeWidth="0.8" opacity="0.7" />
        <path d="M 52 57 Q 58 54 66 58" stroke="#065F46" strokeWidth="0.8" opacity="0.7" />
        <path d="M 52 61 Q 58 58 66 62" stroke="#065F46" strokeWidth="0.8" opacity="0.7" />

        {/* Torch / Light of Guidance behind book */}
        <path d="M 48 38 L 52 38 L 51 49 L 49 49 Z" fill="url(#crestGold)" />
        <path d="M 50 33 Q 54 36 50 40 Q 46 36 50 33 Z" fill="#F59E0B" />

        {/* Laurel Wreath on sides */}
        <path
          d="M 20 62 C 18 50 24 38 31 32"
          stroke="#F59E0B"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 80 62 C 82 50 76 38 69 32"
          stroke="#F59E0B"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* School Motto Banner Ribbon */}
        <path
          d="M 26 77 Q 50 82 74 77 L 76 82 Q 50 87 24 82 Z"
          fill="url(#crestGold)"
        />
        <text
          x="50"
          y="82"
          textAnchor="middle"
          fontSize="4.2"
          fontWeight="bold"
          fill="#064E3B"
          letterSpacing="0.8"
        >
          KAMALAPURAM
        </text>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className={`text-xs md:text-sm tracking-wider uppercase font-semibold ${light ? 'text-amber-300' : 'text-amber-700'}`}>
            Ideal Global
          </span>
          <span className={`font-display text-base md:text-lg font-bold tracking-tight leading-tight ${light ? 'text-white' : 'text-slate-900'}`}>
            Islamic English Medium School
          </span>
          <span className={`text-xs ${light ? 'text-slate-300' : 'text-slate-500'}`}>
            Kamalapuram, Andhra Pradesh
          </span>
        </div>
      )}
    </div>
  );
};
