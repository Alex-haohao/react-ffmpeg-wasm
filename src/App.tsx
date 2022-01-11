import React, {useEffect, useState} from 'react';
import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

function App() {
    const logs:any = [];
    const [videoSrc, setVideoSrc] = useState('');
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
        ffmpeg.FS('writeFile', 'test.mp4', await fetchFile('/static/test.mp4'));
        await ffmpeg.run('-i' ,'test.mp4' ,'-vf' ,'\'fps=1/10:round=zero:start_time=-9,scale=190x100,tile=5x5\'', 'output.jpg');
        // ffmpeg.FS('writeFile', 'output.jpg', new Uint8Array(await ffmpeg.FS('readFile', 'output.jpg')));
    };

  return (
    <div className="App">
      <video controls
             width={640}
             height={480}
      />
        <button onClick={doTranscode}>Start</button>
    </div>
  );
}

export default App;
