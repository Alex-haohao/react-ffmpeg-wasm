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
        ffmpeg.FS('writeFile', 'test.mp4', await fetchFile('https://cn-sdjn2-cu-v-06.bilivideo.com/upgcxcode/30/75/478047530/478047530-1-208.mp4?e=ig8euxZM2rNcNbNM7bdVhwdlhbKjhwdVhoNvNC8BqJIzNbfq9rVEuxTEnE8L5F6VnEsSTx0vkX8fqJeYTj_lta53NCM=&uipk=5&nbs=1&deadline=1641931674&gen=playurlv2&os=bcache&oi=3732974682&trid=0000f7833845267b4a739d6153201aa30bd8T&platform=html5&upsig=0c107712d7ab76b5b19dfbe81ba6d1cc&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,platform&cdnid=8173&mid=0&bvc=vod&nettype=0&bw=246854&orderid=0,1&logo=80000000'));
        await ffmpeg.run('-i', 'test.mp4');
        console.log(logs);
        console.log("12312312")
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
