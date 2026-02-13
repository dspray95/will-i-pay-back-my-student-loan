import { colorPiccadillyBlue } from "../constants/color";

export const OutlineText: React.FC<{
  children: string;
  color?: string;
  height?: number;
}> = ({ children, color = colorPiccadillyBlue, height = 75 }) => {
  return (
    <svg className="overflow-visible" width="100%" height={height}>
      <text
        x="50%"
        y="65%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-8xl font-semibold"
        fill="transparent"
        stroke={color}
        strokeWidth="2"
        style={{ fontSize: "clamp(4rem, 8vw, 6rem)", fontWeight: 600 }}
      >
        {children}
      </text>
    </svg>
  );
};
