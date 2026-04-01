import React, { useState, useEffect, useRef } from "react";
import { type Info } from "./types";
import { positionToTime, positionToTimeString, timeToPosition } from "./utils";

type Props = {
  info?: Info;
  currentTime: number;
  onDurationChanged: (info: Info) => void;
  onPositionChanged: (pos: number) => void;
};

export default function SeekBar({
  info,
  currentTime,
  onDurationChanged,
  onPositionChanged,
}: Props) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [slider, setSlider] = useState<"left" | "right" | "head" | null>(null);
  const segments = 10;

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) {
      setRect(null);
      return;
    }
    setRect(bar.getBoundingClientRect());
  }, [barRef]);

  const handleClick = (e: React.MouseEvent) => {
    if (e.target != barRef.current) return;
    const pos = e.clientX - (rect?.left || 0);
    if (!rect || slider || !info) return;

    onPositionChanged(positionToTime(rect, pos, info.duration || 0));
  };

  const handleSliderClick = (_slider: "left" | "right" | "head") => {
    setSlider(_slider);
  };

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      if (!rect || !info) return;

      const pos = e.clientX - rect.left;

      const time = positionToTime(rect, pos, info.duration);

      if (slider == "left") onDurationChanged({ ...info, minDuration: time });
      else if (slider == "right")
        onDurationChanged({ ...info, maxDuration: time });
      else if (slider == "head")
        onPositionChanged(
          Math.max(info.minDuration, Math.min(info.maxDuration, time)),
        );
    };

    const handleUp = () => {
      setSlider(null);
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [slider]);

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <div
        ref={barRef}
        className="w-full h-1/2 bg-neutral-800 rounded-md relative"
        onClick={handleClick}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleSliderClick("head");
        }}
      >
        {info && (
          <>
          <div className="w-full h-full">
            {[...Array(segments + 1)].map((_, i) => {
              const percent = i / segments;

              const time = (info?.duration || 0) * percent;
              console.log(percent, time)
              return (
                <div
                  key={i}
                  className="h-full absolute top-0 border-r border-white hover:border-r-2 text-xs"
                  style={{
                    left: `${percent * 100}%`,
                  }}
                >
                  <span className="absolute top-full mt-1 -translate-x-1/2 text-white">
                    {positionToTimeString(time)}
                  </span>
                </div>
              );
            })}
          </div>
        <div
          className="h-full absolute top-0 border-r border-red-500 hover:border-r-2 text-xs text-red-500"
          style={{
            left: `${timeToPosition(info.duration, currentTime)}%`,
          }}
        >
          <span className="absolute -top-1/4 mt-1 -translate-x-1/2">
            {positionToTimeString(currentTime)}
          </span>
        </div>
        {currentTime != info.minDuration && (
          <div
            className="h-full absolute top-0 border-r-2 border-yellow-500 hover:border-r-3 text-xs text-yellow-500"
            style={{
              left: `${timeToPosition(info.duration || 0, info.minDuration || 0)}%`,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              handleSliderClick("left");
            }}
          >
            <span className="absolute -top-1/4 mt-1 -translate-x-1/2">
              {positionToTimeString(info.minDuration || 0)}
            </span>
          </div>
        )}
        {currentTime != info.maxDuration && (
          <div
            className="h-full absolute top-0 border-r-2 border-yellow-500 hover:border-r-3 text-xs text-yellow-500"
            style={{
              left: `${timeToPosition(info.duration || 0, info.maxDuration || 0)}%`,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              handleSliderClick("right");
            }}
          >
            <span className="absolute -top-1/4 mt-1 -translate-x-1/2">
              {positionToTimeString(info.maxDuration || 0)}
            </span>
          </div>
        )}
      </>)}
      </div>
    </div>
  );
}
1 / 2;
