import { colorPiccadillyBlue } from "../constants/color";

export const OutlineText: React.FC<{
  children: string;
  color?: string;
  height?: number;
  fontSize?: string;
  strokeWidth?: number;
}> = ({ children, color = colorPiccadillyBlue, height = 75, fontSize, strokeWidth = 2 }) => {
  return (
    <svg className="overflow-visible" width="100%" height={height}>
      <text
        x="50%"
        y="65%"
        textAnchor="middle"
        dominantBaseline="middle"
        className={fontSize ? "font-semibold" : "text-5xl sm:text-7xl lg:text-8xl font-semibold"}
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth}
        style={{ fontWeight: 600, ...(fontSize ? { fontSize } : {}) }}
      >
        {children}
      </text>
    </svg>
  );
};
