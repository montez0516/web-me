import TrimSvg from "./resources/trim.svg";
import CropSvg from "./resources/crop.svg";

type Props = { name: string };
export default function StateBar({ name }: Props) {
  const states = { trim: TrimSvg, crop: CropSvg };

  return (
    <div className="w-full h-2/3">
      <div className="flex flex-row w-full h-full bg-neutral-800 rounded-md">
        <div id="left" className="flex flex-row flex-1 h-full flex-wrap">
          {Object.keys(states).map((key: string) => {
            return (
              <div key={key} className="w-1/3 h-1/2 p-2">
                <div className="w-full h-full bg-neutral-700/50 hover:bg-neutral-700 rounded-md">
                  <img
                    src={states[key as keyof typeof states]}
                    alt={key}
                    className="w-full h-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div id="middle" className="flex-2 h-full">
          <div className="h-1/2"></div>
          <div className="w-full text-center bg-neutral-700/50 rounded-md py-2 text-white">
            {name}
          </div>
        </div>
        <div id="right" className="flex-1 h-full"></div>
      </div>
    </div>
  );
}
