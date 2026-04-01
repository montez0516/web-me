import { useState } from 'react'
import Editor from './components/editor/editor'
import FileView from './components/fileView'
import './App.css'
import type { FileInfo } from './components/file';


function App() {
  const [cwd, setCwd] = useState("/media/");
  const [file, setFile] = useState("");

  const handleFileChanged = (info: FileInfo) => {
    const name = info.name;
    const type = info.type;

    const cwdParts = cwd.split("/");
    cwdParts.pop();
    const prevUri = cwdParts.join("/");



    if(type == "file")
      setFile(cwd + name);
    else if(type == "directory")
    {
      if(name == "../")
        setCwd(prevUri);
      else
        setCwd(cwd + `${name}/`);
    }
  }

  return (
    <div className="w-full h-full dark:bg-neutral-800 flex flex-row">
      <FileView cwd={cwd} onFileChanged={handleFileChanged}/>
      <Editor file={file}/>
    </div>
  )
}

export default App
