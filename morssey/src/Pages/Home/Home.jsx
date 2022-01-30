import './Home.scss';
import {morseToEng } from '../../translator.js';
import {engToMorse } from '../../translator.js';
import {tts} from '../../textToSpeech.js';
import './Home.scss';
import {saveAs} from "file-saver";
import { useState, useEffect } from 'react';
import Border from '../../Assets/layered-steps-haikei.svg'
import Dialog from '../../Components/Dialog/Dialog';

import MorseCWWave from 'morse-pro/lib/morse-pro-cw-wave.js';
import MorsePlayerWAALight from 'morse-pro/lib/morse-pro-player-waa-light';
import FileDropDialog from '../../Components/FileDropDialog/FileDropDialog';

var morseCWWave = new MorseCWWave();
morseCWWave.translate("");
var morsePlayerWAALight = new MorsePlayerWAALight();
morsePlayerWAALight.loadCWWave(morseCWWave);
var blob = new Blob([""],{type: "text/plain;charset=utf-8"})






const MorseToEnglish = () => {

   const [animationID, setAnimationID] = useState();
   const [listening, setListening] = useState(false);
   const [input, setInput] = useState('');
   const [output, setOutput] = useState('Output...');
   const [openPopup, setOpenPopup] = useState(false);
   const [openFileDrop, setOpenFileDrop] = useState(false);


   const startListening = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const audioContext = new AudioContext();
      const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
      const analyserNode = audioContext.createAnalyser();
      mediaStreamAudioSourceNode.connect(analyserNode);


      let listening        = false;
      let addedSpace       = false;
      let secondSpace      = false;
      let noiseDuration    = 0;
      let silenceDuration  = 0;
      const pcmData = new Float32Array(analyserNode.fftSize);


      const onFrame = () => {
         const el = document.querySelector('.input-area')


         analyserNode.getFloatTimeDomainData(pcmData);
         let sumSquares = 0.0;
         for (const amplitude of pcmData) { sumSquares += amplitude*amplitude; }
         console.log(addedSpace, secondSpace)
         console.log(silenceDuration)

         // If the sound goes above 10 (We are making a noise), check the flag
         if (sumSquares > 10 && !listening) {
            listening = true;
         } 

         // If we're currently listening and the sound goes above 50, increase count
         else if (sumSquares > 40 && listening) { 
            noiseDuration++;
            silenceDuration = 0;
         }

         // If the volume goes down and we WERE listening, apply correct symbol
         if (sumSquares < 5 && listening) {
            // Add correct symbol
            const symbol = noiseDuration > 15 ? el.innerHTML + '-' : el.innerHTML + '.'
            const newInput = input + symbol
            setInput(newInput)

            // Reset values
            addedSpace = false
            secondSpace = false
            silenceDuration = 0;
            listening = false
            noiseDuration = 0;
         }

         // If the volume is negligable and we havne't added a space yet, increase silence count
         if (sumSquares < 5 && (!addedSpace || !secondSpace)) silenceDuration++;

         // If the duration of silence is >100 and we haven't added a space yet, add a space
         if (silenceDuration > 80 && !addedSpace && el.innerHTML !== '') {
            const newInput = el.innerHTML + ' '  
            setInput(newInput)
            addedSpace = true;
         }

         // If we've added the first space and haven't added the second one and the silence duration > 200, add a space
         if (silenceDuration > 160 && addedSpace && !secondSpace) {
            const newInput = el.innerHTML + ' '  
            setInput(newInput)
            secondSpace = true;
         }


         setAnimationID(window.requestAnimationFrame(onFrame));
      };
      setAnimationID(window.requestAnimationFrame(onFrame));
   }

   const stopListening = () => {
      window.cancelAnimationFrame(animationID)
      setInput(document.querySelector('.input-area').innerHTML)
   }

   const toggleListening = () => {
      setListening(!listening)
      if (listening) stopListening()
      else startListening()
   }


   const inputOptions = [
      {
         icon: listening ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 10c0 2.209-1.791 4-4 4s-4-1.791-4-4v-6c0-2.209 1.791-4 4-4s4 1.791 4 4v6zm4-2v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-7 13.03v-2.03h-2v2.03c-2.282.139-4 .744-4 1.47 0 .829 2.238 1.5 5 1.5s5-.671 5-1.5c0-.726-1.718-1.331-4-1.47z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c1.103 0 2 .897 2 2v7c0 1.103-.897 2-2 2s-2-.897-2-2v-7c0-1.103.897-2 2-2zm0-2c-2.209 0-4 1.791-4 4v7c0 2.209 1.791 4 4 4s4-1.791 4-4v-7c0-2.209-1.791-4-4-4zm8 9v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-7 13v-2h-2v2h-4v2h10v-2h-4z"/></svg>,
         onClick: () => toggleListening(),
         title: listening ? 'Stop listening' : 'Input via audio'
      },
      {
         icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 10h-5l9-10 9 10h-5v10h-8v-10zm11 9v3h-14v-3h-2v5h18v-5h-2z"/></svg>,
         onClick: () => setOpenFileDrop(true),
         title: 'Upload .txt file'
      },
      {
         icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.793 8.951c1.062-.757 2.542-.239 2.912 1-.655-.502-1.528-.482-2.2-.002-.677.482-.976 1.303-.716 2.082-1.05-.755-1.055-2.325.004-3.08zm3.164 10.8c.841.283 3.443 1.003 6.458 3.249l5.585-3.984c-1.448-2.031-1.05-3.452-2.489-5.471-.726-1.017-1.222-1.294-1.845-1.294-.22 0-.456.035-.724.084l.507.71c.306.428-.34.889-.646.46l-.452-.634c-.149-.21-.357-.281-.596-.281-.345 0-.753.148-1.141.237l.615.862c.304.428-.34.889-.646.46l-.533-.747c-.148-.208-.353-.28-.586-.28-.359 0-.787.17-1.186.271l.65.912c.306.429-.343.887-.646.46l-2.638-3.693c-.817-1.148-2.612.07-1.765 1.259l3.895 5.461c-.418-.154-1.152-.295-1.632-.295-1.481.003-2.051 1.628-.185 2.254zm-2.715-2.751h-6.242v-14h18v7.516c1.359.555 2.391 2.046 3 3.372v-10.888c0-1.104-.896-2-2-2h-20c-1.104 0-2 .896-2 2v14c0 1.104.896 2 2 2h6.825c-.111-.69.002-1.358.417-2z"/></svg>,
         onClick: () => setOpenPopup(true),
         title: 'Input via tapping'
      },
      {
         icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>,
         onClick: () => setOutput(morseToEng(input)),
         title: 'Submit Text'
      }
   ]
   const outputOptions = [
      {
         icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 17h-5v-10h5v10zm2-10v10l9 5v-20l-9 5zm17 4h-5v2h5v-2zm-1.584-6.232l-4.332 2.5 1 1.732 4.332-2.5-1-1.732zm1 12.732l-4.332-2.5-1 1.732 4.332 2.5 1-1.732z"/></svg>,
         onClick: () => tts(output),
         title: 'Output via audio'
      },
      {
         icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 11h5l-9 10-9-10h5v-11h8v11zm3 8v3h-14v-3h-2v5h18v-5h-2z"/></svg>,
         onClick: () => {
            blob = new Blob([output],{type: "text/plain;charset=utf-8"})
            saveAs(blob,"donwload.txt")
         },
         title: 'Download output text',
      }
   ]


   const setInputVal = input => {
      setInput(input)
   }



   return (
      <div className="morse-to-english section">
         <h2>Morse Code to English</h2>
         <div className="section-content">
            <textarea value={input} placeholder='Enter morse here...' className='input-area' onChange={ e => setInput(e.target.value) }/>
            <div className="options input">
               {
                  inputOptions.map(({ icon, onClick, title }) => (
                     <button className="option" onClick={ onClick }>
                        { icon }
                        <span>{ title }</span>
                     </button>
                  ))
               }
            </div>
            <div className="output">
               <span className='placeholder'>{ output }</span>
            </div>
            <div className="options">
               {
                  outputOptions.map(({ icon, onClick, title }) => (
                     <button className="option" onClick={ onClick }>
                        { icon }
                        <span>{ title }</span>
                     </button>

                  ))
               }
            </div>
         </div>


         <Dialog open={ openPopup } setOpen={ setOpenPopup } setInputVal={ setInputVal } />
         <FileDropDialog 
            open={ openFileDrop } 
            setOpen={ setOpenFileDrop } 
            setInput={ setInput } />
      </div>
   );
}

const EnglishToMorse = () => {

   const [listening, setListening] = useState(false);


   const inputOptions = [
      {
         icon: listening ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 10c0 2.209-1.791 4-4 4s-4-1.791-4-4v-6c0-2.209 1.791-4 4-4s4 1.791 4 4v6zm4-2v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-7 13.03v-2.03h-2v2.03c-2.282.139-4 .744-4 1.47 0 .829 2.238 1.5 5 1.5s5-.671 5-1.5c0-.726-1.718-1.331-4-1.47z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c1.103 0 2 .897 2 2v7c0 1.103-.897 2-2 2s-2-.897-2-2v-7c0-1.103.897-2 2-2zm0-2c-2.209 0-4 1.791-4 4v7c0 2.209 1.791 4 4 4s4-1.791 4-4v-7c0-2.209-1.791-4-4-4zm8 9v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-7 13v-2h-2v2h-4v2h10v-2h-4z"/></svg>,
         onClick: () => SpeechToText(),
         title: listening ? 'Stop listening' : 'Speech to text'
      },
      {
         icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 10h-5l9-10 9 10h-5v10h-8v-10zm11 9v3h-14v-3h-2v5h18v-5h-2z"/></svg>,
         onClick: () => console.log("Clicked"),
         title: 'Upload .txt file'
      },
      {
         icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>,
         onClick: () => setOutput(engToMorse(input)),
         title: 'Submit Text'
      }
   ]
   const outputOptions = [
      {
         icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 17h-5v-10h5v10zm2-10v10l9 5v-20l-9 5zm17 4h-5v2h5v-2zm-1.584-6.232l-4.332 2.5 1 1.732 4.332-2.5-1-1.732zm1 12.732l-4.332-2.5-1 1.732 4.332 2.5 1-1.732z"/></svg>,
         onClick: () => {console.log(input)
         //morseCWWave = new MorseCWWave()
         morseCWWave.translate(input)
         //morsePlayerWAALight = new MorsePlayerWAALight()
         morsePlayerWAALight.loadCWWave(morseCWWave)
         morsePlayerWAALight.playFromStart()},

         title: 'Output via audio'
      },
      {
         icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 2c-1.105 0-2 .896-2 2v14.678c-.001 2.213 2.503 3.322 6.005 3.322 3.499 0 5.995-1.106 5.995-3.322v-14.678c0-1.104-.895-2-2-2h-8zm4 18c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1zm4-4h-8v-10h8v10zm4-7.459c.496.495.803 1.179.803 1.935.001.755-.305 1.44-.8 1.936l.814.814c.703-.704 1.139-1.677 1.139-2.751-.001-1.075-.436-2.046-1.141-2.749l-.815.815zm1.427-1.426c.86.859 1.393 2.046 1.393 3.358.001 1.313-.532 2.502-1.391 3.363l.834.835c1.074-1.075 1.738-2.56 1.737-4.198 0-1.639-.664-3.121-1.737-4.193l-.836.835zm-18.241.611c-.705.703-1.14 1.674-1.141 2.748s.435 2.047 1.139 2.751l.814-.814c-.495-.496-.8-1.18-.8-1.936s.307-1.44.802-1.935l-.814-.814zm-1.447-1.447c-1.075 1.073-1.738 2.554-1.739 4.194-.001 1.638.664 3.124 1.737 4.198l.834-.835c-.859-.861-1.391-2.05-1.39-3.363 0-1.312.531-2.5 1.392-3.358l-.834-.836z"/></svg>,
         onClick: () => vibrate(output),

         title: 'Output via vibrations'
      },
      {
         icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 11h5l-9 10-9-10h5v-11h8v11zm3 8v3h-14v-3h-2v5h18v-5h-2z"/></svg>,
         onClick: () => {
            blob = new Blob([output],{type: "text/plain;charset=utf-8"})
            saveAs(blob,"donwload.txt")
         },
         title: 'Download output text'
      }
   ]

   const [input, setInput] = useState('');
   const [output, setOutput] = useState('Output...');

   const SpeechToText = () => {
      setListening(!listening);

      const el = document.querySelector('.input-area1');

      let speechRecognition = new window.webkitSpeechRecognition()
      let final_transcript = "";
      
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.start();
      speechRecognition.onresult = (event) => {
         let interim_transcript = "";
      
         for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
               final_transcript += event.results[i][0].transcript;
            } else {
               interim_transcript += event.results[i][0].transcript;
            }
         }
         el.innerHTML = interim_transcript;
         setInput(interim_transcript);
      };
            
      if(listening)
         speechRecognition.stop();
   }
   
   const vibrate = (v) => {
      let morseString = v;
   
       let vibeArr = []
       for(let k = 0; k < morseString.length; k++) {
           let c = morseString.charAt(k)
   
           if(c == ".") {
               vibeArr.push(500)
               vibeArr.push(150)
           }
           else if(c == "-") {
               vibeArr.push(1000)
               vibeArr.push(150)
           }
           else
               vibeArr.push(2500)
       }
   
       if (!window) {
           return;
       }
   
       if (!window.navigator) {
           return;
       }
   
       if (!window.navigator.vibrate) {
           return;
       }
   
       window.navigator.vibrate(vibeArr);
   }

   return (
      <div className="english-to-morse section">
         <h2>English to Morse Code</h2>
         <div className="section-content">
            <textarea  placeholder='Enter text here...'  className='input-area1' onChange={ e => setInput(e.target.value) }/>

            <div className="options input">
               {
                  inputOptions.map(({ icon, onClick, title }) => (

                     <button className="option" onClick={ onClick }>
                        { icon }
                        <span>{ title }</span>
                     </button>

                  ))
               }
            </div>

            <div className="output">
               <span className="placeholder">{ output }</span>
            </div>
            <div className="options">
               {
                  outputOptions.map(({ icon, onClick, title }) => (
                     <button className="option" onClick={ onClick }>
                        { icon }
                        <span>{ title }</span>
                     </button>

                  ))
               }
            </div>
         </div>



      </div>
   );
}

const Header = () => {


   return (
      <div className="header">
         <h1>Morssey</h1>
         <p>Your new go to unniversal, bi-directional morse code translator. It fits all situations whether it's converting to morse from sound, voice, text file, or keyboard, or morse to sound, voice, or text.</p>
      </div>
   )
}

const HeaderDemo = () => {

   const inputs = [
      {
         in: 'hello world',
         out: '.... . .-.. .-.. ---  .-- --- .-. .-.. -..'
      },
      {
         in: 'happy hacking',
         out: '.... .- .--. .--. -.--  .... .- -.-. -.- .. -. --.'
      },
      {
         in: 'goodbye',
         out: '--. --- --- -.. -... -.-- .'
      }
   ]

   const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

   const typeWord = async (word, el, speed) => {
      for (let i = 0; i < word.length; i++) {
         el.innerHTML = el.innerHTML + word[i]
         await sleep(speed)
      }
   }

   const deleteWord = async (word, el, speed) => {
      for (let i = 0; i < word.length; i++) {
         el.innerHTML = el.innerHTML.slice(0, -1);
         await sleep(speed)
      }
   }

   const type = async () => {
      const inputEl = document.querySelector('.demo').querySelector('.input').firstElementChild;
      const outputEl = document.querySelector('.demo').querySelector('.output').firstElementChild;

      await sleep(3000);

      for (let i = 0; true; i++) {
         const input = inputs[i % 3].in
         const output = inputs[i % 3].out

         await typeWord(input, inputEl, 100)
         await sleep(100)
         await typeWord(output, outputEl, 50)
         await sleep(2000)
         await deleteWord(output, outputEl, 50)
         await sleep(100)
         await deleteWord(input, inputEl, 50)
      }

   }

   


   useEffect(() => {

      type()
   }, []);



   return (

      <div className="demo">
         <div className="input">
            <span></span>
         </div>
         <div className="output">
            <span></span>
         </div>
      </div>
   )
}




const HomePage = () => {

   

  return (
    <div className='home-page'>

      <Header />
      <HeaderDemo />
      <img src={Border} className='border' />
      <MorseToEnglish />
      <EnglishToMorse />

      


    </div>
  );
};

export default HomePage;
