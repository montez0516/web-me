import { useRef, useState } from "react";
import SeekBar from "./seekBar";
import type { Info } from "./types";
import StateBar from "./stateBar";
type Props = {
  file: string;
};

export default function Editor({ file }: Props) {
  const videoEl = useRef<HTMLVideoElement | null>(null);
  const [info, setInfo] = useState<Info | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const handleMetaData = () => {
    const video = videoEl.current;
    if (!video) return;

    const duration = video.duration;
    if(duration > 0)
      setInfo({
        duration: video.duration,
        minDuration: 0,
        maxDuration: video.duration,
      });
    else setInfo(null);
    console.log(info);
  };

  const handleTimeUpdate = () => {
    if (!info) return;
    const video = videoEl.current;
    if (!video) return;
    const currentTime = video.currentTime;
    console.log(info);
    if (currentTime !== undefined && currentTime >= info.maxDuration) {
      video.pause();
      if (video.currentTime != info.maxDuration)
        video.currentTime = info.maxDuration;
    } else if (currentTime !== undefined && currentTime < info.minDuration) {
      video.currentTime = info.minDuration;
    }
    setCurrentTime(currentTime);
  };

  const saveChanges = () => {
    if(!info) return;
    console.log(file, info.minDuration, info.maxDuration);
    (async () => {
      const res = await fetch("http://127.0.0.1/api/ffmpeg",
        {
          method:"POST",
          body:JSON.stringify({action:"trim", filename:file, min:info?.minDuration, max:info?.maxDuration}),
          headers:{
            "Content-Type":"application/json"
          }
        }
      );

      if(!res.ok)
        return;
      
      console.log(await res.text());
    })();
  }


  return (
    <div className="flex flex-col w-1/2 h-full bg-neutral-900 rounded-[10px] p-5">
      <div id="top" className="w-full flex-1 flex items-center justify-center">
        <StateBar name={file.split("/").pop() || "video.mp4"} />
      </div>
      <div
        id="middle"
        className="w-full flex-2 bg-neutral-700 flex items-center justify-center"
      >
        <div id="media-display" className="w-full h-full bg-neutral-800">
          {file && (

            <video
            src={"http://127.0.0.1" + file}
            ref={videoEl}
            controls
            onLoadedMetadata={handleMetaData}
            onError={() => setInfo(null)}
            onTimeUpdate={handleTimeUpdate}
          className="w-full h-full bg-black aspect-video"
          ></video>
        )}
        </div>
      </div>
      <div
        id="bottom"
        className="w-full flex-1 flex flex-col"
      >
        {info && (
          <>
            <SeekBar
            info={info}
            currentTime={currentTime}
            onDurationChanged={setInfo}
            onPositionChanged={(num) => {
              const video = videoEl.current;
              if (!video) return;
              
              video.currentTime = num;
            }}
            />
            <div className="w-1/6 h-1/4 bg-neutral-800 rounded-md text-white text-center content-center outline-1 outline-white"
              onClick={saveChanges}
            >
              Save
            </div>
            </>
        )}
      </div>
    </div>
  );
}
