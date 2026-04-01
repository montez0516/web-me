type Props = {
  height?: number;      // px
  thickness?: number;   // px (border width)
  position: number;     // percent (0–100)
  color?: string;
  text?: string;
};

export default function Tick({
  height = 100,
  thickness = 1,
  position,
  color = "white",
  text,
}: Props) {
  return (
    <div
      className="absolute top-0 text-xs text-white"
      style={{
        left: `${position}%`,
        transform: "translateX(-50%)",
        height: `${height}%`,
        borderRight: `${thickness}px solid ${color}`,
      }}
    >
      {text && (
        <span className="absolute top-full mt-1 -translate-x-1/2">
          {text}
        </span>
      )}
    </div>
  );
}