import { useEffect, useState } from "react";
import { type FileInfo } from "./file"
import { File } from "./file"
type Props = {
    cwd: string;
    onFileChanged: (info: FileInfo) => void;
}
export default function FileView({ cwd, onFileChanged }: Props) {
    const [files, setFiles] = useState<FileInfo[] | null>(null)

    // Get files
    useEffect(() => {
        (async () => {
            const res = await fetch(cwd);

            if (!res.ok)
                return;

            const _files: FileInfo[] = await res.json();
            if (cwd != "/media/")
                _files.unshift({ name: "../", type: "directory", mtime: "" })
            setFiles(_files);
        })();
    }, [cwd]);

    return (
        <div className="w-1/2 h-full flex items-center justify-center">
            <div className="w-1/2 h-1/2 bg-neutral-900 rounded-md outline-1 outline-black p-4 text-white">
                <div className="w-full h-full outline-1 outline-white rounded-md overflow-scroll">
                    {files && files.map((info) => <File key={info.name} info={info} onClicked={onFileChanged} />)}

                </div>
            </div>
        </div>
    )
}