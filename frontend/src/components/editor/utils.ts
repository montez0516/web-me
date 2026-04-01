
export const positionToTime = (rect : DOMRect, pos: number, duration : number) => {

    if (!rect || !pos) return 0;

    const width = rect.width;
    const percent = pos / width;
    const clamped = Math.max(0, Math.min(1, percent));
    const time = duration * clamped;
    console.log(time)
    return time ;
  };

export const timeToPosition = (duration : number, time : number) =>
{

  const percent = time / duration;

  return percent * 100;
}
export const positionToTimeString = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    const str = `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`; 
    console.log(str);
    return str;
  };

