import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import myVideo from "./static/test.mp4"

// TianhaoXi ffmpeg wasm test
function App() {
    const logs:any = [];
    const [videoSrc, setVideoSrc] = useState('');
    const imgRef = useRef<HTMLImageElement>(null);
    const [message, setMessage] = useState('Click Start to transcode');
    const logger = new EventTarget();
    const ffmpeg = createFFmpeg({
        log: true,
        logger: (l) => {
            logger.dispatchEvent(new CustomEvent("log", { detail: l }));
        },
    });


    useEffect(() => {
        let log_func = (e:any)=>{
            logs.push({ type: e.detail.type, msg: e.detail.message });
        };
        logger.addEventListener("log", log_func);
    }, []);

    const doTranscode = async () => {
        setMessage('Loading ffmpeg-core.js');
        await ffmpeg.load();
        setMessage('get mp4 info');
        // await ffmpeg.FS('writeFile', 'test.mp4', await fetchFile('/static/test.mp4'));
        // write the mp4 to the FFmpeg file system
        const sourceBuffer = await fetch(myVideo).then(r => r.arrayBuffer());
        await ffmpeg.FS(
            "writeFile",
            "test.mp4",
            new Uint8Array(sourceBuffer, 0, sourceBuffer.byteLength)
        );
        // run ffmpeg command to generate css sprite
        await ffmpeg.run('-y', '-i', 'test.mp4', '-f', 'image2', '-vframes', '1', '-vf', `select=(isnan(prev_selected_t)+gte(t-prev_selected_t\\,2)),scale=180:101,crop=180:100,tile=1x6,format=pix_fmts=rgb24` ,'output.jpg')
        // get the output file from the FFmpeg file system
        const res = ffmpeg.FS('readFile', 'output.jpg');
        // set the output image to the image ref
        imgRef.current!.src = URL.createObjectURL(
            new Blob([res.buffer], { type: 'image/png' } /* (1) */)
        );
    };

    // const handleFileInputChange = (e:any) =>{
    //     if ( e.target.files && e.target.files.length > 0) {
    //             setFile(e.target.files[0]);
    //     }
    // }

  return (
    <div className="App">
        {/*<input type="file" onChange={handleFileInputChange} />*/}
      <video controls
             width={640}
             height={480}
      />
        <button onClick={doTranscode}>Start</button>
        <img ref={imgRef}  id="my-img" src="" alt=""/>
    </div>
  );
}

export default App;
