interface Props {
  color?: string;
  size?: number;
}

export function OrigemMineralLogo({ color = "white", size = 64 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 88"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Hexágono superior — coroa da gema */}
      <polygon
        points="40,4 68,20 68,48 40,64 12,48 12,20"
        stroke={color}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />

      {/* Facetas internas da coroa (centro em 40,34) */}
      <line x1="40" y1="4"  x2="40" y2="34" stroke={color} strokeWidth="1.4" strokeOpacity="0.7"/>
      <line x1="12" y1="20" x2="40" y2="34" stroke={color} strokeWidth="1.4" strokeOpacity="0.7"/>
      <line x1="68" y1="20" x2="40" y2="34" stroke={color} strokeWidth="1.4" strokeOpacity="0.7"/>
      <line x1="12" y1="48" x2="40" y2="34" stroke={color} strokeWidth="1.4" strokeOpacity="0.7"/>
      <line x1="68" y1="48" x2="40" y2="34" stroke={color} strokeWidth="1.4" strokeOpacity="0.7"/>
      <line x1="40" y1="64" x2="40" y2="34" stroke={color} strokeWidth="1.4" strokeOpacity="0.7"/>

      {/* Pavilhão — ponta inferior */}
      <polyline
        points="12,48 40,84 68,48"
        stroke={color}
        strokeWidth="2.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Linha central do pavilhão */}
      <line x1="40" y1="64" x2="40" y2="84" stroke={color} strokeWidth="1.4" strokeOpacity="0.7" strokeLinecap="round"/>
    </svg>
  );
}
