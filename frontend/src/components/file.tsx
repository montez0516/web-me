
export type FileInfo = {
  name:string;
  type: "file" | "directory";
  mtime:string;
}

type Props = {
    info: FileInfo;
    onClicked: (info : FileInfo) => void;
};

export function File({info, onClicked} : Props){

    return (
        <div 
        className="
        w-full h-1/10 hover:bg-neutral-700 content-center px-5 border-black dark:border-neutral-500 border-b    
        overflow-hidden text-ellipsis whitespace-nowrap
        "
        onClick={() => onClicked(info)}
        >
            
            {info.name}
        </div>
    )

}