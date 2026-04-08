export default function TalentProofLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#bgGradient)" stroke="#ECC94B" strokeWidth="2"/>
      
      {/* T letter - vertical bar */}
      <rect x="35" y="30" width="8" height="40" fill="#ECC94B" rx="2"/>
      
      {/* T letter - horizontal top */}
      <rect x="25" y="30" width="28" height="8" fill="#ECC94B" rx="2"/>
      
      {/* P letter - vertical bar (overlapping with T) */}
      <rect x="47" y="30" width="8" height="40" fill="url(#goldGradient)" rx="2"/>
      
      {/* P letter - rounded top part */}
      <path 
        d="M 55 35 L 55 30 L 70 30 C 75 30 78 33 78 38 C 78 43 75 46 70 46 L 55 46 L 55 35 Z" 
        fill="url(#goldGradient)"
      />
      
      {/* Inner circle for P */}
      <circle cx="67" cy="38" r="4" fill="#1A365D"/>
      
      {/* Verification checkmark accent */}
      <circle cx="75" cy="65" r="10" fill="#ECC94B"/>
      <path 
        d="M 70 65 L 73 68 L 80 61" 
        stroke="#1A365D" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
      />
      
      {/* Subtle glow effect */}
      <circle cx="50" cy="50" r="48" fill="url(#glowGradient)" opacity="0.2"/>
      
      <defs>
        {/* Background gradient */}
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A365D"/>
          <stop offset="100%" stopColor="#2D4A7C"/>
        </linearGradient>
        
        {/* Gold gradient */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F6E05E"/>
          <stop offset="50%" stopColor="#ECC94B"/>
          <stop offset="100%" stopColor="#D69E2E"/>
        </linearGradient>
        
        {/* Glow effect */}
        <radialGradient id="glowGradient">
          <stop offset="0%" stopColor="#ECC94B" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#ECC94B" stopOpacity="0"/>
        </radialGradient>
      </defs>
    </svg>
  );
}
